// src/pages/assistant/AssistantHome.tsx
import { useState, useEffect } from 'react';
import { Bell, Star, CheckCircle2, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AssistantHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalTasks: 0,
    totalIncome: 0,
    pendingIncome: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // 1. Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('id, full_name, profile_picture_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          if (profileData?.profile_picture_id) {
            const { data: fileData } = await supabase
              .from('files')
              .select('file_path')
              .eq('id', profileData.profile_picture_id)
              .single();
            if (fileData) {
              const { data: { publicUrl } } = supabase.storage
                .from('task_files')
                .getPublicUrl(fileData.file_path);
              setAvatarUrl(publicUrl);
            }
          }
        }

        // 2. Fetch stats
        const { data: tasksDataForStats, error: statsError } = await supabase
          .from('tasks')
          .select('assistant_price, status')
          .eq('assistant_id', user.id);
        
        if (statsError) {
          console.error('Error fetching stats:', statsError);
        }
        
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('rating')
          .eq('rated_user', user.id);
        
        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
        }
        
        const totalTasks = tasksDataForStats?.length || 0;
        const totalIncome = tasksDataForStats?.reduce((acc, task) => acc + (task.assistant_price || 0), 0) || 0;
        const pendingIncome = tasksDataForStats?.filter(t => 
          t.status !== 'Asistente Remunerado' && t.status !== 'Tarea Cancelada'
        ).reduce((acc, task) => acc + (task.assistant_price || 0), 0) || 0;
        const avgRating = ratingsData && ratingsData.length > 0 
          ? ratingsData.reduce((acc, r) => acc + r.rating, 0) / ratingsData.length 
          : 0;
        
        setStats({ totalTasks, totalIncome, pendingIncome, avgRating });

        // 3. Fetch in-progress tasks
        const { data: inProgressTasks, error: inProgressError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            status,
            due_date,
            assistant_price,
            student_id,
            users!tasks_student_id_fkey (
              full_name
            )
          `)
          .eq('assistant_id', user.id)
          .not('status', 'in', '("Asistente Remunerado","Tarea Calificada","Tarea Cancelada")')
          .order('created_at', { ascending: false });

        if (inProgressError) {
          console.error('Error fetching in-progress tasks:', inProgressError);
          setTasks([]);
        } else {
          if (inProgressTasks && inProgressTasks.length > 0) {
            const tasksWithStudents = await Promise.all(
              inProgressTasks.map(async (task) => {
                if (task.users) return { ...task, student: task.users };
                
                const { data: studentData } = await supabase
                  .from('users')
                  .select('full_name')
                  .eq('id', task.student_id)
                  .single();
                
                return {
                  ...task,
                  student: studentData || { full_name: 'Usuario desconocido' }
                };
              })
            );
            
            setTasks(tasksWithStudents);
          } else {
            setTasks([]);
          }
        }

      } catch (error) {
        console.error('Error general en fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // CORRECCIÓN: Manejador para navegar al perfil correcto según el tamaño de la pantalla
  const handleProfileClick = () => {
    // El punto de quiebre 'md' de Tailwind es 768px
    if (window.innerWidth < 768) {
      navigate('/profile'); // Vista de inicio de perfil para MÓVIL
    } else {
      navigate('/profile-detail'); // Vista de detalle de perfil para DESKTOP
    }
  };
  
  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-inter">
      <header className="flex justify-between items-center px-6 md:px-10 pt-11 pb-6">
        <h1 className="text-[40px] font-normal text-[#00B8DB] font-days md:hidden">NEOW&lt;</h1>
        <div className="hidden md:block flex-1"></div>
        <Bell className="w-6 h-6 text-gray-400" />
      </header>

      <main className="px-6 md:px-10 lg:max-w-4xl mx-auto">
        <h2 className="text-[56px] font-black text-black leading-[1.1] mb-8 font-bebas text-center tracking-normal">
          GANA DINERO<br />
          HACIENDO TAREAS
        </h2>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex justify-around text-center mb-6">
          <div>
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Calif. promedio</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Tareas Totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold">${stats.totalIncome.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Ingresos totales</p>
          </div>
        </div>
      
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#00B8DB] text-white rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer">
            <p className="text-sm">Ingresos pendientes:</p>
            <p className="text-3xl font-bold mt-1">${stats.pendingIncome.toFixed(2)}</p>
          </div>
          <div 
            onClick={handleProfileClick} // CORRECCIÓN: Usar el nuevo manejador
            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-xl text-purple-600 mb-2 overflow-hidden">
              {avatarUrl ? 
                <img src={avatarUrl} alt="Perfil" className="w-full h-full object-cover" /> : 
                profile?.full_name?.charAt(0)
              }
            </div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm">{profile?.full_name}</p>
              <CheckCircle2 size={14} className="text-blue-500 fill-current" />
            </div>
            <button className="text-xs border border-gray-300 rounded-md px-4 py-1 mt-2 hover:bg-gray-50">
              Ver perfil
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-black mb-4">
            En progreso ({tasks.length})
          </h3>
          
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/task/${item.id}`)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-cyan-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-black">{item.title}</h4>
                    <span className="text-sm text-emerald-500 font-medium">{item.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {item.student?.full_name || 'Estudiante no encontrado'}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Timer className="w-4 h-4 mr-1" />
                      <span>
                        {item.due_date 
                          ? new Date(item.due_date).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'short' 
                            })
                          : 'Sin fecha'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No tienes tareas pendientes en este momento.</p>
                <p className="text-sm text-gray-400">Las nuevas tareas aparecerán aquí cuando sean asignadas.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssistantHome;