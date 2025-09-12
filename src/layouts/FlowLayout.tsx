// src/layouts/FlowLayout.tsx
import { Outlet } from 'react-router-dom';

const FlowLayout = () => (
  <div className="max-w-md mx-auto min-h-screen font-sans bg-white shadow-lg relative">
    <Outlet />
  </div>
);

export default FlowLayout;
