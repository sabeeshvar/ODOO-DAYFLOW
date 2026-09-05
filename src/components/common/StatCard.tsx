import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon,
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/50',
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  className = '',
}) => {
  // Format trend/change badge
  const renderTrend = () => {
    if (!trend && !change) return null;

    if (typeof trend === 'object' && trend !== null) {
      return (
        <div className="flex items-center gap-1.5 mt-2.5">
          <span
            className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{trend.label}</span>
          )}
        </div>
      );
    }

    const isUp = trend === 'up';
    const isDown = trend === 'down';

    return (
      <div className="flex items-center gap-1.5 mt-2.5">
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
            isUp
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              : isDown
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {isUp ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : isDown ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : (
            <Minus className="w-3 h-3 mr-1" />
          )}
          {change || (isUp ? 'Increased' : isDown ? 'Decreased' : 'Consistent')}
        </span>
      </div>
    );
  };

  return (
    <Card hoverable className={`p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{value}</h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
          {renderTrend()}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
