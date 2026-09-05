import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  BarChart3, 
  Bell, 
  Settings, 
  FileText, 
  User as UserIcon,
  LogOut,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, role, logout, loginAsDemo } = useAuth();
  const { unreadCount } = useNotifications();

  const adminLinks: NavItem[] = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', to: '/admin/employees', icon: Users },
    { name: 'Attendance', to: '/admin/attendance', icon: Clock },
    { name: 'Leave Approvals', to: '/admin/leave-approvals', icon: CalendarCheck, badge: 'Queue' },
    { name: 'Payroll Mgmt', to: '/admin/payroll', icon: DollarSign },
    { name: 'Reports & Analytics', to: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', to: '/admin/notifications', icon: Bell, badgeCount: unreadCount },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const employeeLinks: NavItem[] = [
    { name: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', to: '/employee/profile', icon: UserIcon },
    { name: 'Attendance', to: '/employee/attendance', icon: Clock },
    { name: 'Leave & Time-Off', to: '/employee/leave', icon: CalendarCheck },
    { name: 'Payroll & Salary', to: '/employee/payroll', icon: DollarSign },
    { name: 'My Documents', to: '/employee/documents', icon: FileText },
    { name: 'Reports', to: '/employee/reports', icon: BarChart3 },
    { name: 'Notifications', to: '/employee/notifications', icon: Bell, badgeCount: unreadCount },
    { name: 'Settings', to: '/employee/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : employeeLinks;

  return (
    <aside className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                DAYFLOW
              </span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 -mt-0.5">
                Every workday, aligned
              </p>
            </div>
          </div>
        </div>

        {/* Role Pill Banner */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-medium text-[11px] uppercase tracking-wider">Role</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            role === 'ADMIN' 
              ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}>
            {role === 'ADMIN' ? 'HR Admin' : 'Employee'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {links.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-600 shadow-indigo-500/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badgeCount && link.badgeCount > 0 ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'
                      }`}>
                        {link.badgeCount}
                      </span>
                    ) : link.badge ? (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {link.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Demo Switcher */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
        {/* Quick Demo Switcher Button */}
        <button
          onClick={() => {
            loginAsDemo(role === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-800/60 transition-colors"
          title="Instantly switch role to test both perspectives"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Switch to {role === 'ADMIN' ? 'Employee (Sarah)' : 'HR Admin (Alex)'}</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Dayflow User'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.employeeId || 'DF-1000'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
