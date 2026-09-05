import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Briefcase, 
  Hash, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState(`DF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password rules checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setErrorMessage('Please satisfy all password strength requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      employeeId,
      name,
      email,
      password,
      role,
      department,
      designation,
    });
    setIsLoading(false);

    if (result.success) {
      showToast('Account Created Successfully', 'Your Dayflow profile has been established.', 'success');
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message || 'Registration failed. Please review your input.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            DAYFLOW
          </span>
        </Link>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create employee account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                type="text"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value.toUpperCase())}
                icon={<Hash className="w-4 h-4" />}
                required
              />
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={e => setName(e.target.value)}
                icon={<UserIcon className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Work Email Address"
              type="email"
              placeholder="e.g. jordan.m@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Assigned Department"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Product', label: 'Product & Design' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Finance', label: 'Finance & Ops' },
                ]}
              />

              <Input
                label="Designation / Role"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                icon={<Briefcase className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                System Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('EMPLOYEE')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'EMPLOYEE'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">EMPLOYEE</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Self-service, attendance, leave & payslips</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === 'ADMIN'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">ADMIN / HR OFFICER</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Manage workforce, approvals & payroll</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {/* Password Validation Indicator */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] space-y-1 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>At least 8 characters length</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>Contains uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>Contains numeric digit</span>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-500' : 'text-rose-500'}`} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
            >
              Complete Registration
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            ← Back to Dayflow homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
