import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransferPayment = () => {
    const navigate = useNavigate();

    const SelectInput = ({ label }: { label: string }) => (
        <div className="relative">
            <select className="w-full p-2 border-b border-gray-300 text-gray-500 bg-white appearance-none focus:outline-none">
                <option>{label}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white font-inter text-black p-6 flex flex-col">
            <header className="text-center pt-8 pb-10">
                <h1 className="text-4xl font-normal text-[#00B8DB] font-days">NEOW&lt;</h1>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <div className="w-full bg-white shadow-xl rounded-2xl border border-[#E0DDDD] p-6">
                    <h2 className="text-center text-sm font-semibold mb-2">Pagar mediante transferencia</h2>
                    <p className="text-center text-4xl font-bold mb-8">$3.76</p>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-semibold">Nombres:</label>
                            <input type="text" placeholder="Tus nombres" className="w-full p-2 border-b border-gray-300 focus:outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold">Banco Origen:</label>
                                <SelectInput label="Selecciona" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold">Banco Destino:</label>
                                <SelectInput label="Selecciona" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">Fecha de transferencia:</label>
                             <input type="text" placeholder="dd/mm/aa" className="w-full p-2 border-b border-gray-300 focus:outline-none" />
                        </div>
                        
                        <div>
                            <label className="text-sm font-semibold mb-2 block">Archivos:</label>
                            <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center">
                                <Upload className="text-gray-400 mb-4" size={32}/>
                                <p className="text-gray-400 text-xs">Sube tus archivos aquí.</p>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center text-gray-500 text-xs my-6">Al continuar aceptas nuestros términos y condiciones</p>

                    <button 
                        onClick={() => navigate('/payment-success')}
                        className="w-full bg-[#00B8DB] text-white py-3 rounded-full font-medium"
                    >
                        Confirmar
                    </button>
                </div>
            </main>

            <footer className="text-center text-gray-500 text-sm py-6">
                © 2025 NEOW. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default TransferPayment;
