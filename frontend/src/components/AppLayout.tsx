import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  FlaskConical,
  Users,
  Settings as SettingsIcon,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { cn, initials } from '../lib/utils';
import { useT } from '../i18n/LanguageProvider';
import { useAuth } from '../lib/AuthProvider';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const { user, logout } = useAuth();
  const doctor = {
    name: user ? `Dr. ${user.firstName} ${user.lastName}` : t<string>('common.drDefault'),
    role: user?.specialty ?? t<string>('common.specialtyDefault'),
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/app', label: t<string>('sidebar.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/app/new', label: t<string>('sidebar.newConsultation'), icon: Mic },
    { to: '/app/labs', label: t<string>('sidebar.labAnalysis'), icon: FlaskConical },
    { to: '/app/patients', label: t<string>('sidebar.patients'), icon: Users },
    { to: '/app/settings', label: t<string>('sidebar.settings'), icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-ink-50 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
        <div className="px-5 py-5 border-b border-ink-200/70">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <Logo />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="section-title px-2 pb-2">{t('nav.sidebarWorkspace')}</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <div className="rounded-xl border border-brand-200/70 bg-brand-50 p-3.5">
            <div className="flex items-center gap-2 text-brand-800 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" /> {t('common.hipaaSecure')}
            </div>
            <p className="text-xs text-brand-900/70 mt-1 leading-relaxed">
              {t('nav.sidebarHipaaBody')}
            </p>
          </div>
        </div>

        <div className="border-t border-ink-200/70 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
            {initials(doctor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink-900 truncate">{doctor.name}</div>
            <div className="text-xs text-ink-500 truncate">{doctor.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-ink-400 hover:text-ink-700 p-1.5 rounded-md hover:bg-ink-50"
            title={t<string>('common.signOut') ?? 'Sign out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-ink-200">
          <div className="flex items-center gap-3 px-4 md:px-8 h-16">
            <div className="flex-1 max-w-xl">
              <label className="relative block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="search"
                  placeholder={t<string>('common.search') + '…'}
                  className="input pl-9 bg-ink-50 border-transparent focus:bg-white"
                />
              </label>
            </div>
            <LanguageToggle className="hidden sm:inline-flex" />
            <button
              onClick={() => navigate('/app/new')}
              className="btn-primary hidden sm:inline-flex"
            >
              <Plus className="w-4 h-4" /> {t('common.newConsultation')}
            </button>
            <button className="btn-ghost p-2.5 rounded-full" aria-label={t<string>('common.help')}>
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="btn-ghost p-2.5 rounded-full relative" aria-label={t<string>('common.notifications')}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
            </button>
          </div>
        </header>

        <main key={location.pathname} className="animate-fade-up flex-1 px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
