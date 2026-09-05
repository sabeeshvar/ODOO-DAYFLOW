import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import type { LeaveRequest, LeaveType } from '../../types';
import { 
  CalendarCheck, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysCount, setDaysCount] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState('');

  const refreshLeaves = () => {
    if (!user) return;
    setLeaves(dataService.getEmployeeLeaveRequests(user.employeeId));
  };

  useEffect(() => {
    refreshLeaves();
    const unsub = dataService.subscribe(refreshLeaves);
    return unsub;
  }, [user]);

  // Date difference calculation & validation
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setFormError('End date cannot be prior to start date.');
      } else {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDaysCount(diffDays);
        setFormError('');
      }
    }
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (formError) return;
    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    dataService.applyLeave({
      employeeId: user.employeeId,
      employeeName: user.name,
      department: user.department,
      leaveType,
      startDate,
      endDate,
      days: daysCount,
      remarks,
    });

    showToast('Leave Application Submitted', `Request for ${daysCount} day(s) submitted to HR administration.`, 'success');
    setIsApplyModalOpen(false);
    setStartDate('');
    setEndDate('');
    setRemarks('');
  };

  const leaveStats = user ? dataService.getLeaveStats(user.employeeId) : null;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved');
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your leave balance, apply for holidays or medical leaves, and view approval decisions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsApplyModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Leave"
          value={`${leaveStats?.remainingDays || 18} Days`}
          subtitle="Annual Paid Leave entitlement"
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Used Leave"
          value={`${leaveStats?.usedDays || 6} Days`}
          subtitle="Consumed in current year"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Requests"
          value={`${pendingLeaves.length}`}
          subtitle="Awaiting HR Officer decision"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Approved Requests"
          value={`${approvedLeaves.length}`}
          subtitle="Successfully authorized"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          iconColor="text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Leave History Table */}
      <Card>
        <CardHeader
          title="Leave History & Applications"
          subtitle="Chronological list of all filed requests and supervisory comments"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Leave Type</th>
                  <th className="px-6 py-3.5">Date Range</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Remarks / Reason</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status & Reviewer Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No leave requests filed yet. Click "Apply for Leave" above.
                    </td>
                  </tr>
                ) : (
                  leaves.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {req.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {req.startDate} → {req.endDate}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                        {req.remarks}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {req.appliedAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <Badge variant={req.status as any} dot>
                            {req.status}
                          </Badge>
                          {req.adminComment && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mt-1">
                              <strong>HR:</strong> "{req.adminComment}"
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave / Time-Off"
        description="Select your leave classification and requested date range."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Select
            label="Leave Type"
            value={leaveType}
            onChange={e => setLeaveType(e.target.value as LeaveType)}
            options={[
              { value: 'Paid Leave', label: 'Paid Leave (Annual Quota)' },
              { value: 'Sick Leave', label: 'Sick Leave (Medical Certification)' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave (Personal sabbatical)' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Duration Requested:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">
              {daysCount} {daysCount === 1 ? 'Workday' : 'Workdays'}
            </span>
          </div>

          <Textarea
            label="Reason & Remarks"
            placeholder="Please detail your reason for taking time off..."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={3}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
