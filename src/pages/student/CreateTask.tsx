// src/pages/student/CreateTask.tsx
import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, FileText, BarChart3, Repeat, Upload, X, Star, CheckCircle2, Filter, Paperclip, PlusCircle
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../supabaseClient';

// --- TYPE DEFINITIONS ---
interface TaskType {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
}

interface Career {
  id: string;
  name: string;
}

interface Assistant {
  id: string;
  full_name: string;
  price?: number;
  assistantPrice: number;
  ourFee: number;
  rating: number;
  know_how_areas: string;
}

interface Member {
  name: string;
  isOwner: boolean;
}

interface TaskDetails {
  taskType: TaskType | null;
  career: Career | null;
  title: string;
  pageCount: string;
  format: string;
  description: string;
  maxAiPercentage: string;
  maxPlagiarismPercentage: string;
  dueDate: string;
  files: File[];
  selectedAssistant: Assistant | null;
  couponCode: string;
  discountAmount: number;
  paymentType: 'individual' | 'group';
  members: Member[];
  groupId: string | null;
}

interface CouponStatus {
  success: boolean;
  message: string;
}

const formatOptions = ['Apa 7', 'MLA', 'Chicago', 'Harvard', 'Otro'];

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  FileText,
  BarChart3,
  Repeat,
};

// --- PROPS INTERFACES FOR STEPS ---
interface Step1Props {
  initialSearchTerm: string | undefined;
  onTaskTypeSelect: (taskType: TaskType) => void;
}

interface Step2Props {
  onNext: () => void;
  onCareerSelect: (career: Career) => void;
  selectedCareerId: string | undefined;
}

interface Step3Props {
  onNext: () => void;
  taskDetails: TaskDetails;
  onTaskDetailsChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

interface Step4Props {
  onNext: () => void;
  taskDetails: TaskDetails;
  onAssistantSelect: (assistant: Assistant) => void;
  selectedAssistantId: string | undefined;
}

interface Step5Props {
  onFinalSubmit: () => void;
  taskDetails: TaskDetails;
  onCouponCodeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCouponApply: (discount: number) => void;
  isSubmitting: boolean;
  onPaymentTypeChange: (type: 'individual' | 'group') => void;
  onMembersChange: (members: Member[]) => void;
}


// --- Step 1: Select Task Type ---
const Step1: FC<Step1Props> = ({ initialSearchTerm, onTaskTypeSelect }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      const { data, error } = await supabase
        .from('task_types')
        .select('id, name, icon')
        .eq('is_active', true)
        .ilike('name', `%${debouncedSearchTerm}%`);

      if (error) {
        console.error('Error fetching task types:', error);
      } else if (data) {
        setTaskTypes(data as TaskType[]);
      }
    };
    fetchTaskTypes();
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="¿Qué tarea quieres realizar?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-5 border border-gray-300 rounded-full"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center">
          <ArrowRight size={20} />
        </div>
      </div>
      <div className="space-y-3">
        {taskTypes.map((task) => {
          const IconComponent = iconMap[task.icon] || FileText;
          return (
            <button
              key={task.id}
              onClick={() => onTaskTypeSelect(task)}
              className="w-full p-4 border rounded-xl flex items-center gap-4 text-left transition-all border-gray-300 hover:border-gray-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                <IconComponent size={28} />
              </div>
              <span className="font-semibold text-lg text-black">{task.name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

// --- Step 2: Select Career ---
const Step2: FC<Step2Props> = ({ onNext, onCareerSelect, selectedCareerId }) => {
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    const fetchCareers = async () => {
      const { data, error } = await supabase
        .from('careers')
        .select('id, name')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching careers:', error);
      } else if (data) {
        setCareers(data as Career[]);
      }
    };
    fetchCareers();
  }, []);

  return (
    <>
      <div className="space-y-3">
        {careers.map((career) => (
          <button
            key={career.id}
            onClick={() => onCareerSelect(career)}
            className={`w-full text-center py-3 border rounded-full font-medium transition-colors ${
              selectedCareerId === career.id ? 'bg-[#00B8DB] text-white border-[#00B8DB]' : 'border-gray-300 text-black hover:border-gray-400'
            }`}
          >
            {career.name}
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mt-8 w-full md:w-auto md:self-end py-3 px-8 bg-gray-800 text-white rounded-full font-semibold flex items-center justify-center gap-2">
        Siguiente <ArrowRight size={20} />
      </button>
    </>
  );
};

// --- Step 3: Job Details ---
const Step3: FC<Step3Props> = ({ onNext, taskDetails, onTaskDetailsChange, onFileChange, onFileRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Título:</label>
          <input type="text" name="title" value={taskDetails.title} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Páginas:</label>
            <input type="number" name="pageCount" value={taskDetails.pageCount} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label className="text-sm font-medium">Formato:</label>
            <select name="format" value={taskDetails.format} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg">
                <option value="">Selecciona</option>
                {formatOptions.map((format) => (
                    <option key={format} value={format}>{format}</option>
                ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Descripción:</label>
          <textarea name="description" value={taskDetails.description} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg min-h-[100px]"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Máximo % ia:</label>
            <input type="number" name="maxAiPercentage" value={taskDetails.maxAiPercentage} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label className="text-sm font-medium">Máximo % plagio:</label>
            <input type="number" name="maxPlagiarismPercentage" value={taskDetails.maxPlagiarismPercentage} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"/>
          </div>
        </div>
        <div>
            <label className="text-sm font-medium">Fecha de entrega:</label>
            <input type="datetime-local" name="dueDate" value={taskDetails.dueDate} onChange={onTaskDetailsChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"/>
        </div>
        <div>
            <label className="text-sm font-medium">Archivos:</label>
            <input type="file" ref={fileInputRef} onChange={onFileChange} multiple hidden />
            <button onClick={handleUploadClick} className="w-full mt-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="text-gray-400" size={32}/>
                <p className="text-gray-500 text-sm mt-2">Sube tus archivos aquí.</p>
            </button>
        </div>
        <div>
            <p className="text-sm font-medium">Subidos:</p>
            <div className="flex gap-2 mt-2">
                {taskDetails.files.map((file, i) => (
                    <div key={i} className="relative">
                      <div className="w-16 h-20 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                          <FileText className="text-gray-500" />
                      </div>
                      <button onClick={() => onFileRemove(i)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                          <X size={12} />
                      </button>
                      <p className="text-xs text-center mt-1">{file.name}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <button onClick={onNext} className="mt-8 w-full md:w-auto md:self-end py-3 px-8 bg-gray-800 text-white rounded-full font-semibold flex items-center justify-center gap-2">
        Siguiente <ArrowRight size={20} />
      </button>
    </>
  );
};

// --- Step 4: Select Assistant ---
const Step4: FC<Step4Props> = ({ onNext, taskDetails, onAssistantSelect, selectedAssistantId }) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssistants = async () => {
      if (!taskDetails.taskType?.id) return;
      setLoading(true);

      const { data: assistantTaskTypes, error: taskTypesError } = await supabase
        .from('assistant_task_types')
        .select(`
          assistant_id,
          assistant_pricing (
            criterion_type,
            min_value,
            max_value,
            cost
          )
        `)
        .eq('task_type_id', taskDetails.taskType.id);

      if (taskTypesError) {
        console.error('Error fetching assistant task types:', taskTypesError);
        setLoading(false);
        return;
      }

      const assistantIds = assistantTaskTypes.map(att => att.assistant_id);

      const { data: assistantUsers, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          assistant_profiles (
            know_how_areas
          )
        `)
        .in('id', assistantIds);

      if (usersError) {
        console.error('Error fetching assistant users:', usersError);
        setLoading(false);
        return;
      }

      if (assistantUsers) {
        const calculatedAssistants = assistantUsers.map(user => {
          const assistantPricing = assistantTaskTypes.find(att => att.assistant_id === user.id)?.assistant_pricing || [];
          let assistantPrice = 0;

          const pagesPricing = assistantPricing.find(p => p.criterion_type === 'pages' && parseInt(taskDetails.pageCount) >= p.min_value && parseInt(taskDetails.pageCount) <= p.max_value);
          if (pagesPricing) assistantPrice += pagesPricing.cost;

          const iaPricing = assistantPricing.find(p => p.criterion_type === 'ia' && parseInt(taskDetails.maxAiPercentage) >= p.min_value && parseInt(taskDetails.maxAiPercentage) <= p.max_value);
          if (iaPricing) assistantPrice += iaPricing.cost;

          const plagiarismPricing = assistantPricing.find(p => p.criterion_type === 'plagiarism' && parseInt(taskDetails.maxPlagiarismPercentage) >= p.min_value && parseInt(taskDetails.maxPlagiarismPercentage) <= p.max_value);
          if (plagiarismPricing) assistantPrice += plagiarismPricing.cost;

          const rating = 5;
          const ourFee = assistantPrice * 0.20;
          const totalPrice = assistantPrice + ourFee;

          return {
            ...user,
            price: totalPrice,
            assistantPrice: assistantPrice,
            ourFee: ourFee,
            rating: rating,
            know_how_areas: (user.assistant_profiles as any)?.[0]?.know_how_areas || 'Especialista en varias áreas.'
          };
        }).filter(assistant => assistant.assistantPrice > 0);

        setAssistants(calculatedAssistants as Assistant[]);
      }
      setLoading(false);
    };
    fetchAssistants();
  }, [taskDetails]);

  if (loading) {
    return <p>Cargando asistentes...</p>
  }

  if (assistants.length === 0) {
      return <p>No se encontraron asistentes disponibles para esta tarea. Intente ajustar los detalles.</p>;
  }

  return(
    <>
      <div className="flex justify-end items-center mb-4">
        <button className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-md text-sm">
          Filtrar <Filter size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            onClick={() => onAssistantSelect(assistant)}
            className={`w-full p-4 border-2 rounded-2xl text-left transition-colors ${selectedAssistantId === assistant.id ? 'border-[#00B8DB]' : 'border-gray-200'} shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">
                  {assistant.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-black">{assistant.full_name}</p>
                    <CheckCircle2 size={16} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500">Asistente</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-blue-400" />
                  <p className="font-bold">{assistant.rating}</p>
                </div>
                  <p className="font-bold text-green-500">${(assistant.price || 0).toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{assistant.know_how_areas}</p>
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mt-8 w-full md:w-auto md:self-end py-3 px-8 bg-gray-800 text-white rounded-full font-semibold flex items-center justify-center gap-2">
        Siguiente <ArrowRight size={20} />
      </button>
    </>
  );
};

// --- Step 5: Summary and Payment ---
const Step5: FC<Step5Props> = ({ onFinalSubmit, taskDetails, onCouponCodeChange, onCouponApply, isSubmitting, onPaymentTypeChange, onMembersChange }) => {
  const [isGroupPaymentEnabled, setIsGroupPaymentEnabled] = useState(false);
  const [members, setMembers] = useState<Member[]>([{ name: '', isOwner: true }]);
  const [newMemberName, setNewMemberName] = useState('');
  const [couponStatus, setCouponStatus] = useState<CouponStatus | null>(null);

  const groupPaymentLink = isGroupPaymentEnabled ? `https://neow.app/payment/group/${taskDetails.groupId}` : '';

  useEffect(() => {
    async function fetchUserName() {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            const { data: userData } = await supabase.from('users').select('full_name').eq('id', user.id).single();
            if(userData) {
                const updatedMembers = [...members];
                if (updatedMembers.length > 0) {
                  updatedMembers[0].name = userData.full_name;
                  setMembers(updatedMembers);
                  onMembersChange(updatedMembers);
                }
            }
        }
    }
    fetchUserName();
  },[]);


  const handleAddMember = () => {
    if (newMemberName.trim() !== '') {
      const updatedMembers = [...members, { name: newMemberName.trim(), isOwner: false }];
      setMembers(updatedMembers);
      onMembersChange(updatedMembers);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (indexToRemove: number) => {
    const updatedMembers = members.filter((_, index) => index !== indexToRemove);
    setMembers(updatedMembers);
    onMembersChange(updatedMembers);
  };
  
  const handleToggleGroupPayment = (enabled: boolean) => {
    setIsGroupPaymentEnabled(enabled);
    onPaymentTypeChange(enabled ? 'group' : 'individual');
  }

  const handleApplyCoupon = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('discount_type, discount_value')
      .eq('code', taskDetails.couponCode)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .single();

    if (error || !data) {
      setCouponStatus({ success: false, message: 'Cupón inválido o expirado.' });
      onCouponApply(0);
    } else {
      const totalPrice = taskDetails.selectedAssistant?.price || 0;
      const discount = data.discount_type === 'percentage'
        ? (totalPrice * (data.discount_value / 100))
        : data.discount_value;

      onCouponApply(discount);
      setCouponStatus({ success: true, message: 'Cupón aplicado con éxito.' });
    }
  };

  const assistantPrice = taskDetails.selectedAssistant?.assistantPrice || 0;
  const ourFee = taskDetails.selectedAssistant?.ourFee || 0;
  const totalPrice = taskDetails.selectedAssistant?.price ?? 0;
  const finalTotal = totalPrice - taskDetails.discountAmount;

  return (
    <>
      <div className="space-y-6">
        {/* Task Summary */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Resumen de tu tarea:</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{taskDetails.taskType?.name}</p>
              <p className="text-sm text-gray-500">{taskDetails.career?.name} ° {taskDetails.taskType?.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-500">${(taskDetails.selectedAssistant?.price ?? 0).toFixed(2)}</p>
              <p className="text-sm text-gray-400">{new Date(taskDetails.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
            </div>
          </div>
        </div>
        {/* Selected Assistant */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Asistente seleccionado:</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl">
                {taskDetails.selectedAssistant?.full_name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1"><p className="font-bold">{taskDetails.selectedAssistant?.full_name}</p><CheckCircle2 size={16} className="text-blue-500" /></div>
                <p className="text-sm text-gray-500">Asistente</p>
              </div>
            </div>
            <div className="flex items-center gap-1"><Star size={16} className="text-blue-400" /><p className="font-bold">{taskDetails.selectedAssistant?.rating}</p></div>
          </div>
        </div>
        {/* Payment Method */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-4">Método de pago:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><input type="radio" name="payment" className="form-radio text-[#00B8DB] h-4 w-4" disabled/><FileText size={20} /><p className="text-gray-400">Tarjeta de Crédito / Débito</p></div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex items-center gap-3"><input type="radio" name="payment" defaultChecked className="form-radio text-[#00B8DB] h-4 w-4"/><Repeat size={20} /><p>Transferencia Bancaria</p></div>
          </div>
        </div>
        {/* Group Payment */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Pago grupal:</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isGroupPaymentEnabled} onChange={(e) => handleToggleGroupPayment(e.target.checked)} className="sr-only peer" />
                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B8DB]"></div>
                </label>
            </div>
            {isGroupPaymentEnabled && (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Integrantes:</h3>
                        <button onClick={() => navigator.clipboard.writeText(groupPaymentLink)} className="flex items-center gap-1 text-sm text-[#00B8DB] font-semibold"><Paperclip size={16} /> Copiar link</button>
                    </div>
                    <div className="space-y-2">
                        {members.map((member, index) => (
                          <div key={index} className="relative">
                            <input type="text" value={member.name} readOnly={member.isOwner} className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"/>
                            {!member.isOwner && (
                                <button onClick={() => handleRemoveMember(index)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500">
                                    <X size={16} />
                                </button>
                            )}
                          </div>
                        ))}
                        <div>
                          <input type="text" placeholder="Nombre:" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
                          <button onClick={handleAddMember} className="flex items-center gap-2 text-[#00B8DB] mt-2"><PlusCircle size={20} />Añadir integrante</button>
                        </div>
                    </div>
                </>
            )}
        </div>
        {/* Discount Coupons */}
        <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Cupones de descuento:</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="Ingresa tu código" value={taskDetails.couponCode} onChange={e => onCouponCodeChange(e)} className="flex-grow p-2 border border-gray-300 rounded-md"/>
                <button onClick={handleApplyCoupon} className="bg-black text-white px-4 rounded-md text-sm">Canjear</button>
            </div>
            {couponStatus && (
                <p className={`text-sm mt-2 ${couponStatus.success ? 'text-green-500' : 'text-red-500'}`}>{couponStatus.message}</p>
            )}
        </div>
        {/* Total Summary */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold mb-2 text-base">Resumen del total:</h3>
            <div className="flex justify-between"><p>Tarifa asistente:</p><p className="font-medium">${assistantPrice.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Neow:</p><p className="font-medium">${ourFee.toFixed(2)}</p></div>
            {taskDetails.discountAmount > 0 && (
                <div className="flex justify-between"><p className="text-green-500">Descuento:</p><p className="font-medium text-green-500">-${taskDetails.discountAmount.toFixed(2)}</p></div>
            )}
            <div className="border-t border-gray-200 my-1"></div>
            <div className="flex justify-between font-bold text-base"><p>Total:</p><p>${finalTotal.toFixed(2)}</p></div>
        </div>
      </div>
      <button onClick={onFinalSubmit} className="mt-8 w-full py-4 bg-[#00B8DB] text-white rounded-full font-semibold text-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Solicitando...' : `Solicitar por $${finalTotal.toFixed(2)}`}
      </button>
    </>
  );
};


// --- Main Component ---
const CreateTask: FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>({
    taskType: null,
    career: null,
    title: '',
    pageCount: '',
    format: '',
    description: '',
    maxAiPercentage: '0',
    maxPlagiarismPercentage: '0',
    dueDate: '',
    files: [],
    selectedAssistant: null,
    couponCode: '',
    discountAmount: 0,
    paymentType: 'individual',
    members: [],
    groupId: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.preselectedTaskType) {
      setTaskDetails(prev => ({ ...prev, taskType: location.state.preselectedTaskType as TaskType }));
      setStep(2);
    }
  }, [location.state]);

  const onTaskTypeSelect = (taskType: TaskType) => {
    setTaskDetails(prev => ({ ...prev, taskType }));
    nextStep();
  };

  const onCareerSelect = (career: Career) => {
    setTaskDetails(prev => ({ ...prev, career }));
    nextStep();
  };

  const onAssistantSelect = (assistant: Assistant) => {
    setTaskDetails(prev => ({ ...prev, selectedAssistant: assistant }));
    nextStep();
  };

  const onTaskDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskDetails(prev => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTaskDetails(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files!)] }));
    }
  };

  const onFileRemove = (index: number) => {
    setTaskDetails(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const onCouponCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskDetails(prev => ({ ...prev, couponCode: e.target.value }));
  };

  const onCouponApply = (discount: number) => {
    setTaskDetails(prev => ({ ...prev, discountAmount: discount }));
  };

  const onPaymentTypeChange = (type: 'individual' | 'group') => {
    setTaskDetails(prev => ({ ...prev, paymentType: type }));
  }

  const onMembersChange = (members: Member[]) => {
    setTaskDetails(prev => ({...prev, members}));
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // 1. Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Error: Usuario no autenticado.');
      setIsSubmitting(false);
      return;
    }

    // 2. Subir los archivos a Supabase Storage y obtener sus IDs
    const fileIds = [];
    for (const file of taskDetails.files) {
      const fileExt = file.name.split('.').pop();
      const storedName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${storedName}`;

      const { error: uploadError } = await supabase.storage
        .from('task_files')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error al subir los archivos: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      // Insertar el registro del archivo en la tabla 'files'
      const { data: fileData, error: fileInsertError } = await supabase
        .from('files')
        .insert([
          {
            original_name: file.name,
            stored_name: storedName,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            file_extension: fileExt,
            uploaded_by: user.id,
            upload_context: 'task_requirement'
          }
        ]).select('id');

      if (fileInsertError) {
        alert('Error al registrar el archivo: ' + fileInsertError.message);
        setIsSubmitting(false);
        return;
      }

      fileIds.push(fileData[0].id);
    }

    // 3. Insertar la tarea principal en la DB
    const taskToInsert = {
      student_id: user.id,
      assistant_id: taskDetails.selectedAssistant?.id,
      task_type_id: taskDetails.taskType?.id,
      career_id: taskDetails.career?.id,
      title: taskDetails.title,
      description: taskDetails.description,
      page_count: parseInt(taskDetails.pageCount),
      format: taskDetails.format,
      max_ai_percentage: parseInt(taskDetails.maxAiPercentage),
      max_plagiarism_percentage: parseInt(taskDetails.maxPlagiarismPercentage),
      due_date: taskDetails.dueDate,
      assistant_price: taskDetails.selectedAssistant?.assistantPrice ?? 0,
      our_fee: taskDetails.selectedAssistant?.ourFee ?? 0,
      discount_amount: taskDetails.discountAmount,
      total_price: (taskDetails.selectedAssistant?.price ?? 0) - taskDetails.discountAmount,
      status: 'Tarea Solicitada', // MODIFICADO
      payment_type: taskDetails.paymentType,
    };

    const { data: insertedTask, error: taskError } = await supabase
      .from('tasks')
      .insert([taskToInsert])
      .select('id')
      .single();

    if (taskError) {
      alert('Error al crear la tarea: ' + taskError.message);
      setIsSubmitting(false);
      return;
    }

    const taskId = insertedTask.id;

    // 4. Si es pago grupal, crear grupo y miembros
    if(taskDetails.paymentType === 'group') {
        const { data: groupData, error: groupError } = await supabase.from('payment_groups').insert({
            task_id: taskId,
            name: `Grupo para: ${taskDetails.title}`,
            group_link: `/payment/group/${taskId}`
        }).select('id').single();

        if(groupError) {
            console.error("Error creating payment group", groupError);
        } else {
            const groupId = groupData.id;
            const membersToInsert = taskDetails.members.map(m => ({
                group_id: groupId,
                member_name: m.name
            }));
            await supabase.from('group_members').insert(membersToInsert);
            await supabase.from('tasks').update({ group_id: groupId }).eq('id', taskId);
        }
    }

    // 5. Insertar los registros de archivos en la tabla 'task_files'
    if (fileIds.length > 0) {
      const filesToInsert = fileIds.map(fileId => ({
        task_id: taskId,
        file_id: fileId,
        upload_type: 'requirement' as const,
      }));

      const { error: fileError } = await supabase
        .from('task_files')
        .insert(filesToInsert);

      if (fileError) {
        console.error('Error inserting task files:', fileError);
        // Podrías manejar un rollback aquí si fuera crítico
      }
    }

    // 6. Crear el registro de estado inicial 'Tarea solicitada'
    const timelineToInsert = {
        task_id: taskId,
        status: 'Tarea Solicitada', // MODIFICADO
        title: 'Tarea Solicitada',
        created_by: user.id,
        is_current: true
    };

    const { error: timelineError } = await supabase
        .from('task_status_timeline')
        .insert([timelineToInsert]);

    if (timelineError) {
        console.error('Error al insertar el estado de la tarea:', timelineError);
    }

    // 7. Redirigir al usuario
    setIsSubmitting(false);
    navigate('/task-success');
  };

  const nextStep = () => {
    if (step < 5) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      navigate(-1);
    }
  };

  const titles: { [key: number]: string } = {
    1: "Tipo de tarea:",
    2: "Carrera:",
    3: "Detalles del Trabajo",
    4: "Elige un asistente:",
    5: "Resumen de tarea:"
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 initialSearchTerm={location.state?.searchTerm} onTaskTypeSelect={onTaskTypeSelect} />;
      case 2: return <Step2 onNext={nextStep} onCareerSelect={onCareerSelect} selectedCareerId={taskDetails.career?.id} />;
      case 3: return <Step3 onNext={nextStep} taskDetails={taskDetails} onTaskDetailsChange={onTaskDetailsChange} onFileChange={onFileChange} onFileRemove={onFileRemove} />;
      case 4: return <Step4 onNext={nextStep} taskDetails={taskDetails} onAssistantSelect={onAssistantSelect} selectedAssistantId={taskDetails.selectedAssistant?.id} />;
      case 5: return <Step5 onFinalSubmit={handleFinalSubmit} taskDetails={taskDetails} onCouponCodeChange={onCouponCodeChange} onCouponApply={onCouponApply} isSubmitting={isSubmitting} onPaymentTypeChange={onPaymentTypeChange} onMembersChange={onMembersChange} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-10">
      <div className="max-w-2xl mx-auto flex flex-col">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={prevStep}><ArrowLeft size={24} className="text-black" /></button>
          <h1 className="text-2xl font-semibold text-black">{titles[step]}</h1>
        </header>
        {renderStep()}
      </div>
    </div>
  );
};

export default CreateTask;