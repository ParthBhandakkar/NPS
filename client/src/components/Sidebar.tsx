import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  ShieldCheck,
  Video,
  UserCircle,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const adminNav: NavItem[] = [
  { to: '/admin',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/upload',  icon: Upload,          label: 'Upload Report' },
  { to: '/admin/reports', icon: FileText,        label: 'Reports' },
  { to: '/admin/patients',icon: Users,           label: 'Patients' },
  { to: '/admin/audit',   icon: ShieldCheck,     label: 'Audit Logs' },
];

const patientNav: NavItem[] = [
  { to: '/patient',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patient/profile', icon: UserCircle,      label: 'My Profile' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = isAdmin ? adminNav : patientNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/10 text-white'
        : 'text-surface-400 hover:text-white hover:bg-white/5'
    }`;

  const nav = (
    <nav className="flex-1 flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-6 mb-2">
        <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-white leading-none">MedExplainer</p>
          <p className="text-[11px] text-surface-400 mt-0.5 tracking-wide">AI Platform</p>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 px-3 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/patient'}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
        {!isAdmin && (
          <NavLink
            to="/patient"
            end={false}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive && window.location.pathname.includes('/videos')
                  ? 'bg-white/10 text-white'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`
            }
            onClick={() => setOpen(false)}
            style={{ display: 'none' }}
          >
            <Video className="w-[18px] h-[18px]" />
            Videos
          </NavLink>
        )}
      </div>

      {/* User + Logout */}
      <div className="px-3 pb-4 mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 font-semibold text-sm">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-rose-400 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-surface-900 text-white flex items-center justify-center shadow-lg"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-surface-900 sidebar-shadow flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
