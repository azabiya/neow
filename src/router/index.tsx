// src/router/index.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import StudentHome from '../features/student/pages/StudentHome';
import CreateTask from '../features/student/pages/CreateTask';
import TaskSuccess from '../features/student/pages/TaskSuccess';
import StudentTasks from '../features/student/pages/StudentTasks';
import StudentTaskDetail from '../features/student/pages/StudentTaskDetail';
import GroupPayment from '../features/student/pages/GroupPayment';
import TransferPayment from '../features/student/pages/TransferPayment';
import PaymentSuccess from '../features/student/pages/PaymentSuccess';
import Profile from '../features/common/pages/Profile';
import ProfileDetail from '../features/common/pages/ProfileDetail';
import PaymentHistory from '../features/common/pages/PaymentHistory';
import ChangePassword from '../features/common/pages/ChangePassword';
import Help from '../features/common/pages/Help';
import AssistantHome from '../features/assistant/pages/AssistantHome';
import MainLayout from '../layouts/MainLayout';
import FlowLayout from '../layouts/FlowLayout';

const AppRouter = () => {
  const [userRole, setUserRole] = useState<'student' | 'assistant'>('student');

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout userRole={userRole} />}>
          <Route path="/" element={userRole === 'student' ? <StudentHome /> : <AssistantHome />} />
          <Route path="/tasks" element={<StudentTasks />} />
          <Route path="/task/:taskId" element={<StudentTaskDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-detail" element={<ProfileDetail />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route element={<FlowLayout />}>
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
};

export default AppRouter;
