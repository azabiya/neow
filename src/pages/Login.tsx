// src/pages/Login.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to home
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white font-inter">
      <header className="text-center pt-8 pb-10">
        <h1 className="text-4xl font-normal font-bebas text-neow-blue">NEOW&lt;</h1>
      </header>

      <main className="w-full flex flex-col gap-8 flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-normal text-neow-dark">¡Bienvenido de vuelta!</h2>
        </div>

        <div className="flex bg-neow-gray p-1 rounded-full w-full">
          <button className="w-1/2 py-2 text-center rounded-full text-neow-dark font-medium bg-white shadow-sm">
            Estudiante
          </button>
          <button className="w-1/2 py-2 text-center rounded-full text-neow-gray-dark font-medium">
            Asistente
          </button>
        </div>

        <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-medium text-neow-dark" htmlFor="email">Correo:</label>
            <input
              id="email"
              type="email"
              placeholder="Correo Electrónico"
              className="mt-2 w-full p-3 border border-neow-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-neow-blue"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-neow-dark" htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="mt-2 w-full p-3 pr-10 border border-neow-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-neow-blue"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-neow-gray-dark">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-neow-blue text-white py-3 rounded-full font-semibold text-lg mt-6">
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-auto">
          <p className="text-neow-dark">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-neow-blue">
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;