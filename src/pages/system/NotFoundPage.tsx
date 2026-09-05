import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <span className="font-mono text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 block">
          404
        </span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The workstation page you requested does not exist, has been archived, or moved.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="md" icon={<Home className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
