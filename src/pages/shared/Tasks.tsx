// src/pages/shared/Tasks.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Task {
  id: string;
  title: string;
  due_date: string;
  status: string;
  student: { full_name: string } | null;
  assistant: { full_name: string } | null;
}

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('Pendientes');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const context = useOutletContext<{ userRole: 'student' | 'assistant' }>();
  const userRole = context?.userRole;

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user && userRole) {
        const query = supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            status,
            student:users!tasks_student_id_fkey (
              full_name
            ),
            assistant:users!tasks_assistant_id_fkey (
              full_name
            )
          `);

        if (userRole === 'student') {
          query.eq('student_id', user.id);
        } else {
          query.eq('assistant_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching tasks:', error);
        } else if (data) {
          setTasks(data as unknown as Task[]);
        }
      }
      setLoading(false);
    };

    fetchTasks();
  }, [userRole]);

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const completedTasks = tasks.filter(task => task.status === 'Tarea Completada');
  const pendingTasks = tasks.filter(task => task.status !== 'Tarea Completada');

  const tasksToDisplay = activeTab === 'Pendientes' ? pendingTasks : completedTasks;

  if (loading) {
    return <div className="p-10">Cargando tareas...</div>;
  }

  return (
    <div className="bg-white min-h-screen font-inter p-6 md:p-10">
      <div className="max-w-4xl">
        <header>
          <h1 className="text-3xl font-semibold text-black">Tareas</h1>
        </header>

        <main className="mt-8">
          {/* Tab Selector */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setActiveTab('Pendientes')}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'Pendientes' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
                }`}
              >
                Pendientes ({pendingTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('Completadas')}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'Completadas' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
                }`}
              >
                Completadas ({completedTasks.length})
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasksToDisplay.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className="bg-white rounded-xl p-4 cursor-pointer border border-gray-200 hover:border-primary"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-black">{task.title}</h4>
                  <span className="text-sm text-emerald-500 font-semibold">{task.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {userRole === 'student' ? task.assistant?.full_name : task.student?.full_name}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;