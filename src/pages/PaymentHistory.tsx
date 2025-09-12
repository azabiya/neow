// src/pages/PaymentHistory.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const PaymentHistory = () => {
    const navigate = useNavigate();
    const payments = Array(7).fill({
        title: 'Ensayo Procesal Penal',
        date: '8 Sep. 9:00 AM',
        amount: '$115.25',
        status: 'Verificado',
    });

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-inter text-black pb-24">
            <header className="bg-white flex items-center justify-between p-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-lg">Pagos</h1>
                <div className="w-8" />
            </header>

            <main className="p-6">
                <h2 className="font-semibold text-lg mb-4">Historial de pagos</h2>
                <div className="space-y-3">
                    {payments.map((payment, index) => (
                        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div className="w-10 h-10 bg-cyan-100 text-[#00B8DB] rounded-lg flex items-center justify-center mr-4">
                                <FileText size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{payment.title}</p>
                                <p className="text-xs text-gray-500">{payment.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">{payment.amount}</p>
                                <p className="text-xs text-green-500">{payment.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PaymentHistory;
