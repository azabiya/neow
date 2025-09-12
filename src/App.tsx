// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';
import TaskSuccess from './pages/TaskSuccess';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import BottomNavigation from './components/BottomNavigation';
import GroupPayment from './pages/GroupPayment';
import TransferPayment from './pages/TransferPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import ProfileDetail from './pages/ProfileDetail';
import PaymentHistory from './pages/PaymentHistory';
import ChangePassword from './pages/ChangePassword';
import Help from './pages/Help';
import AssistantHome from './pages/AssistantHome'; // Import the new component


// --- LAYOUTS ---

// Layout para las páginas principales que SÍ tienen el menú de navegación inferior
const MainLayout = ({ userRole }: { userRole: string }) => (
  <div className="max-w-md mx-auto min-h-screen font-sans bg-white shadow-lg relative pb-20">
    <Outlet context={{ userRole }} /> {/* Pass the userRole to child routes */}
    <BottomNavigation />
  </div>
);

// Layout para las páginas de flujos (login, registro, checkout) que NO tienen el menú
const FlowLayout = () => (
  <div className="max-w-md mx-auto min-h-screen font-sans bg-white shadow-lg relative">
    <Outlet /> {/* Renderiza la página hija (Login, GroupPayment, etc.) */}
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  // Add a state to manage the user's role.
  // This could be managed via a global state solution like Zustand for a real app.
  const [userRole, setUserRole] = useState<'student' | 'assistant'>('student');

  return (
    <Router>
      <Routes>
        {/* Rutas que usan el layout principal (con navegación) */}
        <Route element={<MainLayout userRole={userRole} />}>
          {/* Conditionally render the Home component based on the user's role */}
          <Route path="/" element={userRole === 'student' ? <Home /> : <AssistantHome />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/:taskId" element={<TaskDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-detail" element={<ProfileDetail />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Rutas que usan el layout de flujo (sin navegación) */}
        <Route element={<FlowLayout />}>
          {/* Modify the Login component to set the user's role on successful login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/task-success" element={<TaskSuccess />} />
          <Route path="/group-payment" element={<GroupPayment />} />
          <Route path="/transfer-payment" element={<TransferPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;