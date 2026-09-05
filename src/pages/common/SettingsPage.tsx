import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  User, 
  Lock, 
  Bell, 
  Sun, 
  Moon, 
  Monitor, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role, updateCurrentUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [address, setAddress] = useState('742 Evergreen Terrace, Suite 400, San Francisco, CA');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySaved, setSecuritySaved] = useState(false);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [leaveAlerts, setLeaveAlerts] = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ name, phone, address });
    showToast('Settings Updated', 'Profile preferences have been persisted.', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Validation Error', 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Validation Error', 'New passwords do not match.', 'error');
      return;
    }
    setSecuritySaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Security Updated', 'Your credentials have been securely updated.', 'success');
    setTimeout(() => setSecuritySaved(false), 4000);
  };

  const handleNotificationSave = () => {
    showToast('Preferences Saved', 'Notification dispatch preferences saved.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
          System & Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal identity, security credentials, notification channels, and display theme.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { id: 'profile', label: 'Profile Settings', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance', icon: Sun },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="max-w-3xl">
          <CardHeader
            title="Personal Identification"
            subtitle="Editable contact details. Organization details are managed by HR administrator."
          />
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h4>
                  <p className="text-xs text-slate-400">{user?.designation} • {user?.department}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    Role: {role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  label="Work Email (Read Only)"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Employee ID (System Assigned)"
                  value={user?.employeeId || ''}
                  disabled
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <Input
                label="Mailing Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="max-w-2xl">
          <CardHeader
            title="Authentication & Password"
            subtitle="Keep your enterprise workstation secure by rotating passwords regularly."
          />
          <CardContent>
            {securitySaved && (
              <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Password changed successfully. New session credentials are in effect.</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <KeyRound className="w-4 h-4 text-indigo-500" />
                  <span>Password Security Requirements</span>
                </div>
                <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Minimum 6 characters (8+ recommended)</li>
                  <li>At least one capital letter & one numerical digit</li>
                  <li>Cannot be identical to current employee email</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="max-w-2xl">
          <CardHeader
            title="Notification Routing"
            subtitle="Choose which workplace updates trigger in-app and dispatch alerts."
          />
          <CardContent className="space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  id: 'email',
                  title: 'Email Summary Alerts',
                  desc: 'Receive digest emails for major status changes and leave approvals',
                  checked: emailAlerts,
                  toggle: () => setEmailAlerts(!emailAlerts),
                },
                {
                  id: 'leave',
                  title: 'Leave & Time-Off Approvals',
                  desc: 'Instant alert when a requested leave is approved or reviewed',
                  checked: leaveAlerts,
                  toggle: () => setLeaveAlerts(!leaveAlerts),
                },
                {
                  id: 'payroll',
                  title: 'Payroll & Salary Dispatches',
                  desc: 'Notification when monthly salary payslips are generated',
                  checked: payrollAlerts,
                  toggle: () => setPayrollAlerts(!payrollAlerts),
                },
                {
                  id: 'attendance',
                  title: 'Daily Attendance Reminders',
                  desc: 'Prompt notification if morning check-in is not logged by 10:00 AM',
                  checked: attendanceAlerts,
                  toggle: () => setAttendanceAlerts(!attendanceAlerts),
                },
              ].map(item => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={item.toggle}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                      item.checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        item.checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="primary" size="sm" onClick={handleNotificationSave}>
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <Card className="max-w-2xl">
          <CardHeader
            title="Interface Appearance"
            subtitle="Customize the color scheme and contrast of your Dayflow workstation."
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Sun className={`w-6 h-6 mb-3 ${theme === 'light' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Crisp white enterprise workspace</p>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Moon className={`w-6 h-6 mb-3 ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Deep slate sleek dark contrast</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  setTheme(prefersDark ? 'dark' : 'light');
                  showToast('System Match', 'Theme matched to your operating system preference.', 'info');
                }}
                className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-left hover:border-slate-300 transition-all"
              >
                <Monitor className="w-6 h-6 mb-3 text-slate-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">System Synchronize</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Detect OS dark/light mode</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
