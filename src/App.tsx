// src/App.tsx
import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, NotebookText, User, CreditCard, HelpCircle, LogOut, FilePenLine } from 'lucide-react';
import { supabase } from './supabaseClient';
import logo from './assets/logo.svg';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Landing Pages
import LandingStudent from './pages/landing/LandingStudent';
import LandingAssistant from './pages/landing/LandingAssistant';

// Student Pages
import Home from './pages/student/Home';
import CreateTask from './pages/student/CreateTask';
import TaskDetail from './pages/student/TaskDetail';
import TaskSuccess from './pages/student/TaskSuccess';

// Assistant Pages
import AssistantHome from './pages/assistant/AssistantHome';
import AssistantTaskDetail from './pages/assistant/AssistantTaskDetail';
import ServiceDetails from './pages/assistant/ServiceDetails';
import ServicePricing from './pages/assistant/ServicePricing';

// Shared Pages
import ChangePassword from './pages/shared/ChangePassword';
import GroupPayment from './pages/shared/GroupPayment';
import Help from './pages/shared/Help';
import PaymentHistory from './pages/shared/PaymentHistory';
import PaymentSuccess from './pages/shared/PaymentSuccess';
import Profile from './pages/shared/Profile';
import ProfileDetail from './pages/shared/ProfileDetail';
import Tasks from './pages/shared/Tasks';
import TransferPayment from './pages/shared/TransferPayment';

// Shared Components
import BottomNavigation from './components/shared/BottomNavigation';

// --- SIDEBAR COMPONENT FOR DESKTOP ---
const Sidebar = ({ userRole }: { userRole: string }) => {
    const navigate = useNavigate();

    const studentOptions = [
        { name: 'Inicio', icon: HomeIcon, path: '/inicio' },
        { name: 'Tareas', icon: NotebookText, path: '/tasks' },
        { name: 'Perfil', icon: User, path: '/profile-detail' },
        { name: 'Pagos', icon: CreditCard, path: '/payment-history' },
    ];

    const assistantMainOptions = [
        { name: 'Inicio', icon: HomeIcon, path: '/inicio' },
        { name: 'Tareas', icon: NotebookText, path: '/tasks' },
        { name: 'Perfil', icon: User, path: '/profile-detail' },
        { name: 'Pagos', icon: CreditCard, path: '/payment-history' },
        { name: 'Mis servicios', icon: FilePenLine, path: '/service-details' },
    ];

    const mainOptions = userRole === 'assistant' ? assistantMainOptions : studentOptions;

    const bottomOptions = [
        { name: 'Ayuda', icon: HelpCircle, action: () => navigate('/help') },
        { name: 'Cerrar sesión', icon: LogOut, action: () => navigate('/login'), isRed: true },
    ];

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 p-3 rounded-lg transition-colors text-base font-medium ${
        isActive ? 'text-primary bg-primary-light' : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <div className="h-full flex flex-col p-6 bg-white border-r border-gray-200">
            <div className="mb-10">
                <img src={logo} alt="intiHelp" className="h-10" />
            </div>
            <nav className="flex-1 flex flex-col gap-2">
                {mainOptions.map((option) => (
                    <NavLink key={option.name} to={option.path} className={getLinkClass} end={option.path === '/inicio'}>
                        <option.icon size={24} />
                        <span>{option.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2">
                {bottomOptions.map((option) => (
                    <button
                        key={option.name}
                        onClick={option.action}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors w-full text-left text-base font-medium ${
                            option.isRed
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <option.icon size={24} />
                        <span>{option.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- LAYOUTS ---
const MainLayout = ({ userRole }: { userRole: string }) => (
  <div className="min-h-screen bg-gray-50">
      <div className="flex">
          {/* Sidebar for Desktop */}
          <aside className="hidden md:block w-72 fixed top-0 left-0 h-full z-20">
              <Sidebar userRole={userRole} />
          </aside>

          {/* Content */}
          <main className="flex-1 md:ml-72">
              <div className="font-sans bg-white min-h-screen shadow-lg relative pb-20 md:pb-0">
                  <Outlet context={{ userRole }} />
              </div>
          </main>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden">
          <BottomNavigation />
      </div>
  </div>
);


const FlowLayout = ({ setUserRole }: { setUserRole: Dispatch<SetStateAction<'student' | 'assistant' | null>> }) => (
  <div className="max-w-md mx-auto min-h-screen font-sans bg-white shadow-lg relative md:max-w-full md:shadow-none">
    <Outlet context={{ setUserRole }} />
  </div>
);

// --- APP PRINCIPAL ---
function App() {
  const [userRole, setUserRole] = useState<'student' | 'assistant' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (userData) {
          setUserRole(userData.role);
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
          checkUser();
      } else {
          setUserRole(null);
          navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (loading) {
      return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  return (
      <Routes>
        <Route path="/" element={<LandingStudent />} />
        <Route path="/assistants" element={<LandingAssistant />} />
        
        {userRole && (
        <Route element={<MainLayout userRole={userRole} />}>
          <Route path="/inicio" element={userRole === 'student' ? <Home /> : <AssistantHome />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/:taskId" element={userRole === 'student' ? <TaskDetail /> : <AssistantTaskDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-detail" element={<ProfileDetail />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/help" element={<Help />} />
          <Route path="/service-details" element={<ServiceDetails />} />
          <Route path="/service-pricing/:serviceId" element={<ServicePricing />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/task-success" element={<TaskSuccess />} />
        </Route>
        )}

        <Route element={<FlowLayout setUserRole={setUserRole} />}>
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment/group/:groupId" element={<GroupPayment />} />
          <Route path="/payment/transfer/:paymentType/:id" element={<TransferPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
  );
}

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
)

export default AppWrapper;