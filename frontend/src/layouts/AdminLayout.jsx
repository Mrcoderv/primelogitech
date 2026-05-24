import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Star,
  Megaphone,
  Mail,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/secret-admin/dashboard' },
  { label: 'Site Content', icon: FileText, path: '/secret-admin/site-content' },
  { label: 'Projects', icon: Briefcase, path: '/secret-admin/projects' },
  { label: 'Team', icon: Users, path: '/secret-admin/team' },
  { label: 'Services', icon: Settings, path: '/secret-admin/services' },
  { label: 'Testimonials', icon: Star, path: '/secret-admin/testimonials' },
  { label: 'Jobs', icon: Megaphone, path: '/secret-admin/jobs' },
  { label: 'Contacts', icon: Mail, path: '/secret-admin/contacts' },
  { label: 'Newsletter', icon: Bell, path: '/secret-admin/newsletter' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/secret-admin');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* ── Mobile overlay ───────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link to="/secret-admin/dashboard" className="text-lg font-bold tracking-tight">
            <span className="text-cyan-400">Prime</span>
            <span className="text-gray-300">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ─────────────────────────────────────────── */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-semibold text-xs">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden sm:inline">{user?.username || 'Admin'}</span>
              <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Page content ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}