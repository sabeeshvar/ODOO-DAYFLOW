import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const ErrorPage: React.FC = () => {
  const handleResetData = () => {
    dataService.resetData();
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
          500 — System Exception
        </span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
          Unexpected Application State
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Dayflow encountered an unhandled operational exception or temporary network timeout. Your locally persisted personnel data remains safeguarded.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => window.location.reload()}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reload Workstation
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleResetData}
            className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
          >
            Restore Default Demonstration Records
          </button>
        </div>
      </div>
    </div>
  );
};
