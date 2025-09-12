// src/pages/Help.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';

const Help = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black pb-24">
            <header className="bg-white flex items-center justify-between p-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-lg">Ayuda</h1>
                <div className="w-8" />
            </header>
            <main className="p-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <h2 className="font-semibold text-lg mb-2">¿Necesitas ayuda?</h2>
                    <p className="text-sm text-gray-600 mb-6">Contacta a nuestro equipo de soporte a través de WhatsApp para obtener ayuda inmediata.</p>
                    <a 
                        href="https://wa.me/1234567890" // Reemplazar con el número de WhatsApp real
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-full font-semibold"
                    >
                        <MessageSquare size={20} />
                        Ir a WhatsApp
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Help;
