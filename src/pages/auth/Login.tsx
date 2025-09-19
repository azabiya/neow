// src/pages/auth/Login.tsx
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/logo.svg';

interface LoginProps {
  setUserRole: Dispatch<SetStateAction<'student' | 'assistant' | null>>;
}

const Login = ({ setUserRole }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      if (user) {
        // Fetch the user's profile to get their role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          throw userError;
        }

        if (userData) {
          setUserRole(userData.role);
          // Redirect to the main dashboard
          navigate('/inicio');
        } else {
            setError("No se pudo encontrar el perfil del usuario.");
        }
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-inter relative">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <header className="text-center pt-12 pb-10">
            <img src={logo} alt="IntiHelp" className="h-12 mx-auto" />
          </header>

          <main className="w-full flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-black">¡Bienvenido de vuelta!</h2>
            </div>
            
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-medium text-black" htmlFor="email">Correo:</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full p-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-[#00B8DB]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black" htmlFor="password">Contraseña:</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full p-2 pr-10 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-[#00B8DB]"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#00B8DB] text-white py-4 rounded-xl font-semibold text-lg mt-8 disabled:bg-gray-400" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/register" className="font-semibold text-[#00B8DB]">
                  Regístrate
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
      
      <footer className="absolute bottom-6 left-6 text-gray-500 text-sm hidden md:block">
        © 2025 IntiHelp. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Login;