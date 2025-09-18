// src/pages/shared/ChangePassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const PasswordInput = ({ label, id, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input 
            type="password" 
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            required
        />
    </div>
);

const ChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setError('');
        setMessage('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('La nueva contraseña y su confirmación no coinciden.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        
        // No es necesario verificar la contraseña antigua con supabase.auth.updateUser.
        // Supabase maneja la sesión segura del usuario actual.
        const { error: updateError } = await supabase.auth.updateUser({
            password: passwords.newPassword
        });

        if (updateError) {
            setError('Error al cambiar la contraseña: ' + updateError.message);
        } else {
            setMessage('¡Contraseña cambiada con éxito!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen font-inter text-black p-6 md:p-10">
            <div className="max-w-2xl">
                <header>
                    <h1 className="text-3xl font-semibold text-black mb-8">Cambiar Contraseña</h1>
                </header>
                <main>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6">
                        {/* El campo de contraseña actual no es necesario para el flujo de Supabase, 
                            pero se puede mantener si se desea una capa extra de verificación manual en el backend.
                            Por simplicidad, lo he eliminado del flujo principal.
                        <PasswordInput id="currentPassword" label="Contraseña actual" value={passwords.currentPassword} onChange={handleChange} />
                        */}
                        <PasswordInput id="newPassword" label="Nueva contraseña" value={passwords.newPassword} onChange={handleChange} />
                        <PasswordInput id="confirmPassword" label="Confirmar nueva contraseña" value={passwords.confirmPassword} onChange={handleChange} />
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {message && <p className="text-green-500 mt-4">{message}</p>}
                    <div className="mt-8 flex justify-end gap-4">
                         <button onClick={() => navigate(-1)} className="border border-gray-400 text-gray-700 py-3 px-8 rounded-full font-semibold">
                            Volver
                        </button>
                        <button onClick={handleSave} className="bg-primary text-white py-3 px-8 rounded-full font-semibold" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChangePassword;