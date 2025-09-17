// src/pages/student/TaskDetail.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Star, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

// --- Componente de Modal ---
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md m-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose}><X size={24} /></button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);


const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los modales
  const [showImpugnarModal, setShowImpugnarModal] = useState(false);
  const [showCalificarModal, setShowCalificarModal] = useState(false);
  const [impugnarMotivo, setImpugnarMotivo] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');


  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      // 1. Obtener detalles de la tarea
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          assistant:users!tasks_assistant_id_fkey (id, full_name),
          student:users!tasks_student_id_fkey (id),
          task_type:task_types (name),
          career:careers (name)
        `)
        .eq('id', taskId)
        .single();

      if (taskError) console.error('Error fetching task:', taskError);
      else setTask(taskData);

      // 2. Obtener historial de la tarea
      const { data: timelineData, error: timelineError } = await supabase
        .from('task_status_timeline')
        .select('*')
        .eq('task_id', taskId)
        .order('completed_at', { ascending: false });
      
      if (timelineError) console.error('Error fetching timeline:', timelineError);
      else setTimeline(timelineData);

      // 3. Obtener archivos de la tarea
      const { data: filesData, error: filesError } = await supabase
        .from('task_files')
        .select(`
          upload_type,
          file:files (*)
        `)
        .eq('task_id', taskId);

      if (filesError) console.error('Error fetching files:', filesError);
      else setFiles(filesData);

      setLoading(false);
    };

    fetchTaskData();
  }, [taskId]);

  const updateTaskStatus = async (newStatus, timelineTitle) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
  
    // 1. Actualizar el estado de la tarea
    const { error: taskUpdateError } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
    if (taskUpdateError) {
      console.error(`Error updating task status to ${newStatus}:`, taskUpdateError);
      return;
    }
  
    // 2. Invalidar el estado actual en el timeline
    await supabase
        .from('task_status_timeline')
        .update({ is_current: false })
        .eq('task_id', taskId)
        .eq('is_current', true);

    // 3. Añadir nuevo registro al timeline
    const { error: timelineInsertError } = await supabase
      .from('task_status_timeline')
      .insert({
        task_id: taskId,
        status: newStatus,
        title: timelineTitle,
        created_by: user.id,
        is_current: true
      });
    if (timelineInsertError) {
      console.error('Error inserting into timeline:', timelineInsertError);
      return;
    }
  
    // 4. Actualizar el estado local para reflejar el cambio
    setTask(prev => ({ ...prev, status: newStatus }));
  };

  const handleCancelTask = async () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta tarea?')) {
      await updateTaskStatus('Tarea Cancelada', 'Tarea cancelada por el estudiante');
    }
  };

  const handleApproveTask = async () => {
    await updateTaskStatus('Tarea Aprobada', 'Tarea aprobada por el estudiante');
  };

  const handleImpugnarTask = async () => {
    await updateTaskStatus('Tarea Impugnada', `Tarea impugnada: ${impugnarMotivo}`);
    setShowImpugnarModal(false);
    setImpugnarMotivo('');
  };
  
  const handleRateTask = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !task.assistant) return;
  
    const { error } = await supabase
      .from('ratings')
      .insert({
        task_id: taskId,
        rated_by: user.id,
        rated_user: task.assistant.id,
        rating: rating,
        review: review,
      });
  
    if (error) {
      console.error('Error submitting rating:', error);
      alert('Error al enviar la calificación.');
    } else {
      await updateTaskStatus('Tarea Calificada', 'Asistente calificado por el estudiante');
      setShowCalificarModal(false);
    }
  };
  
  const handlePayment = () => {
    if (task.payment_type === 'group' && task.group_id) {
        navigate(`/payment/group/${task.group_id}`);
    } else {
        navigate(`/payment/transfer/individual/${taskId}`);
    }
  }


  if (loading) return <div className="p-10">Cargando detalles de la tarea...</div>;
  if (!task) return <div className="p-10">No se encontró la tarea.</div>;

  return (
    <div className="bg-white min-h-screen font-inter p-6 md:p-10">
      <div className="max-w-3xl space-y-6">
        {/* Task Summary Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-black">{task.title}</h2>
            <p className="text-sm text-gray-500">{task.career?.name} + {task.task_type?.name}</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-black">Valor:</p>
              <p className="font-bold text-green-500 text-lg">${task.total_price?.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-black">Fecha máxima de entrega:</p>
              <p className="text-sm text-gray-600">{new Date(task.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Detalles de la tarea:</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
            <div><p className="text-sm"><span className="font-medium text-black">Número de páginas:</span> {task.page_count} páginas</p></div>
            <div><p className="text-sm"><span className="font-medium text-black">Formato:</span> {task.format}</p></div>
            <div><p className="text-sm"><span className="font-medium text-black">Máximo % ia:</span> {task.max_ai_percentage}%</p></div>
            <div><p className="text-sm"><span className="font-medium text-black">Máximo % plagio:</span> {task.max_plagiarism_percentage}%</p></div>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-black mb-2">Descripción:</p>
            <p className="text-sm text-gray-700">{task.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-black mb-2">Documentos anexados:</p>
            <div className="flex gap-4">
              {files.filter(f => f.upload_type === 'requirement').map(f => (
                <div key={f.file.id} className="text-center">
                  <a href={supabase.storage.from('task_files').getPublicUrl(f.file.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 border border-gray-200">
                    <FileText size={24} className="text-gray-500" />
                  </a>
                  <p className="text-xs text-gray-600">{f.file.original_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Assistant */}
        {task.assistant && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-black">Asistente seleccionado:</h3>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl text-gray-600">{task.assistant.full_name.charAt(0)}</div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-1"><p className="font-bold text-black">{task.assistant.full_name}</p><CheckCircle2 size={16} className="text-blue-500" /></div>
                            <p className="text-sm text-gray-500">Asistente</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Development Timeline */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Desarrollo de la tarea:</h3>
          <div>
            {timeline.map((step, index) => (
              <div key={index} className="flex items-start relative pb-6 last:pb-0">
                <div className="flex-shrink-0 mr-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.is_current ? 'bg-yana-yellow' : 'border-2 border-gray-300 bg-white'}`}>
                    {step.is_current && <CheckCircle2 size={16} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                {index < timeline.length - 1 && (<div className="absolute left-3 top-6 w-0.5 h-full bg-gray-200"></div>)}
                <div>
                  <p className={`font-medium text-sm ${step.is_current ? 'text-yana-yellow' : 'text-gray-700'}`}>{step.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(step.completed_at).toLocaleString('es-ES')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sent Advances */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-black">Avances enviados:</h3>
            <div className="flex gap-4">
                {files.filter(f => f.upload_type === 'submission').map(f => (
                    <div key={f.file.id} className="text-center">
                        <a href={supabase.storage.from('task_files').getPublicUrl(f.file.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 border border-gray-200">
                            <FileText size={24} className="text-gray-500" />
                        </a>
                        <p className="text-xs text-gray-600">{f.file.original_name}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Acciones:</h3>
          <div className="space-y-3">
              {task.status === 'Tarea Solicitada' && (
                  <button onClick={handleCancelTask} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold">Cancelar tarea</button>
              )}
              {task.status === 'Tarea Aceptada' && (
                  <button onClick={handlePayment} className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold">Pagar Tarea</button>
              )}
              {task.status === 'Tarea Completada' && (
                  <>
                      <button onClick={handleApproveTask} className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold">Aprobar Tarea</button>
                      <button onClick={() => setShowImpugnarModal(true)} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold">Impugnar Tarea</button>
                  </>
              )}
              {task.status === 'Tarea Aprobada' && (
                  <button onClick={() => setShowCalificarModal(true)} className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold">Calificar Asistente</button>
              )}
              <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 text-black rounded-xl font-semibold mt-2">Volver</button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showImpugnarModal && (
          <Modal title="Impugnar Tarea" onClose={() => setShowImpugnarModal(false)}>
              <textarea 
                  value={impugnarMotivo} 
                  onChange={(e) => setImpugnarMotivo(e.target.value)}
                  placeholder="Escribe el motivo de la impugnación..."
                  className="w-full p-2 border rounded min-h-[100px]"
              />
              <button onClick={handleImpugnarTask} className="w-full mt-4 py-2 bg-yellow-500 text-white rounded">Enviar Impugnación</button>
          </Modal>
      )}

      {showCalificarModal && (
          <Modal title="Calificar Asistente" onClose={() => setShowCalificarModal(false)}>
              <div className="flex justify-center my-4">
                  {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                          key={star} 
                          size={32} 
                          className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          onClick={() => setRating(star)}
                      />
                  ))}
              </div>
              <textarea 
                  value={review} 
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Escribe una reseña (opcional)..."
                  className="w-full p-2 border rounded min-h-[100px]"
              />
              <button onClick={handleRateTask} className="w-full mt-4 py-2 bg-purple-500 text-white rounded">Enviar Calificación</button>
          </Modal>
      )}
    </div>
  );
};

export default TaskDetail;