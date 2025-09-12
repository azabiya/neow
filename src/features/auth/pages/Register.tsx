// src/pages/Register.tsx
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StepInput = ({ id, label, type = 'text', placeholder }: { id: string, label: string, type?: string, placeholder: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-black text-sm font-medium mb-2 text-left" htmlFor={id}>{label}:</label>
      <div className="relative">
        <input 
          id={id} 
          type={isPassword && showPassword ? 'text' : type} 
          placeholder={placeholder} 
          className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8DB]" 
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

const Step1 = () => (
  <div className="w-full flex flex-col gap-4">
    <StepInput id="name" label="Nombre" placeholder="Tus nombres" />
    <StepInput id="email" label="Email" type="email" placeholder="Tu correo electrónico" />
    <StepInput id="password" label="Contraseña" type="password" placeholder="Contraseña" />
    <StepInput id="confirm-password" label="Confirmar contraseña" type="password" placeholder="Contraseña" />
  </div>
);

const Step2 = () => (
  <div className="w-full flex flex-col gap-4 text-left">
    {['Universidad', 'Carrera', 'Semestre'].map((label) => (
      <div key={label}>
        <label className="block text-black text-sm font-medium mb-2">{label}:</label>
        <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00B8DB] appearance-none bg-white bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em'}}>
          <option>Selecciona</option>
        </select>
      </div>
    ))}
  </div>
);

const Step3 = () => (
    <div className="w-full flex flex-col gap-4 text-left">
        <h3 className="font-medium text-black">¿Cómo nos conociste?:</h3>
        <div className="grid grid-cols-2 gap-3">
            <button className="py-3 border border-gray-600 rounded-full text-black">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
            <button className="py-3 border-2 border-[#00B8DB] rounded-full text-[#00B8DB] bg-[#E0F7FF]">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
        </div>
    </div>
);

const Step4 = () => (
    <div className="w-full flex flex-col gap-4 text-left">
        <h3 className="font-medium text-black">¿Para que quieres usar la app?:</h3>
        <div className="grid grid-cols-2 gap-3">
            <button className="py-3 border border-gray-600 rounded-full text-black">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
            <button className="py-3 border-2 border-[#00B8DB] rounded-full text-[#00B8DB] bg-[#E0F7FF]">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Redes sociales</button>
            <button className="py-3 border border-gray-600 rounded-full text-black">Google</button>
        </div>
    </div>
);


const Register = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  const nextStep = () => {
    if (step < totalSteps) {
        setStep(prev => prev + 1);
    } else {
        navigate('/');
    }
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const progress = step > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen p-6 bg-white">
      <header className="flex items-center justify-between">
        <button onClick={prevStep} className={step === 1 ? 'invisible' : ''}>
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-3xl font-bold font-bebas text-[#00B8DB]">NEOW&lt;</h1>
        <div className="w-6" />
      </header>

      <main className="flex-grow flex flex-col items-center mt-8">
        <div className="w-full text-center mb-6">
          <h2 className="text-3xl font-semibold text-black">¡Únete a Neow!</h2>
        </div>

        <div className="w-full mb-6">
            <p className="text-xs text-gray-600 mb-1 text-left">Paso {step} de {totalSteps}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#00B8DB] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full mb-8">
          <button className="w-1/2 py-2 text-center rounded-full text-black font-medium bg-white shadow-sm">Estudiante</button>
          <button className="w-1/2 py-2 text-center rounded-full text-gray-600 font-medium">Asistente</button>
        </div>
        
        <div className="w-full flex-grow">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>
      </main>

      <footer className="w-full mt-auto pt-4 flex gap-4">
        {step > 1 && (
            <button onClick={prevStep} className="w-1/2 py-3 border-2 border-black rounded-lg font-semibold text-black flex items-center justify-center gap-2">
              Atrás <ArrowLeft size={20} />
            </button>
        )}
        <button onClick={nextStep} className={`py-3 bg-[#00B8DB] text-white rounded-lg font-semibold flex items-center justify-center gap-2 ${step === 1 ? 'w-full' : 'w-1/2'}`}>
          {step === totalSteps ? 'Finalizar' : 'Siguiente'}
        </button>
      </footer>
    </div>
  );
};

export default Register;