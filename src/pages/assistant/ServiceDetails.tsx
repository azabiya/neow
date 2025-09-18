// src/pages/assistant/ServiceDetails.tsx
import { useState, useEffect } from 'react';
import type { LucideProps } from 'lucide-react';
import { ArrowRight, FileText, BarChart3, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

interface Service {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
  is_enabled: boolean;
}

// Mapeo de nombres de íconos a componentes
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  FileText: FileText,
  BarChart3: BarChart3,
  Repeat: Repeat,
};

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 1. Obtener todos los tipos de tareas disponibles
        const { data: allTaskTypes, error: typesError } = await supabase
          .from('task_types')
          .select('id, name, icon');

        if (typesError) {
          console.error('Error fetching task types:', typesError);
          setLoading(false);
          return;
        }

        // 2. Obtener los servicios que el asistente ya ha habilitado
        const { data: assistantServices, error: assistantServicesError } = await supabase
          .from('assistant_task_types')
          .select('task_type_id, is_enabled')
          .eq('assistant_id', user.id);

        if (assistantServicesError) {
          console.error('Error fetching assistant services:', assistantServicesError);
        }

        // 3. Unir la información
        const enabledServicesMap = new Map(
          assistantServices?.map(s => [s.task_type_id, s.is_enabled])
        );
        
        const mergedServices = allTaskTypes.map(taskType => ({
          ...taskType,
          is_enabled: enabledServicesMap.get(taskType.id) ?? false,
        }));

        setServices(mergedServices);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service-pricing/${serviceId}`);
  };

  if (loading) {
    return <div className="p-10">Cargando servicios...</div>;
  }

  return (
    <div className="bg-white min-h-screen font-inter text-black p-6 md:p-10">
      <div className="max-w-2xl">
        <header>
          <h1 className="text-3xl font-semibold text-black mb-8">Mis Servicios</h1>
        </header>
        
        <main className="space-y-4">
          {services.map((service) => {
             const IconComponent = iconMap[service.icon] || FileText;
             return (
                <button 
                  key={service.id} 
                  onClick={() => handleServiceClick(service.id)}
                  className="w-full p-4 border-2 rounded-2xl flex items-center justify-between text-left transition-colors hover:border-cyan-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                      <IconComponent size={28} />
                    </div>
                    <span className="font-semibold text-lg text-black">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold ${service.is_enabled ? 'text-green-500' : 'text-gray-500'}`}>
                      {service.is_enabled ? 'Ofertado' : 'No ofertado'}
                    </span>
                    <ArrowRight size={20} className="text-gray-400" />
                  </div>
                </button>
             )
          })}
        </main>
      </div>
    </div>
  );
};

export default ServiceDetails;