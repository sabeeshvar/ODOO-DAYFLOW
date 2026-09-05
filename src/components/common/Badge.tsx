import React from 'react';

export type BadgeVariant = 
  | 'primary'
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'neutral'
  | 'Present' 
  | 'Absent' 
  | 'Half-day' 
  | 'Leave' 
  | 'Pending' 
  | 'Approved' 
  | 'Rejected' 
  | 'Active' 
  | 'Inactive' 
  | 'Probation'
  | 'On Leave';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
          dot: 'bg-indigo-500'
        };
      case 'Present':
      case 'Approved':
      case 'Active':
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          dot: 'bg-emerald-500'
        };
      case 'Half-day':
      case 'Pending':
      case 'Probation':
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          dot: 'bg-amber-500'
        };
      case 'Absent':
      case 'Rejected':
      case 'Inactive':
      case 'danger':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
          dot: 'bg-rose-500'
        };
      case 'Leave':
      case 'On Leave':
      case 'info':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
          dot: 'bg-sky-500'
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const styles = getStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${sizeClasses} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
};
