// src/components/BottomNavigation.tsx
import { Home, NotebookText, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNavigation = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-primary' : 'text-black';

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white" style={{borderTop: '1px solid #C5B9B9'}}>
      <nav className="flex justify-around items-center h-20">
        <NavLink to="/inicio" className={getLinkClass}>
          <Home size={32} />
        </NavLink>
        <NavLink to="/tasks" className={getLinkClass}>
          <NotebookText size={32} />
        </NavLink>
        <NavLink to="/profile" className={getLinkClass}>
          <User size={32} />
        </NavLink>
      </nav>
    </div>
  );
};

export default BottomNavigation;
