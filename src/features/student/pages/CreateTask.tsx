// src/pages/CreateTask.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, FileText, BarChart3, Repeat, Upload, X, Star, CheckCircle2, Filter, Paperclip, PlusCircle 
} from 'lucide-react';

// --- Header reutilizable para cada paso ---
const FlowHeader = ({ onBack }: { onBack: () => void }) => (
  <header className="flex items-center justify-between p-4">
    <button onClick={onBack}>
      <ArrowLeft size={24} className="text-black" />
    </button>
    <h1 className="text-3xl font-bold font-bebas text-[#00B8DB]">NEOW&lt;</h1>
    <div className="w-6" />
  </header>
);

// --- Footer reutilizable para cada paso ---
const FlowFooter = ({ onNext }: { onNext: () => void }) => (
  <footer className="w-full p-4 mt-auto">
    <button 
      onClick={onNext}
      className="w-full py-4 bg-gray-800 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2"
    >
      Siguiente <ArrowRight size={20} />
    </button>
  </footer>
);

// --- Step 1: Seleccionar Tipo de Tarea (HOME 2.png) ---
const Step1 = ({ onNext }: { onNext: () => void }) => {
  const taskTypes = [
    { name: 'Ensayo', icon: FileText, selected: true },
    { name: 'Ensayo', icon: BarChart3, selected: false },
    { name: 'Resumen', icon: Repeat, selected: false },
    { name: 'Análisis', icon: BarChart3, selected: false },
  ];
  
  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-grow p-4">
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="¿Qué tarea quieres realizar?"
            className="w-full py-4 pl-5 pr-14 border border-gray-300 rounded-full text-gray-700"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center">
            <ArrowRight size={24} />
          </div>
        </div>
        <div className="space-y-3">
          {taskTypes.map((task, index) => (
            <button key={index} className={`w-full p-4 border rounded-xl flex items-center gap-4 text-left transition-all ${task.selected ? 'border-[#00B8DB] bg-cyan-50' : 'border-gray-300'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${task.selected ? 'bg-[#00B8DB] text-white' : 'bg-gray-100 text-gray-600'}`}>
                <task.icon size={28} />
              </div>
              <span className="font-semibold text-lg text-black">{task.name}</span>
            </button>
          ))}
        </div>
      </main>
      <FlowFooter onNext={onNext} />
    </div>
  );
};

// --- Step 2: Seleccionar Carrera (HOME 3.png) ---
const Step2 = ({ onNext }: { onNext: () => void }) => {
  const careers = ["Derecho", "Arquitectura", "Ing. Civil", "Comunicación", "Letras", "Filosofía", "Ciencias Computacionales"];

  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-grow p-4">
        <h2 className="text-lg font-medium text-black mb-4">¿Cuál es tu carrea?</h2>
        <div className="space-y-3">
          {careers.map((career, index) => (
            <button key={career} className={`w-full text-center py-3 border rounded-full font-medium ${index === 0 ? 'bg-[#00B8DB] text-white border-[#00B8DB]' : 'border-gray-300 text-black'}`}>
              {career}
            </button>
          ))}
        </div>
      </main>
      <FlowFooter onNext={onNext} />
    </div>
  );
};

// --- Step 3: Detalles del Trabajo (HOME 4.png) ---
const Step3 = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-grow p-4 space-y-4">
        <h2 className="text-lg font-medium text-black">Detalles del Trabajo</h2>
        <div>
          <label className="text-sm font-medium">Título:</label>
          <input type="text" defaultValue="Derecho" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Páginas:</label>
            <input type="number" defaultValue="5" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="text-sm font-medium">Formato:</label>
            <input type="text" placeholder="Seleccionar" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>
        </div>
        <div>
            <label className="text-sm font-medium">Descripción:</label>
            <input type="text" defaultValue="Derecho" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Máximo % ia:</label>
            <input type="text" defaultValue="0%" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="text-sm font-medium">Máximo % plagio:</label>
            <input type="text" defaultValue="0%" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
          </div>
        </div>
        <div>
            <label className="text-sm font-medium">Fecha de entrega:</label>
            <input type="text" placeholder="dd/mm/aa" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
        </div>
        <div>
            <label className="text-sm font-medium">Archivos:</label>
            <div className="mt-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                <Upload className="text-gray-400" size={32}/>
                <p className="text-gray-500 text-sm mt-2">Sube tus archivos aquí.</p>
            </div>
        </div>
        <div>
            <p className="text-sm font-medium">Subidos:</p>
            <div className="flex gap-2 mt-2">
                {['file.pdf', 'file.pdf', 'file.pdf'].map((file, i) => (
                    <div key={i} className="relative w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center">
                        <FileText className="text-gray-400" />
                        <button className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </main>
      <FlowFooter onNext={onNext} />
    </div>
  );
};

// --- Step 4: Seleccionar Asistente (HOME 5.png) ---
const Step4 = ({ onNext }: { onNext: () => void }) => {
  const assistants = [1, 2, 3, 4]; // Mock data
  return(
    <div className="flex flex-col h-full bg-white">
      <main className="flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-black">Asistentes disponibles:</h2>
          <button className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-md text-sm">
            Filtrar <Filter size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {assistants.map((_, i) => (
            <div key={i} className={`p-4 border rounded-2xl ${i === 0 ? 'border-[#00B8DB]' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">A</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-black">Ana García</p>
                      <CheckCircle2 size={16} className="text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500">Estudiante</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    <p className="font-bold">4.8</p>
                  </div>
                  <p className="font-bold text-green-500">$14</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Especialista en derecho civil con varios años de izquierdo penal y corrupción.</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="w-full p-4 mt-auto">
        <button onClick={onNext} className="w-full py-4 bg-gray-800 text-white rounded-full font-semibold text-lg">
          Emplear por $112
        </button>
      </footer>
    </div>
  );
};

// --- Step 5: Resumen y Pago (HOME 6.png) ---
const Step5 = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {/* Resumen Tarea */}
        <div>
          <h3 className="font-semibold mb-2">Resumen de tu tarea:</h3>
          <div className="border border-gray-200 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-bold">Ensayo S2</p>
              <p className="text-sm text-gray-500">Derecho ° Ensayo</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-500">$14</p>
              <p className="text-sm text-gray-400">2 Sep.</p>
            </div>
          </div>
        </div>
        {/* Asistente Seleccionado */}
        <div>
          <h3 className="font-semibold mb-2">Asistente seleccionado:</h3>
          <div className="border border-gray-200 rounded-xl p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">A</div>
              <div>
                <div className="flex items-center gap-1"><p className="font-bold">Ana García</p><CheckCircle2 size={16} className="text-blue-500" /></div>
                <p className="text-sm text-gray-500">Estudiante</p>
              </div>
            </div>
            <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /><p className="font-bold">4.8</p></div>
          </div>
        </div>
        {/* Método de pago */}
        <div>
          <h3 className="font-semibold mb-2">Método de pago:</h3>
          <div className="border border-gray-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center gap-3"><input type="radio" name="payment" defaultChecked className="form-radio text-[#00B8DB]"/><FileText size={20} /><p>Tarjeta de Crédito / Débito</p></div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex items-center gap-3"><input type="radio" name="payment" className="form-radio"/><Repeat size={20} /><p>Transferencia Bancaria</p></div>
          </div>
        </div>
        {/* Pago grupal */}
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Pago grupal:</h3>
                <div className="w-12 h-6 bg-cyan-400 rounded-full p-1 flex items-center"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-black">Integrantes:</h3>
                <button className="bg-cyan-100 text-cyan-600 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Paperclip size={12}/> Link de pago
                </button>
            </div>
            <input type="text" placeholder="Nombre:" className="w-full p-2 border border-gray-300 rounded-md"/>
            <input type="text" placeholder="Nombre:" className="w-full p-2 border border-gray-300 rounded-md"/>
            <input type="text" placeholder="Nombre:" className="w-full p-2 border border-gray-300 rounded-md"/>
            <button className="flex items-center gap-2 text-cyan-500"><PlusCircle size={20} />Añadir integrante</button>
        </div>
        {/* Cupones */}
        <div>
            <h3 className="font-semibold mb-2">Cupones de descuento:</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="Ingresa tu código" className="w-full p-2 border border-gray-300 rounded-md"/>
                <button className="bg-black text-white px-4 rounded-md">Canjear</button>
            </div>
        </div>
        {/* Resumen Total */}
        <div className="space-y-1 text-sm">
            <h3 className="font-semibold mb-2 text-base">Resumen del total:</h3>
            <div className="flex justify-between"><p>Tarifa asistente:</p><p className="font-medium">$14</p></div>
            <div className="flex justify-between"><p>Neow:</p><p className="font-medium">$2</p></div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold text-base"><p>Total:</p><p>$16</p></div>
        </div>
      </main>
      <footer className="w-full p-4 mt-auto">
        <button onClick={onNext} className="w-full py-4 bg-[#00B8DB] text-white rounded-full font-semibold text-lg">
          Solicitar por $112
        </button>
      </footer>
    </div>
  );
};


// --- Componente Principal ---
const CreateTask = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => {
    if (step === 5) {
        navigate('/task-success');
    } else {
        setStep(s => s + 1);
    }
  };
  const prevStep = () => {
    if (step === 1) {
        navigate(-1); // Regresar a la página anterior si es el primer paso
    } else {
        setStep(s => s - 1);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 onNext={nextStep} />;
      case 2: return <Step2 onNext={nextStep} />;
      case 3: return <Step3 onNext={nextStep} />;
      case 4: return <Step4 onNext={nextStep} />;
      case 5: return <Step5 onNext={nextStep} />;
      default: return <Step1 onNext={nextStep} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <FlowHeader onBack={prevStep} />
      <div className="flex-grow overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
};

export default CreateTask;