import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to DAYFLOW</span>
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Dayflow Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Effective Date: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Scope and Workforce Data Processing</h2>
            <p className="mt-1">
              DAYFLOW functions as a Human Resource Management System (HRMS) data processor for enterprise personnel records. We process employee identifiers, attendance timestamps, leave requests, and payroll records solely on behalf of employer organizations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Personal Information Collected</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm">
              <li><strong>Identity Details:</strong> Full name, employee ID number, work email address, contact numbers, and system avatar.</li>
              <li><strong>Employment Profile:</strong> Department, designation, reporting manager, joining date, and salary structure parameters.</li>
              <li><strong>Operational Logs:</strong> Time clock check-in and check-out timestamps, working hours, and leave application records.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Role-Based Privacy Segregation</h2>
            <p className="mt-1">
              Employees retain private visibility into their own individual records. Administrative access is restricted to verified HR officers and company managers.
            </p>
          </section>

          <section className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <strong>Commercial Policy Notice:</strong> Consumer commerce terms (such as physical product returns, shipping, and refunds) are marked <em>Not Applicable</em> as DAYFLOW is a dedicated B2B enterprise software application.
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to DAYFLOW</span>
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Last Updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="mt-1">
              By accessing DAYFLOW ("Service"), users agree to adhere to these terms and the acceptable usage policies mandated by their sponsoring enterprise or employer.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. User Accounts & Responsibilities</h2>
            <p className="mt-1">
              Authorized users must safeguard their authentication credentials. Falsifying attendance check-in logs or attempting to bypass role-based security boundaries constitutes a breach of employment policies.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. System Availability and SLA</h2>
            <p className="mt-1">
              DAYFLOW aims for continuous 99.9% uptime. Routine maintenance windows are scheduled outside standard local working hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const SecurityPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to DAYFLOW</span>
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Security Architecture & Standards</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Compliance & Data Protection Guide</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-indigo-500 mb-2" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Strict RBAC Guards</h3>
              <p className="text-xs text-slate-500 mt-1">Route-level and API-level role barriers prevent unauthorized horizontal or vertical privilege escalation.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <Lock className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Encrypted Vaulting</h3>
              <p className="text-xs text-slate-500 mt-1">Salaries, bank tokens, and identity documents are encrypted at rest and in transit.</p>
            </div>
          </div>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Audit Trails & Logs</h2>
            <p className="mt-1">
              Every leave approval, rejection comment, salary structure edit, and attendance check timestamp is recorded with an immutable audit log and actor identity.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
