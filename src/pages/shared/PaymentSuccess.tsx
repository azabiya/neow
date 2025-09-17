import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white p-6 font-inter">
      <header className="text-center pt-8 pb-10">
        <img src="/src/assets/logo.svg" alt="YANA MAKI" className="h-10 mx-auto" />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yana-yellow">
            <Check size={32} className="text-yana-yellow" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-medium text-black mb-3">¡Pago exitoso!</h2>
          <p className="text-gray-600 text-xs mb-8 px-4">
            Tu pago fue recibido con éxito.
            Verificaremos tu transferencia para comenzar tu tarea.
          </p>
          <button
            onClick={() => navigate('/create-task')}
            className="w-full inline-block bg-yana-yellow text-white py-3 px-6 rounded-lg font-normal text-sm"
          >
            Crea una nueva tarea
          </button>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        © 2025 YANA MAKI. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default PaymentSuccess;
