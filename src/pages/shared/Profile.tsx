// src/pages/Profile.tsx
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bell, User, CreditCard, HelpCircle, LogOut, Star, CheckCircle2, Pencil, FilePenLine, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.svg';

const Profile = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{ userRole: 'student' | 'assistant' }>();
  const userRole = context?.userRole || 'student';

  const studentOptions = [
    { name: 'Notificaciones', icon: Bell, action: () => {}, toggle: true },
    { name: 'Perfil', icon: User, action: () => navigate('/profile-detail') },
    { name: 'Pagos', icon: CreditCard, action: () => navigate('/payment-history') },
    { name: 'Ayuda', icon: HelpCircle, action: () => navigate('/help') },
    { name: 'Cerrar sesión', icon: LogOut, action: () => navigate('/login'), isRed: true },
  ];

  const assistantOptions = [
    { name: 'Notificaciones', icon: Bell, action: () => {}, toggle: true },
    { name: 'Perfil', icon: User, action: () => navigate('/profile-detail') },
    { name: 'Mis servicios', icon: FilePenLine, action: () => navigate('/service-details') },
    { name: 'Pagos', icon: CreditCard, action: () => navigate('/payment-history') },
    { name: 'Ayuda', icon: HelpCircle, action: () => navigate('/help') },
    { name: 'Cerrar sesión', icon: LogOut, action: () => navigate('/login'), isRed: true },
  ];

  const options = userRole === 'assistant' ? assistantOptions : studentOptions;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black p-6 pb-24">
      <header className="text-center pt-8 pb-10">
        <img src={logo} alt="IntiHelp" className="h-10 mx-auto" />
      </header>

      <main className="space-y-6">
        {/* User Info Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl text-gray-600">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-lg">Ana García</p>
                <CheckCircle2 size={16} className="text-red-500 fill-current" />
              </div>
              <p className="text-sm text-gray-500 capitalize">
                {userRole === 'student' ? 'Estudiante' : 'Asistente'}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/profile-detail')} className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-lg px-3 py-1.5">
            <Pencil size={14} />
            Editar
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-around text-center">
          <div>
            <p className="text-2xl font-semibold">5</p>
            <p className="text-sm text-gray-500">Tareas Totales</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">2</p>
            <p className="text-sm text-gray-500">Tareas pendientes</p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-1">
                <p className="text-2xl font-semibold">4.8</p>
                <Star size={20} className="text-red-400 fill-red-400" />
            </div>
            <p className="text-sm text-gray-500">Promedio</p>
          </div>
        </div>

        {/* Options Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Opciones:</h3>
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option.name}
                onClick={option.action}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${option.isRed ? 'text-red-500' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <option.icon size={20} className={option.isRed ? 'text-red-500' : 'text-gray-600'} />
                  <span className="font-medium">{option.name}</span>
                </div>
                {option.toggle ? (
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                  </div>
                ) : (
                  !option.isRed && <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
