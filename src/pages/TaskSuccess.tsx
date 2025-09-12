// src/pages/TaskSuccess.tsx
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const TaskSuccess = () => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white p-6">
      <header className="text-center pt-8 pb-10">
        <h1 className="text-3xl font-bold font-bebas text-[#00B8DB]">NEOW&lt;</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-sm text-center">
          <CheckCircle2 size={64} className="text-[#00B8DB] mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-black mb-3">¡Tarea solicitada!</h2>
          <p className="text-gray-600 mb-8">
            Te avisaremos cuándo tu asistente acepte tu tarea para que canceles su valor.
          </p>
          <Link
            to="/create-task" // O puedes dirigirlo a "/"
            className="w-full inline-block bg-[#00B8DB] text-white py-3 px-6 rounded-lg font-semibold text-lg"
          >
            Crea una nueva tarea
          </Link>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm pb-4">
        © 2025 NEOW. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default TaskSuccess;