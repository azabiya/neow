// src/pages/auth/Register.tsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.svg';

// --- Interfaces y Tipos ---
interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    university: string;
    career: string;
    semester: string;
    referralSource: string;
    appUsagePurpose: string;
    assistantTaskTypes: string[];
    assistantKnowledgeAreas: string[];
}

interface DBEntity {
    id: number;
    name: string;
}

// --- Componentes de los Pasos ---
const StepInput = ({ id, label, type = 'text', placeholder, value, onChange }: { id: keyof FormData, label: string, type?: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    return (
        <div>
            <label className="block text-black text-sm font-normal mb-1 text-left" htmlFor={id}>{label}:</label>
            <div className="relative">
                <input id={id} name={id} type={isPassword && showPassword ? 'text' : type} placeholder={placeholder} value={value} onChange={onChange} className="w-full py-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF5A5A]" required />
                {isPassword && (<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>)}
            </div>
        </div>
    );
};

const Step1 = ({ formData, handleChange }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="w-full flex flex-col gap-8">
        <StepInput id="fullName" label="Nombre" placeholder="Tus nombres" value={formData.fullName} onChange={handleChange} />
        <StepInput id="email" label="Email" type="email" placeholder="Tu correo electrónico" value={formData.email} onChange={handleChange} />
        <StepInput id="password" label="Contraseña" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
        <StepInput id="confirmPassword" label="Confirmar contraseña" type="password" placeholder="Contraseña" value={formData.confirmPassword} onChange={handleChange} />
    </div>
);

const Step2 = ({ formData, handleChange, universities, careers }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, universities: DBEntity[], careers: DBEntity[] }) => (
    <div className="w-full flex flex-col gap-8 text-left">
        <div>
            <label className="block text-black text-sm font-normal mb-1">Universidad:</label>
            <div className="relative">
                <select name="university" value={formData.university} onChange={handleChange} className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF5A5A] appearance-none" required>
                    <option value="">Selecciona</option>
                    {universities.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
        <div>
            <label className="block text-black text-sm font-normal mb-1">Carrera:</label>
            <div className="relative">
                <select name="career" value={formData.career} onChange={handleChange} className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF5A5A] appearance-none" required>
                     <option value="">Selecciona</option>
                    {careers.map(car => <option key={car.id} value={car.id}>{car.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
        <div>
            <label className="block text-black text-sm font-normal mb-1">Semestre:</label>
            <div className="relative">
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF5A5A] appearance-none" required>
                    <option value="">Selecciona</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(s => <option key={s} value={s}>{s}º Semestre</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
    </div>
);

const ButtonGrid = ({ title, options, selectedValues, onOptionClick }: { title: string, options: DBEntity[], selectedValues: string[], onOptionClick: (value: string) => void }) => (
    <div className="w-full flex flex-col gap-4 text-left">
        <h3 className="font-medium text-black text-center">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
                <button
                    type="button"
                    key={option.id}
                    onClick={() => onOptionClick(option.name)}
                    className={`py-3 border rounded-full text-sm font-medium transition-colors ${
                        selectedValues.includes(option.name)
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'border-gray-400 text-black hover:bg-gray-100'
                    }`}
                >
                    {option.name}
                </button>
            ))}
        </div>
    </div>
);

const SingleButtonGrid = ({ title, options, selectedValue, onOptionClick }: { title: string, options: string[], selectedValue: string, onOptionClick: (value: string) => void }) => (
    <div className="w-full flex flex-col gap-4 text-left">
        <h3 className="font-medium text-black text-center">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
                <button
                    type="button"
                    key={index}
                    onClick={() => onOptionClick(option)}
                    className={`py-3 border rounded-full text-sm font-medium transition-colors ${
                        selectedValue === option
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'border-gray-400 text-black hover:bg-gray-100'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);

const AssistantStep1 = ({ values, onClick, taskTypes }: { values: string[], onClick: (value: string) => void, taskTypes: DBEntity[] }) => ( <ButtonGrid title="¿Qué tipo de trabajos puedes hacer?" options={taskTypes} selectedValues={values} onOptionClick={onClick} /> );
const AssistantStep2 = ({ values, onClick, careers }: { values: string[], onClick: (value: string) => void, careers: DBEntity[] }) => ( <ButtonGrid title="Tus áreas de conocimiento:" options={careers} selectedValues={values} onOptionClick={onClick} /> );
const Step3 = ({ value, onClick }: { value: string, onClick: (value: string) => void }) => ( <SingleButtonGrid title="¿Cómo nos conociste?:" options={["Redes sociales", "Google", "Publicidad", "Recomendación", "Una promoción", "Otro"]} selectedValue={value} onOptionClick={onClick} /> );
const Step4 = ({ value, onClick }: { value: string, onClick: (value: string) => void }) => ( <SingleButtonGrid title="¿Para qué necesitas usar la app?:" options={["Ahorrar tiempo", "Comodidad", "Mejores notas", "Ayuda específica", "Precios justos", "Otro"]} selectedValue={value} onOptionClick={onClick} /> );

// --- Componente Principal de Registro ---
const Register = () => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<'student' | 'assistant'>('student');
    const [formData, setFormData] = useState<FormData>({ fullName: '', email: '', password: '', confirmPassword: '', university: '', career: '', semester: '', referralSource: '', appUsagePurpose: '', assistantTaskTypes: [], assistantKnowledgeAreas: [] });
    const [universities, setUniversities] = useState<DBEntity[]>([]);
    const [careers, setCareers] = useState<DBEntity[]>([]);
    const [taskTypes, setTaskTypes] = useState<DBEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: universitiesData, error: uniError } = await supabase.from('universities').select('id, name');
            if (uniError) console.error('Error fetching universities:', uniError); else setUniversities(universitiesData || []);
            
            const { data: careersData, error: careerError } = await supabase.from('careers').select('id, name');
            if (careerError) console.error('Error fetching careers:', careerError); else setCareers(careersData || []);

            const { data: taskTypesData, error: taskTypesError } = await supabase.from('task_types').select('id, name');
            if (taskTypesError) console.error('Error fetching task types:', taskTypesError); else setTaskTypes(taskTypesData || []);

            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionClick = (name: keyof FormData, value: string) => {
        setFormData((prev) => {
          const currentValue = prev[name];
          if (Array.isArray(currentValue)) {
            const newValue = currentValue.includes(value)
              ? currentValue.filter((item) => item !== value)
              : [...currentValue, value];
            return { ...prev, [name]: newValue };
          } else {
              return { ...prev, [name]: value };
          }
        });
      };
      
    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    role: selectedRole,
                    university_id: formData.university,
                    career_id: formData.career,
                    semester: formData.semester,
                    referral_source: formData.referralSource,
                    app_usage_purpose: formData.appUsagePurpose,
                    assistant_task_types: formData.assistantTaskTypes.join(','),
                    assistant_knowledge_areas: formData.assistantKnowledgeAreas.join(','),
                }
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }
        
        setLoading(false);
        alert("¡Registro exitoso! Revisa tu correo para verificar tu cuenta.");
        navigate('/login');
    };
    
    const totalSteps = selectedRole === 'student' ? 4 : 6;
    const nextStep = () => { if (step < totalSteps) setStep(s => s + 1); else handleSubmit(); };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    const progress = totalSteps > 1 ? (step / totalSteps) * 100 : 0;

    const renderSteps = () => {
        if (selectedRole === 'student') {
          switch (step) {
            case 1: return <Step1 formData={formData} handleChange={handleChange} />;
            case 2: return <Step2 formData={formData} handleChange={handleChange} universities={universities} careers={careers} />;
            case 3: return <Step3 value={formData.referralSource} onClick={(v) => handleOptionClick('referralSource', v)} />;
            case 4: return <Step4 value={formData.appUsagePurpose} onClick={(v) => handleOptionClick('appUsagePurpose', v)} />;
            default: return null;
          }
        } else {
          switch (step) {
            case 1: return <Step1 formData={formData} handleChange={handleChange} />;
            case 2: return <Step2 formData={formData} handleChange={handleChange} universities={universities} careers={careers} />;
            case 3: return <AssistantStep1 values={formData.assistantTaskTypes} onClick={(v) => handleOptionClick('assistantTaskTypes', v)} taskTypes={taskTypes} />;
            case 4: return <AssistantStep2 values={formData.assistantKnowledgeAreas} onClick={(v) => handleOptionClick('assistantKnowledgeAreas', v)} careers={careers} />;
            case 5: return <Step3 value={formData.referralSource} onClick={(v) => handleOptionClick('referralSource', v)} />;
            case 6: return <Step4 value={formData.appUsagePurpose} onClick={(v) => handleOptionClick('appUsagePurpose', v)} />;
            default: return null;
          }
        }
      };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-white relative md:items-center md:justify-center">
            <div className="w-full md:max-w-md flex flex-col flex-grow md:flex-grow-0">
                <header className="text-center pt-8 md:pt-0 pb-8"> <img src={logo} alt="intiHelp" className="h-12 mx-auto" /> </header>
                <main className="flex-grow flex flex-col items-center w-full">
                    <div className="w-full text-center mb-8"> <h2 className="text-3xl font-normal text-black">¡Únete a intiHelp!</h2> </div>
                    <div className="w-full mb-8">
                        <p className="text-sm text-gray-600 mb-2 text-center">Paso {step} de {totalSteps}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-[#FF5A5A] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-full w-full mb-10">
                        <button onClick={() => {setSelectedRole('student'); setStep(1);}} className={`w-1/2 py-2 text-center rounded-full font-medium transition-colors text-sm ${selectedRole === 'student' ? 'bg-white text-black border border-gray-200' : 'bg-transparent text-gray-600 border border-transparent'}`}>Estudiante</button>
                        <button onClick={() => {setSelectedRole('assistant'); setStep(1);}} className={`w-1/2 py-2 text-center rounded-full font-medium transition-colors text-sm ${selectedRole === 'assistant' ? 'bg-white text-black border border-gray-200' : 'bg-transparent text-gray-600 border border-transparent'}`}>Asistente</button>
                    </div>
                    <div className="w-full flex-grow">{renderSteps()}</div>
                </main>
                {error && <p className="text-red-500 text-center my-4">{error}</p>}
                <footer className="w-full mt-auto pt-10 flex gap-4">
                    {step > 1 && ( <button onClick={prevStep} disabled={loading} className="w-1/2 py-3 border border-black rounded-lg font-semibold text-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"> <ArrowLeft size={20} /> Atrás </button> )}
                    <button onClick={nextStep} disabled={loading} className={`py-3 bg-[#FF5A5A] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#E14C4C] transition-colors ${step === 1 ? 'w-full' : 'w-1/2'}`}>
                        {loading ? 'Registrando...' : (step === totalSteps ? 'Finalizar' : 'Siguiente')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Register;