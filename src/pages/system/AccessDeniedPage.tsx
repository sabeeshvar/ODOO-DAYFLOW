import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ShieldAlert, ArrowLeft, ArrowLeftRight } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  const { role, loginAsDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
          403 — Unauthorized Access
        </span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          You are authenticated as <span className="font-semibold text-slate-700 dark:text-slate-300">{role || 'GUEST'}</span>. This workspace is restricted exclusively to Admin and HR Officers.
        </p>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-left text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">Testing Admin Privileges?</p>
          <p className="text-[11px] leading-relaxed">
            Switch to the demo HR Admin account (Alex Rivera) to evaluate administrative features.
          </p>
          <button
            onClick={() => {
              loginAsDemo('ADMIN');
              window.location.href = '/admin/dashboard';
            }}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch to HR Admin Demo</span>
          </button>
        </div>

        <div className="pt-2">
          <Link to="/employee/dashboard">
            <Button variant="outline" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to Employee Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
