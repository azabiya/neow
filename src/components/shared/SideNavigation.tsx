// src/components/shared/SideNavigation.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, NotebookText, User, CreditCard, FilePenLine, HelpCircle, LogOut } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-yana-yellow text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
        }
    >
        <Icon size={22} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

export const SideNavigation = ({ userRole }: { userRole: 'student' | 'assistant' }) => {
    const navigate = useNavigate();

    const commonLinks = [
        { to: '/', icon: Home, label: 'Inicio' },
        { to: '/tasks', icon: NotebookText, label: 'Tareas' },
        { to: '/profile-detail', icon: User, label: 'Perfil' },
        { to: '/payment-history', icon: CreditCard, label: 'Pagos' },
    ];

    const assistantLink = { to: '/service-details', icon: FilePenLine, label: 'Mis servicios' };

    const navLinks = userRole === 'assistant' ? [...commonLinks, assistantLink] : commonLinks;

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
            <div className="mb-10 px-2">
                <img src="/src/assets/logo.svg" alt="YANA MAKI" className="h-10" />
            </div>

            <nav className="flex flex-col gap-2">
                {navLinks.map(link => (
                    <NavItem key={link.to} to={link.to} icon={link.icon} label={link.label} />
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2">
                 <NavItem to="/help" icon={HelpCircle} label="Ayuda" />
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50"
                >
                    <LogOut size={22} />
                    <span className="font-medium">Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
};