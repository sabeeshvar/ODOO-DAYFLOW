import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Textarea } from '../../components/common/Textarea';
import { 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  AlertCircle
} from 'lucide-react';
import type { LeaveRequest } from '../../types';

export const LeaveApprovalsPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Filtering
  const [statusTab, setStatusTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection Modal State
  const [rejectingLeave, setRejectingLeave] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  // Approval Confirmation Modal State
  const [approvingLeave, setApprovingLeave] = useState<LeaveRequest | null>(null);

  const refreshLeaves = () => {
    setLeaves(dataService.getLeaveRequests());
  };

  useEffect(() => {
    refreshLeaves();
    const unsub = dataService.subscribe(refreshLeaves);
    return unsub;
  }, []);

  const filtered = leaves.filter(l => {
    const matchesStatus = statusTab === 'All' || l.status === statusTab;
    const matchesType = typeFilter === 'All' || l.leaveType === typeFilter;
    const matchesSearch = 
      l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  const handleConfirmApproval = () => {
    if (!approvingLeave) return;

    dataService.reviewLeaveRequest(approvingLeave.id, 'Approved', 'Approved by HR Administrator');
    showToast(
      'Leave Approved',
      `Leave request for ${approvingLeave.employeeName} (${approvingLeave.days} days) has been authorized.`,
      'success'
    );
    setApprovingLeave(null);
    refreshLeaves();
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLeave) return;

    if (!rejectComment.trim()) {
      showToast('Comment Required', 'An administrative reason is mandatory when declining leave.', 'error');
      return;
    }

    dataService.reviewLeaveRequest(rejectingLeave.id, 'Rejected', rejectComment.trim());
    showToast(
      'Leave Declined',
      `Leave request for ${rejectingLeave.employeeName} marked rejected with comments.`,
      'info'
    );
    setRejectingLeave(null);
    setRejectComment('');
    refreshLeaves();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Leave Approvals & Time-Off Requests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review time-off requests, authorize employee schedules, and provide structured feedback.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          change="Awaiting your decision"
          trend={pendingCount > 0 ? 'down' : 'neutral'}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Approved This Period"
          value={approvedCount}
          change="Active scheduled leaves"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Rejected / Returned"
          value={rejectedCount}
          change="Declined with comments"
          icon={<XCircle className="w-5 h-5 text-rose-500" />}
        />
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-full md:w-auto">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                statusTab === tab
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <span>{tab}</span>
              {tab === 'Pending' && pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee or dept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Paid Leave">Paid Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader
          title={`Leave Requests (${filtered.length})`}
          subtitle="Showing applications submitted by workforce team members"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Leave Type</th>
                  <th className="px-6 py-3.5">Duration & Dates</th>
                  <th className="px-6 py-3.5">Remarks / Reason</th>
                  <th className="px-6 py-3.5">Applied Timestamp</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No leave applications found matching this view.
                    </td>
                  </tr>
                ) : (
                  filtered.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{req.employeeName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{req.employeeId} • {req.department}</p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {req.leaveType}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">{req.days} day(s)</p>
                        <p className="text-[11px] text-slate-400">{req.startDate} → {req.endDate}</p>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-slate-700 dark:text-slate-300 italic">"{req.remarks}"</p>
                        {req.adminComment && (
                          <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">
                            HR Note: {req.adminComment}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {req.appliedAt}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'danger'}>
                          {req.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setApprovingLeave(req)}
                              icon={<Check className="w-3.5 h-3.5" />}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setRejectingLeave(req);
                                setRejectComment('');
                              }}
                              icon={<X className="w-3.5 h-3.5" />}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Confirmation Dialog */}
      <Modal
        isOpen={!!approvingLeave}
        onClose={() => setApprovingLeave(null)}
        title="Authorize Leave Request"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Confirm approval for <span className="font-bold text-slate-900 dark:text-white">{approvingLeave?.employeeName}</span> for{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{approvingLeave?.days} day(s)</span> ({approvingLeave?.leaveType}).
          </p>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300">
            This will decrement the employee's available leave balance and dispatch an instant notification to their portal.
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApprovingLeave(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmApproval}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Confirm Authorization
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal with Mandatory Comment */}
      <Modal
        isOpen={!!rejectingLeave}
        onClose={() => setRejectingLeave(null)}
        title={`Decline Leave: ${rejectingLeave?.employeeName}`}
      >
        <form onSubmit={handleConfirmRejection} className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              A professional reason is required when declining employee time-off requests so they understand the context or alternate arrangements.
            </span>
          </div>

          <Textarea
            label="Administrative Reason for Declining"
            placeholder="e.g. Critical release sprint scheduled; insufficient team coverage on requested dates."
            value={rejectComment}
            onChange={e => setRejectComment(e.target.value)}
            required
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectingLeave(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
            >
              Decline Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
