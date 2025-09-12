// src/pages/ChangePassword.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PasswordInput = ({ label, id }: { label: string, id: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="password" id={id} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00B8DB]" />
    </div>
);

const ChangePassword = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black pb-24">
            <header className="bg-white flex items-center justify-between p-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-lg">Cambiar Contraseña</h1>
                <div className="w-8" />
            </header>
            <main className="p-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <PasswordInput id="current-password" label="Contraseña actual" />
                    <PasswordInput id="new-password" label="Nueva contraseña" />
                    <PasswordInput id="confirm-password" label="Confirmar nueva contraseña" />
                </div>
                <button className="w-full bg-[#00B8DB] text-white py-4 rounded-full font-semibold mt-8">
                    Guardar Cambios
                </button>
            </main>
        </div>
    );
};

export default ChangePassword;
