// src/pages/student/TaskSuccess.tsx
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const TaskSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <CheckCircle2 size={64} className="text-[#00B8DB] mx-auto mb-6" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-black mb-3">¡Tarea solicitada!</h2>
        <p className="text-gray-600 mb-8">
          Te avisaremos cuándo tu asistente acepte tu tarea para que canceles su valor.
        </p>
        <Link
          to="/create-task"
          className="w-full inline-block bg-[#00B8DB] text-white py-3 px-6 rounded-lg font-semibold text-lg"
        >
          Crea una nueva tarea
        </Link>
      </div>
    </div>
  );
};

export default TaskSuccess;