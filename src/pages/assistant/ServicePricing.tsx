// src/pages/assistant/ServicePricing.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, PlusCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const PriceRangeCard = ({ title, data, criterion, onDataChange, onAdd, onRemove }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-black mb-4">{title}</h3>
        <div className="text-sm text-gray-600 grid grid-cols-10 gap-4 px-2 mb-2">
            <span className="col-span-3">Min:</span>
            <span className="col-span-3">Max:</span>
            <span className="col-span-3">Costo:</span>
        </div>
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={item.id || `new-${index}`} className="grid grid-cols-10 gap-4 items-center text-sm">
                    <input 
                        type="number" 
                        placeholder={criterion === 'pages' ? 'Págs' : '%'}
                        value={item.min_value} 
                        onChange={(e) => onDataChange(criterion, index, 'min_value', e.target.value)}
                        className="col-span-3 text-gray-800 text-center bg-white rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <input 
                        type="number" 
                        placeholder={criterion === 'pages' ? 'Págs' : '%'}
                        value={item.max_value} 
                        onChange={(e) => onDataChange(criterion, index, 'max_value', e.target.value)}
                        className="col-span-3 text-gray-800 text-center bg-white rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <input 
                        type="text" 
                        placeholder="$0.00"
                        value={item.cost} 
                        onChange={(e) => onDataChange(criterion, index, 'cost', e.target.value)}
                        className="col-span-3 font-medium text-gray-900 text-center bg-white rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button onClick={() => onRemove(criterion, index)} className="col-span-1 text-gray-500 hover:text-red-500 flex justify-center">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
        <button onClick={() => onAdd(criterion)} className="flex items-center gap-2 text-[#00B8DB] mt-6 font-medium text-sm">
            <PlusCircle size={20} />
            Añadir nuevo rango de precios
        </button>
    </div>
);

const ServicePricing = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [taskType, setTaskType] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [pricing, setPricing] = useState({ pages: [], ia: [], plagiarism: [] });
    const [assistantTaskTypeId, setAssistantTaskTypeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPricing = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !serviceId) return;

            const { data: taskTypeData } = await supabase.from('task_types').select('name').eq('id', serviceId).single();
            setTaskType(taskTypeData);

            const { data: assistantService } = await supabase
                .from('assistant_task_types')
                .select('id, is_enabled')
                .eq('assistant_id', user.id)
                .eq('task_type_id', serviceId)
                .single();
            
            if (assistantService) {
                setAssistantTaskTypeId(assistantService.id);
                setIsEnabled(assistantService.is_enabled);

                const { data: pricingData } = await supabase
                    .from('assistant_pricing')
                    .select('*')
                    .eq('assistant_task_type_id', assistantService.id);
                
                if (pricingData) {
                    setPricing({
                        pages: pricingData.filter(p => p.criterion_type === 'pages'),
                        ia: pricingData.filter(p => p.criterion_type === 'ia'),
                        plagiarism: pricingData.filter(p => p.criterion_type === 'plagiarism'),
                    });
                }
            } else {
                setIsEnabled(false);
            }
            setLoading(false);
        };
        fetchPricing();
    }, [serviceId]);

    const handlePricingChange = (criterion, index, field, value) => {
        setPricing(prev => ({
            ...prev,
            [criterion]: prev[criterion].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };
    
    const handleAddRow = (criterion) => {
        setPricing(prev => ({
            ...prev,
            [criterion]: [...prev[criterion], { min_value: '', max_value: '', cost: '' }]
        }));
    };

    const handleRemoveRow = (criterion, index) => {
        setPricing(prev => ({
            ...prev,
            [criterion]: prev[criterion].filter((_, i) => i !== index)
        }));
    };
    
    const handleSaveChanges = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
    
        let currentAssistantTaskTypeId = assistantTaskTypeId;
    
        if (!currentAssistantTaskTypeId) {
            const { data, error } = await supabase
                .from('assistant_task_types')
                .insert({ assistant_id: user.id, task_type_id: serviceId, is_enabled: isEnabled })
                .select('id')
                .single();
    
            if (error) {
                console.error('Error creating assistant task type:', error);
                setSaving(false);
                return;
            }
            currentAssistantTaskTypeId = data.id;
            setAssistantTaskTypeId(data.id);
        } else {
            const { error } = await supabase
                .from('assistant_task_types')
                .update({ is_enabled: isEnabled })
                .eq('id', currentAssistantTaskTypeId);
            if (error) console.error('Error updating status:', error);
        }
    
        const { error: deleteError } = await supabase
            .from('assistant_pricing')
            .delete()
            .eq('assistant_task_type_id', currentAssistantTaskTypeId);
    
        if (deleteError) {
            console.error('Error deleting old prices:', deleteError);
            setSaving(false);
            return;
        }
    
        const allNewPrices = [
            ...pricing.pages.map(p => ({ ...p, criterion_type: 'pages' })),
            ...pricing.ia.map(p => ({ ...p, criterion_type: 'ia' })),
            ...pricing.plagiarism.map(p => ({ ...p, criterion_type: 'plagiarism' })),
        ];
    
        const pricesToInsert = allNewPrices
          .filter(p => p.min_value && p.max_value && p.cost) // Solo insertar filas con datos
          .map(({ id, ...rest }) => ({
            ...rest,
            assistant_task_type_id: currentAssistantTaskTypeId,
            cost: parseFloat(String(rest.cost).replace('$', '')) || 0,
            min_value: parseInt(rest.min_value, 10) || 0,
            max_value: parseInt(rest.max_value, 10) || 0,
        }));
    
        if (pricesToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('assistant_pricing')
                .insert(pricesToInsert);
    
            if (insertError) {
                console.error('Error inserting new prices:', insertError);
                alert('Error al guardar los precios: ' + insertError.message);
                setSaving(false);
                return;
            }
        }
    
        setSaving(false);
        alert('Cambios guardados con éxito!');
        navigate('/service-details');
    };

    if (loading) {
        return <div className="p-10">Cargando configuración del servicio...</div>;
    }

  return (
    <div className="bg-white min-h-screen font-inter text-black p-6 md:p-10">
        <div className="max-w-3xl">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-black">{taskType?.name || 'Servicio'}</h1>
                <div className='flex items-center gap-4'>
                    <span className='font-semibold'>{isEnabled ? "Activado" : "Desactivado"}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                    </label>
                </div>
            </header>
            
            <main className="space-y-6">
                <PriceRangeCard title="Extensión (por página):" criterion="pages" data={pricing.pages} onDataChange={handlePricingChange} onAdd={handleAddRow} onRemove={handleRemoveRow} />
                <PriceRangeCard title="Porcentaje de IA (adicional):" criterion="ia" data={pricing.ia} onDataChange={handlePricingChange} onAdd={handleAddRow} onRemove={handleRemoveRow} />
                <PriceRangeCard title="Porcentaje de plagio (adicional):" criterion="plagiarism" data={pricing.plagiarism} onDataChange={handlePricingChange} onAdd={handleAddRow} onRemove={handleRemoveRow} />
            </main>

            <footer className="mt-10 flex justify-end gap-4">
                <button onClick={() => navigate('/service-details')} className="border border-gray-400 text-gray-700 py-3 px-8 rounded-full font-semibold flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Descartar
                </button>
                <button onClick={handleSaveChanges} className="bg-[#00B8DB] text-white py-3 px-8 rounded-full font-semibold" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </footer>
        </div>
    </div>
  );
};

export default ServicePricing;