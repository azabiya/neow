// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/shared/BottomNavigation';

const MainLayout = ({ userRole }: { userRole: string }) => (
  <div className="max-w-md mx-auto min-h-screen font-sans bg-white shadow-lg relative pb-20">
    <Outlet context={{ userRole }} />
    <BottomNavigation />
  </div>
);

export default MainLayout;
