import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address or Employee ID.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, rememberMe);
    setIsLoading(false);

    if (result.success) {
      showToast('Welcome back!', 'Successfully authenticated to DAYFLOW.', 'success');
      // AuthContext will update user, and App router will redirect to role dashboard
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message || 'Invalid credentials. Please verify your login.');
    }
  };

  const handleDemoLogin = (targetRole: 'ADMIN' | 'EMPLOYEE') => {
    loginAsDemo(targetRole);
    showToast(
      'Demo Mode Active', 
      `Logged in as ${targetRole === 'ADMIN' ? 'HR Admin (Alex Rivera)' : 'Employee (Sarah Jenkins)'}.`,
      'info'
    );
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            DAYFLOW
          </span>
        </Link>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            create a new employee account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Work Email or Employee ID"
              type="text"
              placeholder="e.g. employee@dayflow.demo or DF-1002"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex justify-center text-xs uppercase tracking-wider mb-4">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                Quick Demo Evaluation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="p-3 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>HR Admin</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  admin@dayflow.demo
                </p>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline mt-1 block">
                  1-Click Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('EMPLOYEE')}
                className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Employee</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  employee@dayflow.demo
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline mt-1 block">
                  1-Click Login →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            ← Back to Dayflow homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
