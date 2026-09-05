import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Bell, 
  CheckCheck, 
  CalendarCheck, 
  Clock, 
  DollarSign, 
  UserCheck, 
  ExternalLink
} from 'lucide-react';
import type { NotificationType } from '../../types';

export const NotificationCenterPage: React.FC = () => {
  const { role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (statusFilter === 'unread' && n.read) return false;
    if (statusFilter === 'read' && !n.read) return false;
    return true;
  });

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'leave':
        return <CalendarCheck className="w-5 h-5 text-indigo-500" />;
      case 'attendance':
        return <Clock className="w-5 h-5 text-emerald-500" />;
      case 'payroll':
        return <DollarSign className="w-5 h-5 text-amber-500" />;
      case 'employee':
        return <UserCheck className="w-5 h-5 text-sky-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time workplace announcements, leave decisions, attendance alerts, and payroll disbursements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'leave', 'attendance', 'payroll', 'employee'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? 'All Alerts' : `${type}s`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No notifications found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You're completely up to date! System notifications will appear here when approvals or updates occur.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                !notification.read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getTypeIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-semibold ${
                      !notification.read ? 'text-indigo-950 dark:text-indigo-200 font-bold' : 'text-slate-900 dark:text-white'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{notification.createdAt}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {notification.message}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <Badge variant={notification.type === 'leave' ? 'primary' : notification.type === 'payroll' ? 'warning' : 'success'}>
                    {notification.type.toUpperCase()}
                  </Badge>

                  {notification.link && (
                    <Link
                      to={role === 'ADMIN' && notification.link.startsWith('/employee') ? '/admin/dashboard' : notification.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Open Associated Workflow</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
