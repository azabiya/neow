// src/features/student/pages/StudentTaskDetail.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Star, CheckCircle2 } from 'lucide-react';

const StudentTaskDetail = () => {
  const navigate = useNavigate();

  const timelineSteps = [
    { name: "Tarea solicitada", date: "8 Sep. 9:00 AM", completed: true },
    { name: "Tarea aceptada", date: "8 Sep. 9:00 AM", completed: true },
    { name: "Tarea pagada", date: "8 Sep. 9:00 AM", completed: false },
    { name: "Tarea empezada", date: "8 Sep. 9:00 AM", completed: false },
    { name: "Avance enviado", date: "8 Sep. 9:00 AM", completed: false },
    { name: "Tarea Completada", date: "8 Sep. 9:00 AM", completed: false },
    { name: "Asistente Remunerado", date: "8 Sep. 9:00 AM", completed: false },
    { name: "Tarea calificada", date: "8 Sep. 9:00 AM", completed: false },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 font-inter">
      {/* Header */}
      <header className="bg-white flex items-center justify-between p-4 pt-6">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-4xl font-days font-normal text-[#00B8DB]">NEOW&lt;</h1>
        <div className="w-8" />
      </header>

      <main className="p-4 space-y-6">
        {/* Task Summary Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-black">Ensayo S2</h2>
            <p className="text-sm text-gray-500">Derecho + Ensayo</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-black">Valor:</p>
              <p className="font-bold text-[#00E5A0] text-lg">$14.00</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-black">Fecha máxima de entrega:</p>
              <p className="text-sm text-gray-600">2 Sep. 9:00 AM</p>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-black">Detalles de la tarea:</h3>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-bold text-black">Número de páginas:</p>
              <p className="text-sm text-gray-700">5 páginas</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Formato:</p>
              <p className="text-sm text-gray-700">Apa 7</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Máximo % ia:</p>
              <p className="text-sm text-gray-700">5%</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black">Máximo % plagio:</p>
              <p className="text-sm text-gray-700">2%</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm font-bold text-black mb-2">Descripción:</p>
            <p className="text-sm text-gray-700 mb-2">El principio dispositivo implica que:</p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Son las partes quienes fijan los límites del litigio con sus pretensiones y defensas.</li>
              <li>El juez no puede ir más allá de lo pedido (salvo excepciones en materia constitucional o de interés público).</li>
              <li>La decisión debe basarse únicamente en las pretensiones de las partes y en las pruebas legalmente actuadas.</li>
            </ul>
          </div>

          {/* Attached Documents */}
          <div>
            <p className="text-sm font-bold text-black mb-2">Documentos anexados:</p>
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-12 bg-gray-200 rounded flex items-center justify-center mb-1">
                    <FileText size={20} className="text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-600">file.pdf</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Assistant */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-3 text-black">Asistente seleccionado:</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-gray-600">A</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <p className="font-bold text-black">Ana García</p>
                  <CheckCircle2 size={16} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-500">Estudiante</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <p className="font-bold text-black">4.8</p>
              </div>
              <p className="text-sm text-gray-500">0959871236</p>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-black">Desarrollo de la tarea:</h3>
          <div className="relative">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex items-start mb-4 last:mb-0">
                <div className="flex-shrink-0 mr-3">
                  {step.completed ? (
                    <div className="w-5 h-5 bg-[#00B8DB] rounded-full flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white"></div>
                  )}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className="absolute left-2 mt-5 w-0.5 h-8 bg-gray-200" style={{ top: `${index * 64 + 20}px` }}></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${step.completed ? 'text-[#00B8DB]' : 'text-gray-500'}`}>{step.name}</p>
                  <p className="text-xs text-gray-400">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sent Advances */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-black mb-2">Avances enviados:</p>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-12 bg-gray-200 rounded flex items-center justify-center mb-1 relative">
                  <FileText size={20} className="text-red-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600">file.pdf</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-black">Acciones:</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold text-lg">
              Cancelar tarea
            </button>
            <button className="w-full py-3 bg-white text-[#00B8DB] border-2 border-[#00B8DB] rounded-xl font-semibold text-lg">
              Calificar
            </button>
            <button className="w-full py-3 bg-[#00B8DB] text-white rounded-xl font-semibold text-lg">
              Pagar
            </button>
            <button className="w-full py-3 bg-white text-[#00B8DB] border-2 border-[#00B8DB] rounded-xl font-semibold text-lg">
              Reportar problema
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentTaskDetail;