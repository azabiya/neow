// src/pages/Tasks.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Home, FileText, User } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('Pendientes');
  const navigate = useNavigate();

  const mockTasks = [
    { id: 1, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
    { id: 2, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
    { id: 3, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
    { id: 4, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
    { id: 5, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
    { id: 6, title: "Ensayo S2", author: "Ana García", status: "Aprobado", date: "2 Sep." },
  ];

  const handleTaskClick = (taskId: number) => {
    navigate(`/task/${taskId}`);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen font-inter pb-24">
      {/* Header */}
      <header className="bg-white flex items-center justify-between p-4 pt-6">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-4xl font-days font-normal text-[#00B8DB]">NEOW&lt;</h1>
        <div className="w-8" />
      </header>
      
      <main className="p-4">
        {/* Tab Selector */}
        <div className="flex bg-gray-200 rounded-full p-1 mb-6 w-fit mx-auto">
          <button 
            onClick={() => setActiveTab('Pendientes')}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'Pendientes' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
            }`}
          >
            Pendientes (2)
          </button>
          <button 
            onClick={() => setActiveTab('Completadas')}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'Completadas' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
            }`}
          >
            Completadas (3)
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {mockTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => handleTaskClick(task.id)}
              className="bg-white rounded-xl p-4 cursor-pointer shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-black">{task.title}</h4>
                <span className="text-sm text-[#00E5A0] font-semibold">{task.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{task.author}</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{task.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <Home size={24} />
          </button>
          <button className="flex flex-col items-center p-2 text-[#00B8DB]">
            <FileText size={24} />
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <User size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;