import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  Sun, 
  Moon,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleQuickDemo = (role: 'ADMIN' | 'EMPLOYEE') => {
    loginAsDemo(role);
    navigate(role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard');
  };

  const faqs = [
    {
      q: 'How does DAYFLOW differ from traditional enterprise HR portals?',
      a: 'DAYFLOW blends the power of enterprise ERPs with modern consumer-grade SaaS UX. It provides role-governed workflows for attendance check-ins, leave approvals, salary structure management, and real-time workforce analytics without bloated complexity.'
    },
    {
      q: 'Can employees view or edit other team members’ salaries and documents?',
      a: 'No. DAYFLOW enforces strict role-based access control (RBAC). Employees can only access their own attendance logs, leave balances, payslips, and personal contact info. Administrators and HR officers manage approvals and compensation across teams.'
    },
    {
      q: 'Is this system ready for hackathon or classroom evaluations?',
      a: 'Yes! DAYFLOW includes rich out-of-the-box demo datasets across 10 realistic employees, multiple departments, complete payroll slips, and attendance histories, with instantaneous one-click demo login buttons for both Admin and Employee roles.'
    },
    {
      q: 'How does attendance tracking calculate working hours?',
      a: 'Employees can check in and check out from their dashboard or attendance view. Working hours and status (Present, Half-day, Absent, Leave) are recorded and dynamically aggregated for payroll calculation and HR KPI tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <header className="border-b border-slate-100 dark:border-slate-800/80 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                DAYFLOW
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Core Features</a>
            <a href="#experiences" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Roles</a>
            <a href="#analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Analytics</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Enterprise Human Resource Management</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Every workday, <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dayflow unifies employee management, real-time attendance, leave workflows, transparent payroll computation, and workforce analytics in a unified, modern interface.
          </p>

          {/* CTA & Quick Demos */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl transition-all"
            >
              Sign In to Account
            </Link>
          </div>

          {/* 1-Click Demo Evaluation Pills */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 max-w-xl mx-auto">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              One-Click Interactive Demo Evaluation:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleQuickDemo('ADMIN')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Explore as HR Admin (Alex)</span>
              </button>
              <button
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Explore as Employee (Sarah)</span>
              </button>
            </div>
          </div>

          {/* Interactive UI Mockup Card Preview */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 to-transparent border border-indigo-200/40 dark:border-indigo-800/40 shadow-2xl">
            <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 text-left p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">app.dayflow.demo / admin-dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Sync Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Total Workforce</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">10 Staff</p>
                  <p className="text-[11px] text-emerald-400 mt-1">100% Onboarded</p>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Present Today</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">9 Staff</p>
                  <p className="text-[11px] text-slate-400 mt-1">90.0% Attendance</p>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Pending Approvals</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">2 Requests</p>
                  <p className="text-[11px] text-slate-400 mt-1">Avg 2hr review</p>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <p className="text-xs text-slate-400">Monthly Payroll</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-400 mt-1">$124,500</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Why Dayflow */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered for seamless HR operations
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Say goodbye to fragmented spreadsheets and clunky legacy software. Dayflow brings every workday component into unified harmony.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Employee Directory</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralized workforce database with searchable profiles, job roles, departments, contract documents, and account status toggling.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Attendance Engine</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One-click Check In & Check Out with automatic elapsed working hours computation, daily statuses (Present, Half-day, Leave), and audit logs.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl w-fit mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave & Time-Off Approvals</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Employees apply for Paid, Sick, or Unpaid leaves. Admins review in real-time with mandatory rejection reasons and quota recalculation.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl w-fit mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Transparent Payroll & Payslips</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dynamic salary structures with Basic, HRA, Allowances, PF, and Tax. Downloadable and printable modern salary slip documents.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl w-fit mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Workforce Analytics</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Visual charts powered by Recharts detailing attendance trends, leave utilization, department headcount, and payroll distribution.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dual-Role Security</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hardened RBAC route guards prevent employees from reaching admin pages with graceful 403 access denial and audit tracing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Comparison Experience */}
      <section id="experiences" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              Tailored perspectives for every role
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
              Empower your staff while giving your HR leaders comprehensive control.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employee View Card */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Employee Workspace</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Sarah Jenkins</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Senior Fullstack Engineer</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal dashboard with live clock and one-click Check In / Check Out</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Apply for leaves with automatic duration computation & quota tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>View read-only itemized salary breakdown and print monthly payslips</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Edit personal contact information (phone, address) without compromising job data</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Secure repository for offer letters, NDA, and tax declarations</span>
                </li>
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleQuickDemo('EMPLOYEE')}
                  className="w-full py-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
                >
                  Test Employee Dashboard
                </button>
              </div>
            </div>

            {/* Admin View Card */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">HR Leadership Workspace</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Alex Rivera</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Head of People & Culture</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Executive KPI cards: Total Headcount, Present Today, Leaves, Payroll Burn</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Full employee directory with search, filter, adding staff, and status toggle</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Leave Approvals queue with instant approve & mandatory rejection feedback</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Salary Structure configuration: modify Basic, HRA, and tax deductions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Exportable attendance registers, payroll ledgers, and directory reports</span>
                </li>
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  Test HR Admin Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about DAYFLOW and its operational structure.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold">
            Ready to align your workforce?
          </h2>
          <p className="mt-3 text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
            Experience DAYFLOW right now with loaded seed data or create a customized account in seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-700 hover:bg-slate-100 text-sm font-bold rounded-xl shadow-lg transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-800/80 hover:bg-indigo-800 text-white text-sm font-semibold rounded-xl border border-indigo-400/40 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  DAYFLOW
                </span>
                <p className="text-[10px] text-slate-400">Every workday, perfectly aligned.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
              <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/security" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security Architecture</Link>
              <Link to="/compliance" className="hover:text-slate-900 dark:hover:text-white transition-colors">Compliance</Link>
              <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help & FAQ</a>
            </div>

            <div className="text-center md:text-right text-[11px]">
              <p>© 2026 DAYFLOW Technologies Inc. All rights reserved.</p>
              <p className="mt-0.5 text-slate-400">Production-Grade HRMS Architecture</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
