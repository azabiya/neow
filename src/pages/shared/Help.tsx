// src/pages/shared/Help.tsx
import { MessageSquare } from 'lucide-react';

const Help = () => {
    return (
        <div className="bg-white min-h-full font-inter text-black p-6 md:p-10 flex flex-col">
            <header className="max-w-2xl">
                <h1 className="text-3xl font-semibold text-black mb-8">Ayuda</h1>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md w-full">
                    <h2 className="font-semibold text-xl mb-2">¿Necesitas ayuda?</h2>
                    <p className="text-sm text-gray-600 mb-6 mx-auto">
                        Contacta a nuestro equipo de soporte a través de WhatsApp para obtener ayuda inmediata.
                    </p>
                    <a 
                        href="https://wa.me/1234567890" // Reemplazar con el número de WhatsApp real
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-8 rounded-full font-semibold"
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