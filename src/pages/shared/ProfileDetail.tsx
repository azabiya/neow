// src/pages/shared/ProfileDetail.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ProfileDetail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [profileDetails, setProfileDetails] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [careers, setCareers] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Cargar datos del usuario
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (userError) console.error("Error fetching user:", userError);
            else setProfile(userData);

            // Cargar perfil específico (estudiante o asistente)
            const profileTable = userData.role === 'student' ? 'student_profiles' : 'assistant_profiles';
            const { data: profileData, error: profileError } = await supabase
                .from(profileTable)
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (profileError) console.error("Error fetching profile details:", profileError);
            else setProfileDetails(profileData);

            // Cargar foto de perfil si existe
            if (userData.profile_picture_id) {
                const { data: fileData } = await supabase
                    .from('files')
                    .select('file_path')
                    .eq('id', userData.profile_picture_id)
                    .single();
                if (fileData) {
                    const { data: { publicUrl } } = supabase.storage.from('task_files').getPublicUrl(fileData.file_path);
                    setAvatarUrl(publicUrl);
                }
            }

            // Cargar listas de universidades y carreras
            const { data: uniData } = await supabase.from('universities').select('id, name');
            setUniversities(uniData || []);
            const { data: careerData } = await supabase.from('careers').select('id, name');
            setCareers(careerData || []);
            
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const handleInputChange = (e, model) => {
        const { name, value } = e.target;
        if (model === 'profile') {
            setProfile(prev => ({ ...prev, [name]: value }));
        } else {
            setProfileDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Actualizar tabla 'users'
        const { error: userError } = await supabase
            .from('users')
            .update({ full_name: profile.full_name, phone: profile.phone })
            .eq('id', user.id);
        if (userError) {
            alert('Error al actualizar la información personal.');
            return;
        }

        // Actualizar tabla de perfil específico
        const profileTable = profile.role === 'student' ? 'student_profiles' : 'assistant_profiles';
        const { error: profileError } = await supabase
            .from(profileTable)
            .update({
                university_id: profileDetails.university_id,
                career_id: profileDetails.career_id,
                semester: profileDetails.semester
            })
            .eq('user_id', user.id);
        
        if (profileError) {
            alert('Error al actualizar la información académica.');
            return;
        }

        alert('¡Perfil actualizado con éxito!');
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Subir a Storage
        const { error: uploadError } = await supabase.storage
            .from('task_files') // Asumiendo que las fotos de perfil se guardan en el mismo bucket
            .upload(fileName, file);

        if (uploadError) {
            alert('Error al subir la imagen.');
            return;
        }

        // Insertar en tabla 'files'
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
                upload_context: 'profile_picture'
            }).select('id').single();
        
        if (fileInsertError) {
            alert('Error al registrar el archivo.');
            return;
        }

        // Actualizar 'users' con el ID del archivo
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ profile_picture_id: fileData.id })
            .eq('id', user.id);

        if (userUpdateError) {
            alert('Error al actualizar la foto de perfil.');
        } else {
            const { data: { publicUrl } } = supabase.storage.from('task_files').getPublicUrl(fileName);
            setAvatarUrl(publicUrl);
        }
    };
    
    const handleRemovePhoto = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !profile.profile_picture_id) return;

        // Aquí deberías añadir lógica para eliminar el archivo del storage si lo deseas.
        
        const { error } = await supabase
            .from('users')
            .update({ profile_picture_id: null })
            .eq('id', user.id);

        if (error) {
            alert('Error al eliminar la foto.');
        } else {
            setAvatarUrl(null);
            setProfile(prev => ({ ...prev, profile_picture_id: null }));
        }
    };

    if (loading) return <div className="p-10">Cargando perfil...</div>;

    return (
        <div className="font-inter text-black p-6 md:p-10">
            <div className="max-w-2xl">
                <header>
                    <h1 className="text-3xl font-semibold text-black">Perfil</h1>
                </header>

                <main className="mt-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-6">Información personal</h2>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center font-bold text-4xl text-gray-600 flex-shrink-0 overflow-hidden">
                                {avatarUrl ? <img src={avatarUrl} alt="Perfil" className="w-full h-full object-cover" /> : profile?.full_name?.charAt(0)}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
                                <button onClick={handleUploadClick} className="bg-primary text-white text-sm px-5 py-2 rounded-lg font-semibold">Subir Foto</button>
                                <button onClick={handleRemovePhoto} className="text-sm text-red-500 border border-red-500 px-5 py-2 rounded-lg font-semibold">Eliminar</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-6">
                            <div>
                                <label className="text-sm text-gray-600">Nombre:</label>
                                <input type="text" name="full_name" value={profile?.full_name || ''} onChange={(e) => handleInputChange(e, 'profile')} className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-primary" />
                            </div>
                             <div>
                                <label className="text-sm text-gray-600">Email:</label>
                                <p className="font-medium text-black mt-1">{profile?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Teléfono:</label>
                                <input type="text" name="phone" value={profile?.phone || ''} onChange={(e) => handleInputChange(e, 'profile')} className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Contraseña:</label><br />
                                <button onClick={() => navigate('/change-password')} className="text-primary font-semibold mt-1">Cambiar contraseña</button>
                            </div>
                        </div>
                    </section>
                    
                    <section className="mt-12">
                        <h2 className="font-semibold text-xl mb-6">Información académica</h2>
                        <div className="grid grid-cols-1 gap-y-6">
                            <div>
                                <label className="text-sm text-gray-600">Universidad:</label>
                                <select name="university_id" value={profileDetails?.university_id || ''} onChange={(e) => handleInputChange(e, 'profileDetails')} className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white">
                                    <option value="">Selecciona</option>
                                    {universities.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Carrera:</label>
                                 <select name="career_id" value={profileDetails?.career_id || ''} onChange={(e) => handleInputChange(e, 'profileDetails')} className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white">
                                    <option value="">Selecciona</option>
                                    {careers.map(car => <option key={car.id} value={car.id}>{car.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="text-sm text-gray-600">Semestre:</label>
                                <select name="semester" value={profileDetails?.semester || ''} onChange={(e) => handleInputChange(e, 'profileDetails')} className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-white">
                                    <option value="">Selecciona</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(s => <option key={s} value={s}>{s}º Semestre</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="mt-12 flex justify-end">
                        <button onClick={handleSaveChanges} className="bg-primary text-white py-3 px-8 rounded-full font-semibold">
                            Guardar Cambios
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileDetail;