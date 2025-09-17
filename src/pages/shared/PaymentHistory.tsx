// src/pages/shared/PaymentHistory.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ImageViewerModal = ({ imageUrl, onClose }) => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm"
        onClick={onClose}
    >
        <div className="relative p-4">
            <button 
                onClick={onClose} 
                className="absolute -top-4 -right-4 bg-white rounded-full p-1 text-black z-10"
            >
                <X size={24} />
            </button>
            <img 
                src={imageUrl} 
                alt="Comprobante de pago" 
                className="max-w-screen-lg max-h-screen-lg object-contain"
                onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
            />
        </div>
    </div>
);

const PaymentHistory = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('payments')
                .select(`
                    id,
                    amount,
                    status,
                    transfer_date,
                    task:tasks (
                        title
                    ),
                    receipt:files (
                        file_path
                    )
                `)
                .eq('payer_user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching payments:', error);
            } else {
                setPayments(data);
            }
            setLoading(false);
        };

        fetchPayments();
    }, [navigate]);

    const handleViewReceipt = (filePath) => {
        if (!filePath) return;
        const { data: { publicUrl } } = supabase.storage.from('task_files').getPublicUrl(filePath);
        setSelectedImage(publicUrl);
    };
    
    if (loading) {
        return <div className="p-10">Cargando historial de pagos...</div>;
    }

    return (
        <div className="bg-white min-h-screen font-inter text-black p-6 md:p-10">
            {selectedImage && <ImageViewerModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
            <div className="max-w-4xl">
                <header>
                    <h1 className="text-3xl font-semibold text-black mb-8">Pagos</h1>
                </header>

                <main>
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <div key={payment.id} className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center hover:border-cyan-400 transition-colors">
                                <button 
                                    onClick={() => handleViewReceipt(payment.receipt?.file_path)}
                                    className="w-12 h-12 bg-cyan-100 text-[#00B8DB] rounded-full flex items-center justify-center mr-4 flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!payment.receipt}
                                >
                                    <FileText size={24} />
                                </button>
                                <div className="flex-grow">
                                    <p className="font-semibold text-base text-black">{payment.task.title}</p>
                                    <p className="text-sm text-gray-500">{new Date(payment.transfer_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="font-semibold text-base text-black">${payment.amount.toFixed(2)}</p>
                                    <p className={`text-sm font-semibold ${payment.status === 'verified' ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {payment.status === 'verified' ? 'Verificado' : 'Pendiente'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PaymentHistory;