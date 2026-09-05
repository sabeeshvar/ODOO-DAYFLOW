import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MailCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const EmailVerificationPage: React.FC = () => {
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
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <MailCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Verify your employee email
            </h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We have dispatched an activation confirmation link to your inbox. For demo evaluation, demo accounts are automatically pre-verified.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/login">
              <Button size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
