// src/pages/assistant/AssistantTaskDetail.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Upload, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const AssistantTaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [files, setFiles] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState(null); // Estado para controlar qué botón carga
  const fileInputRef = useRef(null);
  const [filesToUpload, setFilesToUpload] = useState([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      setLoading(true);

      // 1. Obtener detalles de la tarea
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          task_type:task_types (name),
          career:careers (name),
          student:users!tasks_student_id_fkey(id, full_name, phone)
        `)
        .eq('id', taskId)
        .single();

      if (taskError) {
        console.error('Error fetching task:', taskError);
        setLoading(false);
        return;
      }
      
      setTask(taskData);
      setStudent(taskData.student);

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
  
    await supabase
        .from('task_status_timeline')
        .update({ is_current: false })
        .eq('task_id', taskId)
        .eq('is_current', true);

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

    const { error: taskUpdateError } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
    if (taskUpdateError) {
      console.error(`Error updating task status to ${newStatus}:`, taskUpdateError);
      return;
    }
  
    setTask(prev => ({ ...prev, status: newStatus }));
    const { data: timelineData } = await supabase.from('task_status_timeline').select('*').eq('task_id', taskId).order('completed_at', { ascending: false });
    setTimeline(timelineData);
  };
  
  const handleFileChange = (event) => {
    if (event.target.files) {
      setFilesToUpload(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
    }
  };
  
  const removeFileToUpload = (index) => {
    setFilesToUpload(filesToUpload.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = async (uploadType) => {
    if (filesToUpload.length === 0) {
      alert("Por favor, selecciona al menos un archivo.");
      return;
    }
    setUploadingType(uploadType); // <-- Indica qué tipo de subida se está realizando
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setUploadingType(null);
        return;
    }
    
    let allUploadsSuccessful = true;
    const newUploadedFiles = [];

    for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('task_files')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: fileData, error: fileInsertError } = await supabase
                .from('files')
                .insert({
                    original_name: file.name,
                    stored_name: fileName,
                    file_path: fileName,
                    file_size: file.size,
                    mime_type: file.type,
                    file_extension: fileExt,
                    uploaded_by: user.id,
                    upload_context: 'task_submission'
                }).select('id').single();
            
            if (fileInsertError) throw fileInsertError;
            
            const { error: linkError } = await supabase.from('task_files').insert({
                task_id: taskId,
                file_id: fileData.id,
                upload_type: uploadType,
            });

            if (linkError) throw linkError;

            newUploadedFiles.push({
                upload_type: uploadType,
                file: {
                    id: fileData.id,
                    original_name: file.name,
                    file_path: fileName
                }
            });

        } catch (error) {
            console.error('File upload failed:', error);
            alert(`Error al procesar el archivo ${file.name}: ${error.message}`);
            allUploadsSuccessful = false;
            break; 
        }
    }
    
    setUploadingType(null); // <-- Resetea el estado de carga

    if (allUploadsSuccessful) {
        setFiles(prev => [...prev, ...newUploadedFiles]);
        setFilesToUpload([]);

        if (uploadType === 'final_submission') {
            await updateTaskStatus('Tarea Completada', 'Entrega final enviada');
        } else {
            await updateTaskStatus('Avance Enviado', 'Avance enviado');
        }
    }
  }

  if (loading) return <div className="p-10">Cargando detalles de la tarea...</div>;
  if (!task) return <div className="p-10">No se encontró la tarea.</div>;
  
  const sentUpdates = files.filter(f => f.upload_type === 'updates');
  const finalSubmissions = files.filter(f => f.upload_type === 'final_submission');

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
              <p className="text-sm font-medium text-black">Por esta tarea recibirás:</p>
              <p className="font-bold text-green-500 text-lg">${task.assistant_price?.toFixed(2)}</p>
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
                  <p className="text-xs text-gray-600 truncate w-16">{f.file.original_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Estudiante:</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl text-gray-600">{student?.full_name?.charAt(0)}</div>
              <div>
                <div className="flex items-center gap-1.5 mb-1"><p className="font-bold text-black">{student?.full_name}</p><CheckCircle2 size={16} className="text-blue-500" /></div>
                <p className="text-sm text-gray-500">Estudiante</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{student?.phone}</p>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Desarrollo de la tarea:</h3>
          <div>
            {timeline.map((step, index) => (
              <div key={step.id} className="flex items-start relative pb-6 last:pb-0">
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
        
        {/* Upload section */}
        {['Tarea Comenzada', 'Avance Enviado'].includes(task.status) && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-black">Subir archivos:</h3>
            <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center">
                <Upload className="text-gray-400 mb-4" size={32}/>
                <p className="text-gray-400 text-xs">Sube tus archivos aquí.</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                <button onClick={() => fileInputRef.current.click()} className="mt-4 bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold">Seleccionar archivos</button>
            </div>
            <div className="mt-4 space-y-2">
                {filesToUpload.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                        <span className="text-sm truncate">{file.name}</span>
                        <button onClick={() => removeFileToUpload(index)}><X size={16} /></button>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* Sent files */}
        {sentUpdates.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-black">Avances enviados:</h3>
                <div className="flex gap-4 flex-wrap">
                    {sentUpdates.map(f => (
                        <div key={f.file.id} className="text-center">
                            <a href={supabase.storage.from('task_files').getPublicUrl(f.file.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 border border-gray-200">
                                <FileText size={24} className="text-gray-500" />
                            </a>
                            <p className="text-xs text-gray-600 truncate w-16">{f.file.original_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {finalSubmissions.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-black">Entrega final:</h3>
                <div className="flex gap-4 flex-wrap">
                    {finalSubmissions.map(f => (
                        <div key={f.file.id} className="text-center">
                            <a href={supabase.storage.from('task_files').getPublicUrl(f.file.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mb-1 border border-gray-200">
                                <FileText size={24} className="text-gray-500" />
                            </a>
                            <p className="text-xs text-gray-600 truncate w-16">{f.file.original_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-black">Acciones:</h3>
          <div className="space-y-3">
              {task.status === 'Tarea Solicitada' && (
                  <div className="flex gap-4">
                      <button onClick={() => updateTaskStatus('Tarea Rechazada', 'Tarea Rechazada por el asistente')} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold">Rechazar tarea</button>
                      <button onClick={() => updateTaskStatus('Tarea Aceptada', 'Tarea Aceptada por el asistente')} className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold">Aceptar tarea</button>
                  </div>
              )}
              {task.status === 'Tarea Pagada' && (
                  <button onClick={() => updateTaskStatus('Tarea Comenzada', 'El asistente ha comenzado la tarea')} className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold">Empezar Tarea</button>
              )}
              {['Tarea Comenzada', 'Avance Enviado'].includes(task.status) && (
                  <div className="flex flex-col md:flex-row gap-4">
                      <button 
                        onClick={() => handleFileUpload('updates')} 
                        className="w-full py-3 bg-gray-600 text-white rounded-xl font-semibold" 
                        disabled={uploadingType !== null || filesToUpload.length === 0}
                      >
                        {uploadingType === 'updates' ? 'Enviando...' : 'Enviar Avance'}
                      </button>
                      <button 
                        onClick={() => handleFileUpload('final_submission')} 
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold" 
                        disabled={uploadingType !== null || filesToUpload.length === 0}
                      >
                        {uploadingType === 'final_submission' ? 'Enviando...' : 'Enviar Entrega Final'}
                      </button>
                  </div>
              )}
              <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 text-black rounded-xl font-semibold mt-2">Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantTaskDetail;