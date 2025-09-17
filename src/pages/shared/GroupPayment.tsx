// src/pages/shared/GroupPayment.tsx
import { useState, useEffect } from 'react';
import { User, Link as LinkIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const GroupPayment = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!groupId) return;

            // Fetch group and task details
            const { data: groupData, error: groupError } = await supabase
                .from('payment_groups')
                .select(`*, task:tasks(*)`)
                .eq('id', groupId)
                .single();

            if (groupError) {
                console.error("Error fetching group data:", groupError);
                setLoading(false);
                return;
            }
            setTask(groupData.task);

            // Fetch members
            const { data: membersData, error: membersError } = await supabase
                .from('group_members')
                .select('*')
                .eq('group_id', groupId);

            if (membersError) {
                console.error("Error fetching members:", membersError);
            } else {
                setMembers(membersData);
            }
            
            setLoading(false);
        };

        fetchGroupData();
    }, [groupId]);

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

    if (loading) return <div className="p-10">Cargando...</div>

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white font-inter text-black p-6 flex flex-col">
            <header className="text-center pt-8 pb-10">
                <img src="/src/assets/logo.svg" alt="YANA MAKI" className="h-10 mx-auto" />
            </header>

            <main className="flex-grow">
                <h2 className="text-2xl font-semibold text-center mb-8">Pago Grupal</h2>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold">Integrantes</span>
                    <button 
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="flex items-center gap-1.5 bg-yana-yellow text-white text-xs px-3 py-1.5 rounded-md"
                    >
                        Link de pago <LinkIcon size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {members.map((member, index) => (
                        <div key={index} className={`flex items-center p-4 border rounded-2xl`}>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                <User size={20} className="text-gray-500" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium">{member.member_name}</p>
                            </div>
                            {/* NOTE: Payment status per member needs to be implemented */}
                            {getStatusChip('pendiente')}
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <button 
                        onClick={() => navigate(`/payment/transfer/group/${groupId}`)}
                        className="w-full bg-yana-yellow text-white py-4 rounded-full font-medium"
                    >
                        Pagar mi cuota
                    </button>
                </div>
            </main>

            <footer className="text-center text-gray-500 text-sm py-6">
                © 2025 YANA MAKI. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default GroupPayment;