// src/pages/student/Home.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, BarChart3, Timer } from 'lucide-react';
import { supabase } from '../../supabaseClient';

// Custom debounce function to avoid lodash dependency.
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const Home = () => {
  const navigate = useNavigate();
  const [taskTypes, setTaskTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const debouncedSetSearchTerm = useRef(debounce(setSearchTerm, 500)).current;

  useEffect(() => {
    const fetchTaskTypes = async () => {
      const { data, error } = await supabase
        .from('task_types')
        .select('id, name, icon')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching task types:', error);
      } else {
        setTaskTypes(data);
      }
    };

    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            status,
            assistant:users!tasks_assistant_id_fkey (
              full_name
            )
          `)
          .eq('student_id', user.id)
          .neq('status', 'Tarea Completada'); // Condición actualizada al nuevo valor del enum

        if (error) {
          console.error('Error fetching tasks:', error);
        } else {
          setTasks(data);
        }
      }
    };

    fetchTaskTypes();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      navigate('/create-task', { state: { searchTerm } });
    }
  }, [searchTerm, navigate]);

  const handleTaskTypeClick = (taskTypeId, taskTypeName) => {
    navigate('/create-task', { state: { preselectedTaskType: { id: taskTypeId, name: taskTypeName } } });
  };

  const iconMap = {
    FileText: FileText,
    BarChart3: BarChart3,
    Repeat: Timer,
    Timer: Timer,
  };

  return (
    <div className="bg-white min-h-screen font-inter">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-10 pt-11 pb-6">
        <h1 className="text-[40px] font-normal text-[#00B8DB] font-days md:hidden">NEOW&lt;</h1>
        <div className="hidden md:block flex-1"></div> {/* Spacer for desktop */}
        <Bell className="w-6 h-6 text-gray-400" />
      </header>

      {/* Main Content */}
      <main className="px-6 md:px-10 lg:max-w-4xl mx-auto">
        <h2 className="text-[56px] font-black text-black leading-[1.1] mb-8 font-bebas text-center tracking-normal">
          ENCARGA TAREAS<br />
          100% HUMANAS
        </h2>

        {/* Search Input */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="¿Qué tarea quieres realizar?"
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            className="w-full py-4 px-6 border-2 border-gray-300 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-inter text-base pr-16"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white text-2xl font-bold">→</span>
          </button>
        </div>

        {/* Task Type Icons */}
        <div className="flex justify-center flex-wrap gap-x-4 md:gap-x-8 gap-y-4 mb-8">
          {taskTypes.slice(0, 5).map((task, index) => {
            const IconComponent = iconMap[task.icon] || FileText;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center w-16 cursor-pointer"
                onClick={() => handleTaskTypeClick(task.id, task.name)}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-colors bg-gray-100 border border-gray-200 hover:border-cyan-300`}>
                  <IconComponent className={`w-8 h-8 text-gray-500`} />
                </div>
                <span className={`text-sm font-inter text-gray-500`}>
                  {task.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* En progreso Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">En progreso</h3>
          <div className="space-y-3">
            {tasks.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-black">{item.title}</h4>
                  {/* Se muestra el estado directamente desde la base de datos */}
                  <span className="text-sm text-emerald-500 font-medium">{item.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{item.assistant?.full_name || 'Sin asignar'}</span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Timer className="w-4 h-4 mr-1" />
                    <span>{new Date(item.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;