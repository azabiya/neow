// src/features/student/pages/StudentTasks.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Home, FileText, User } from 'lucide-react';

const StudentTasks = () => {
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

      {/* Bottom Navigation is now handled by MainLayout */}
    </div>
  );
};

export default StudentTasks;