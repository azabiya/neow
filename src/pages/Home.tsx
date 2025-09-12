// src/pages/Home.tsx
import React from 'react';
import { Bell, FileText, BarChart3, Timer, User, Home as HomeIcon, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const taskItems = [
    {
      id: 1,
      title: "Ensayo S2",
      author: "Ana García",
      status: "Aprobado",
      time: "2 Sep.",
    },
    {
      id: 2,
      title: "Ensayo S2", 
      author: "Ana García",
      status: "Aprobado",
      time: "2 Sep.",
    },
    {
      id: 3,
      title: "Ensayo S2",
      author: "Ana García", 
      status: "Aprobado",
      time: "2 Sep.",
    },
  ];

  const taskTypes = [
    { icon: FileText, label: "Ensayo", active: true },
    { icon: BarChart3, label: "Análisis", active: false },
    { icon: Timer, label: "Resumen", active: false },
    { icon: BarChart3, label: "Análisis", active: false },
    { icon: Timer, label: "Resumen", active: false },
  ];

  return (
    <div className="bg-white min-h-screen font-inter max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-8 pt-11 pb-6">
        <h1 className="text-[40px] font-normal text-[#00B8DB] font-days">NEOW&lt;</h1>
        <Bell className="w-6 h-6 text-gray-400" />
      </div>

      {/* Main Title */}
      <div className="px-6 mb-8">
        <h2 className="text-[56px] font-normal text-black leading-[1.1] mb-8 font-bebas text-center tracking-normal">
          ENCARGA TAREAS<br />
          100% HUMANAS
        </h2>

        {/* Search Input */}
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="¿Qué tarea quieres realizar?"
            className="w-full py-4 px-6 border-2 border-gray-300 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-inter text-base pr-16"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">→</span>
          </div>
        </div>
      </div>

      {/* Task Type Icons */}
      <div className="px-6 mb-8">
        <div className="flex justify-between">
          {taskTypes.map((task, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                task.active ? 'bg-cyan-400' : 'bg-gray-100 border-2 border-gray-200'
              }`}>
                <task.icon className={`w-8 h-8 ${task.active ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-inter ${task.active ? 'text-black font-medium' : 'text-gray-500'}`}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* En progreso Section */}
      <div className="px-6 mb-8">
        <h3 className="text-lg font-semibold text-black mb-4 font-inter">En progreso</h3>
        
        <div className="space-y-3">
          {taskItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-black font-inter">{item.title}</h4>
                <span className="text-sm text-emerald-400 font-medium font-inter">{item.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-inter">{item.author}</span>
                <div className="flex items-center text-gray-400 text-sm font-inter">
                  <Timer className="w-4 h-4 mr-1" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
        <div className="flex justify-around py-4">
          <Link to="/" className="flex flex-col items-center">
            <HomeIcon className="w-6 h-6 text-cyan-400" />
          </Link>
          <Link to="/tasks" className="flex flex-col items-center">
            <ListTodo className="w-6 h-6 text-gray-400" />
          </Link>
          <Link to="/profile" className="flex flex-col items-center">
            <User className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;