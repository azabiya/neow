// src/pages/ProfileDetail.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const SelectInput = ({ label, value }: { label: string, value: string }) => (
    <div className="relative">
        <label className="text-sm text-gray-600">{label}:</label>
        <div className="flex items-center justify-between w-full p-2 border-b border-gray-200">
            <span>{value}</span>
            <ChevronDown size={16} className="text-gray-400" />
        </div>
    </div>
);

const ProfileDetail = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black pb-24">
            <header className="bg-white flex items-center justify-between p-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-lg">Perfil</h1>
                <div className="w-8" />
            </header>

            <main className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-semibold mb-4">Información personal</h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center font-bold text-3xl text-gray-600">A</div>
                        <div className="space-y-2">
                            <button className="bg-[#00B8DB] text-white text-sm px-4 py-2 rounded-lg">Subir Foto</button>
                            <button className="text-sm text-red-500 border border-red-500 px-4 py-2 rounded-lg">Eliminar</button>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm">
                        <p><span className="text-gray-600">Nombre:</span><br /><span className="font-medium">Ana García</span></p>
                        <p><span className="text-gray-600">Email:</span><br /><span className="font-medium">1@1.com</span></p>
                        <p><span className="text-gray-600">Teléfono:</span><br /><span className="font-medium">0959874213</span></p>
                        <div>
                            <span className="text-gray-600">Contraseña:</span><br />
                            <button onClick={() => navigate('/change-password')} className="text-[#00B8DB] font-medium">Cambiar contraseña</button>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-semibold mb-4">Información académica</h2>
                    <div className="space-y-4">
                        <SelectInput label="Universidad" value="Unemi" />
                        <SelectInput label="Carrera" value="Comunicación" />
                        <SelectInput label="Semestre" value="5to Semestre" />
                    </div>
                </div>

                <button className="w-full bg-[#00B8DB] text-white py-4 rounded-full font-semibold mt-4">
                    Guardar Cambios
                </button>
            </main>
        </div>
    );
};

export default ProfileDetail;
