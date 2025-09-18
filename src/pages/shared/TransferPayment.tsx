// src/pages/shared/TransferPayment.tsx
import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const TransferPayment = () => {
    const navigate = useNavigate();
    const { paymentType, id } = useParams(); // id can be taskId or groupId
    const [task, setTask] = useState(null);
    const [amount, setAmount] = useState(0);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [senderName, setSenderName] = useState('');
    const [originBank, setOriginBank] = useState('');
    const [destinationBank, setDestinationBank] = useState('');
    const [transferDate, setTransferDate] = useState('');

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            setLoading(true);
            let taskData;
            let finalAmount = 0;

            try {
                if (paymentType === 'individual') {
                    const { data, error } = await supabase.from('tasks').select('id, total_price').eq('id', id).single();
                    if (error) throw error;
                    taskData = data;
                    finalAmount = data.total_price;
                } else if (paymentType === 'group') {
                    const { data: groupData, error: groupError } = await supabase.from('payment_groups').select('*, task:tasks(id, total_price)').eq('id', id).single();
                    if (groupError) throw groupError;
                    
                    taskData = groupData.task;
                    const { count, error: countError } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', id);
                    if(countError) throw countError;

                    finalAmount = groupData.task.total_price / (count || 1);
                }
                
                setTask(taskData);
                setAmount(finalAmount);

            } catch (error) {
                console.error("Error fetching payment details:", error);
                alert("No se pudieron cargar los detalles del pago.");
            } finally {
                setLoading(false);
            }
        };

        if (id && paymentType) {
            fetchPaymentDetails();
        } else {
            setLoading(false);
            alert("Información de pago inválida.");
            navigate('/');
        }
    }, [paymentType, id, navigate]);
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        if(!file) {
            alert("Por favor, sube un comprobante de pago.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;
        
        setIsSubmitting(true);

        // 1. Upload receipt
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('payment_receipts')
            .upload(fileName, file);

        if (uploadError) {
            alert(`Error al subir el comprobante: ${uploadError.message}`);
            console.error(uploadError);
            setIsSubmitting(false);
            return;
        }

        // 2. Insert file record
        const { data: fileData, error: fileInsertError } = await supabase
            .from('files')
            .insert({
                original_name: file.name,
                stored_name: fileName,
                file_path: fileName,
                file_size: file.size,
                mime_type: file.type,
                file_extension: fileExt,
                uploaded_by: user.id,
                upload_context: 'payment_receipt'
            }).select('id').single();

        if (fileInsertError) {
            alert(`Error al registrar el archivo en la base de datos: ${fileInsertError.message}`);
            setIsSubmitting(false);
            return;
        }
        
        // 3. Create payment record
        const paymentData = {
            task_id: task.id,
            payer_user_id: user.id,
            amount: amount,
            payment_method: 'bank_transfer', // <-- CORRECCIÓN FINAL AQUÍ
            sender_name: senderName,
            sender_bank: originBank,
            recipient_bank: destinationBank,
            transfer_date: transferDate,
            transfer_receipt_file_id: fileData.id,
            status: 'pending'
        };

        const { error: paymentInsertError } = await supabase.from('payments').insert(paymentData);

        if (paymentInsertError) {
            alert(`Error al registrar el pago: ${paymentInsertError.message}`);
            console.error("Detailed payment insert error:", paymentInsertError);
            setIsSubmitting(false);
            return;
        }

        // 4. Update task status
        await supabase.from('tasks').update({ status: 'Tarea Pagada' }).eq('id', task.id);
        
        setIsSubmitting(false);
        navigate('/payment-success');
    }

    if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

    const SelectInput = ({ label, value, onChange, name, required = false }) => (
        <div className="relative">
            <select name={name} value={value} onChange={onChange} required={required} className="w-full p-2 border-b border-gray-300 text-gray-700 bg-white appearance-none focus:outline-none focus:border-[#00B8DB]">
                <option value="">{label}</option>
                <option value="Banco Pichincha">Banco Pichincha</option>
                <option value="Banco Guayaquil">Banco Guayaquil</option>
                <option value="Produbanco">Produbanco</option>
                <option value="Banco del Pacífico">Banco del Pacífico</option>
                <option value="Otro">Otro</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white font-inter text-black p-6 flex flex-col">
            <header className="text-center pt-8 pb-10">
                <img src="/src/assets/logo.svg" alt="IntiHelp" className="h-10 mx-auto" />
            </header>

            <main className="flex-grow flex items-center justify-center">
                <form onSubmit={handleConfirmPayment} className="w-full bg-white shadow-xl rounded-2xl border border-[#E0DDDD] p-6">
                    <h2 className="text-center text-sm font-semibold mb-2">Pagar mediante transferencia</h2>
                    <p className="text-center text-4xl font-bold mb-8">${amount.toFixed(2)}</p>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-semibold">Nombres del transferente:</label>
                            <input type="text" placeholder="Tus nombres" value={senderName} onChange={(e) => setSenderName(e.target.value)} required className="w-full p-2 border-b border-gray-300 focus:outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold">Banco Origen:</label>
                                <SelectInput label="Selecciona" value={originBank} onChange={(e) => setOriginBank(e.target.value)} name="originBank" required />
                            </div>
                            <div>
                                <label className="text-xs font-semibold">Banco Destino:</label>
                                <SelectInput label="Selecciona" value={destinationBank} onChange={(e) => setDestinationBank(e.target.value)} name="destinationBank" required />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">Fecha de transferencia:</label>
                             <input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} required className="w-full p-2 border-b border-gray-300 focus:outline-none" />
                        </div>
                        
                        <div>
                            <label className="text-sm font-semibold mb-2 block">Comprobante:</label>
                            <div className="w-full relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center">
                                <input type="file" onChange={handleFileChange} required className="absolute w-full h-full opacity-0 cursor-pointer" />
                                <Upload className="text-gray-400 mb-4" size={32}/>
                                <p className="text-gray-400 text-xs">{file ? file.name : "Sube tu comprobante aquí."}</p>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center text-gray-500 text-xs my-6">Al continuar aceptas nuestros términos y condiciones</p>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#00B8DB] text-white py-3 rounded-full font-medium disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Confirmando...' : 'Confirmar'}
                    </button>
                </form>
            </main>

            <footer className="text-center text-gray-500 text-sm py-6">
                © 2025 IntiHelp. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default TransferPayment;