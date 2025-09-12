import { User, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupPayment = () => {
    const navigate = useNavigate();

    const members = [
        { name: 'Ana García', date: '8 Sep. 9:00 AM', status: 'enviado' },
        { name: 'Ana Garcez', date: '8 Sep. 9:00 AM', status: 'pendiente', selected: true },
        { name: 'Ana García', date: '8 Sep. 9:00 AM', status: 'verificado' },
        { name: 'Ana García', date: '8 Sep. 9:00 AM', status: 'invalido' },
        { name: 'Ana García', date: '8 Sep. 9:00 AM', status: 'enviado' },
    ];

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'enviado':
                return <div className="text-center text-xs font-medium text-[#0FC77D] border border-[#2DE89D] rounded-md px-2 py-1">Pago enviado</div>;
            case 'pendiente':
                return <div className="text-center text-xs font-medium text-[#706D6D] border border-[#706D6D] rounded-md px-2 py-1">Pago pend.</div>;
            case 'verificado':
                return <div className="text-center text-xs font-medium text-white bg-[#2DE89D] border border-[#2DE89D] rounded-md px-2 py-1">Pago verif.</div>;
            case 'invalido':
                return <div className="text-center text-xs font-medium text-[#D4183D] border border-[#D4183D] rounded-md px-2 py-1">Pago inválido</div>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white font-inter text-black p-6 flex flex-col">
            <header className="text-center pt-8 pb-10">
                <h1 className="text-4xl font-normal text-[#00B8DB] font-days">NEOW&lt;</h1>
            </header>

            <main className="flex-grow">
                <h2 className="text-2xl font-semibold text-center mb-8">Pago Grupal</h2>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold">Integrantes</span>
                    <button className="flex items-center gap-1.5 bg-[#00B8DB] text-white text-xs px-3 py-1.5 rounded-md">
                        Link de pago <LinkIcon size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {members.map((member, index) => (
                        <div key={index} className={`flex items-center p-4 border rounded-2xl ${member.selected ? 'border-[#00B8DB]' : 'border-[#E0DDDD]'}`}>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                <User size={20} className="text-gray-500" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.date}</p>
                            </div>
                            {getStatusChip(member.status)}
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <button 
                        onClick={() => navigate('/transfer-payment')}
                        className="w-full bg-[#00B8DB] text-white py-4 rounded-full font-medium"
                    >
                        Pagar cuota de Ana Garcez
                    </button>
                </div>
            </main>

            <footer className="text-center text-gray-500 text-sm py-6">
                © 2025 NEOW. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default GroupPayment;
