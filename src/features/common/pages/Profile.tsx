// src/features/common/pages/Profile.tsx
import { useNavigate } from 'react-router-dom';
import { Bell, User, CreditCard, HelpCircle, LogOut, Star, CheckCircle2, Pencil } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  const options = [
    { name: 'Notificaciones', icon: Bell, action: () => {}, toggle: true },
    { name: 'Perfil', icon: User, action: () => navigate('/profile-detail') },
    { name: 'Pagos', icon: CreditCard, action: () => navigate('/payment-history') },
    { name: 'Ayuda', icon: HelpCircle, action: () => navigate('/help') },
    { name: 'Cerrar sesión', icon: LogOut, action: () => navigate('/login'), isRed: true },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black p-6 pb-24">
      <header className="text-center pt-8 pb-10">
        <h1 className="text-4xl font-normal text-[#00B8DB] font-days">NEOW&lt;</h1>
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
                <CheckCircle2 size={16} className="text-blue-500 fill-current" />
              </div>
              <p className="text-sm text-gray-500">Estudiante</p>
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
          <div className="flex items-center gap-1">
            <p className="text-2xl font-semibold">4.8</p>
            <Star size={20} className="text-yellow-400 fill-yellow-400" />
            <p className="text-sm text-gray-500 self-end pb-0.5">Promedio</p>
          </div>
        </div>

        {/* Options Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Opciones:</h3>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div
                key={option.name}
                onClick={option.action}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${option.isRed ? 'text-red-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <option.icon size={20} />
                  <span>{option.name}</span>
                </div>
                {option.toggle ? (
                  <div className="w-12 h-6 bg-gray-800 rounded-full p-1 flex items-center cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                ) : (
                  !option.isRed && <div className="text-gray-400 text-2xl font-thin">→</div>
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
