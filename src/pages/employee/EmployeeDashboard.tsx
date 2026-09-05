import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  ArrowRight, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import type { LeaveType } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [todayRecord, setTodayRecord] = useState(
    user ? dataService.getTodayAttendanceForEmployee(user.employeeId) : undefined
  );
  const [employeeLeaves, setEmployeeLeaves] = useState(
    user ? dataService.getEmployeeLeaveRequests(user.employeeId) : []
  );
  const [employeePayroll, setEmployeePayroll] = useState(
    user ? dataService.getEmployeePayroll(user.employeeId) : []
  );
  const [fullEmployee, setFullEmployee] = useState(
    user ? dataService.getEmployeeById(user.employeeId) : undefined
  );

  // Apply Leave Modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysCount, setDaysCount] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [leaveError, setLeaveError] = useState('');

  // Live timer simulation for check-in
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    if (!user) return;
    setTodayRecord(dataService.getTodayAttendanceForEmployee(user.employeeId));
    setEmployeeLeaves(dataService.getEmployeeLeaveRequests(user.employeeId));
    setEmployeePayroll(dataService.getEmployeePayroll(user.employeeId));
    setFullEmployee(dataService.getEmployeeById(user.employeeId));
  };

  useEffect(() => {
    refreshData();
    const unsub = dataService.subscribe(refreshData);
    return unsub;
  }, [user]);

  // Check In Handler
  const handleCheckIn = () => {
    if (!user) return;
    dataService.checkIn(user.employeeId, user.name);
    showToast('Check In Recorded', `Clocked in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Have a great day!`, 'success');
  };

  // Check Out Handler
  const handleCheckOut = () => {
    if (!user) return;
    dataService.checkOut(user.employeeId);
    showToast('Check Out Recorded', 'Clocked out successfully. Your work hours have been archived.', 'info');
  };

  // Calculate days difference
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDaysCount(diffDays);
        setLeaveError('');
      } else {
        setLeaveError('End date cannot be earlier than start date.');
      }
    }
  }, [startDate, endDate]);

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (leaveError) return;
    if (!startDate || !endDate) {
      setLeaveError('Please select both start and end dates.');
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

    showToast('Leave Request Submitted', `Applied for ${daysCount} day(s) of ${leaveType}. Sent to HR for approval.`, 'success');
    setIsLeaveModalOpen(false);
    setStartDate('');
    setEndDate('');
    setRemarks('');
  };

  const leaveStats = user ? dataService.getLeaveStats(user.employeeId) : null;
  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;
  const notCheckedIn = !todayRecord?.checkIn;

  // Weekly Working Hours Chart Data
  const weeklyAttendanceData = [
    { day: 'Mon', hours: 8.5, target: 8 },
    { day: 'Tue', hours: 8.2, target: 8 },
    { day: 'Wed', hours: 8.7, target: 8 },
    { day: 'Thu', hours: 8.5, target: 8 },
    { day: 'Fri (Today)', hours: todayRecord?.workingHours || (isCheckedIn ? 4.5 : 0), target: 8 },
  ];

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-2">
            <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Here is your daily workday breakdown. Your shift is underway with all records synchronized.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLeaveModalOpen(true)}
            icon={<CalendarCheck className="w-4 h-4 text-indigo-600" />}
            className="bg-white text-indigo-900 hover:bg-indigo-50 border-transparent shadow-md"
          >
            Apply for Leave
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/employee/payroll')}
            className="border-white/30 text-white hover:bg-white/10"
          >
            My Payslip
          </Button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Status"
          value={
            isCheckedOut
              ? 'Shift Complete'
              : isCheckedIn
              ? 'Checked In'
              : 'Not Clocked In'
          }
          subtitle={
            todayRecord?.checkIn
              ? `Since ${todayRecord.checkIn}`
              : 'Action required'
          }
          icon={<Clock className="w-5 h-5" />}
          iconBg={isCheckedIn ? 'bg-emerald-50 dark:bg-emerald-950/60' : 'bg-amber-50 dark:bg-amber-950/60'}
          iconColor={isCheckedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
        />

        <StatCard
          title="Available Leave"
          value={`${leaveStats?.remainingDays || 18} Days`}
          subtitle={`Used: ${leaveStats?.usedDays || 6} of ${leaveStats?.totalAllocated || 24} annual days`}
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Pending Requests"
          value={`${leaveStats?.pendingRequestsCount || 0}`}
          subtitle="Awaiting HR approval"
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Monthly Net Salary"
          value={`$${(fullEmployee?.salaryStructure?.netSalary || 9930).toLocaleString()}`}
          subtitle="Next payout on Sep 30"
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          iconColor="text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Main Two-Column Content: Attendance Widget + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Attendance Clock-In Widget */}
        <Card className="lg:col-span-1 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Attendance Punch</span>
              </h3>
              <Badge variant={isCheckedIn ? 'Present' : isCheckedOut ? 'neutral' : 'Half-day'}>
                {isCheckedIn ? 'Active Shift' : isCheckedOut ? 'Checked Out' : 'Pending Check-in'}
              </Badge>
            </div>

            <div className="text-center my-6 space-y-2">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white block">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standard Working Hours: 09:00 AM – 05:30 PM
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Check-in Timestamp:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {todayRecord?.checkIn || '--:--'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Check-out Timestamp:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {todayRecord?.checkOut || '--:--'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Logged Hours:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {todayRecord?.workingHours ? `${todayRecord.workingHours} hrs` : isCheckedIn ? 'In Progress' : '0.0 hrs'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            {notCheckedIn && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckIn}
                className="w-full shadow-lg shadow-indigo-500/20"
                icon={<PlayCircle className="w-5 h-5" />}
              >
                Check In Now
              </Button>
            )}

            {isCheckedIn && (
              <Button
                variant="danger"
                size="lg"
                onClick={handleCheckOut}
                className="w-full shadow-lg shadow-rose-500/20"
                icon={<StopCircle className="w-5 h-5" />}
              >
                Check Out
              </Button>
            )}

            {isCheckedOut && (
              <div className="text-center py-2">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Your daily workday shift is completed.</span>
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/employee/attendance"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Attendance Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Card>

        {/* Weekly Hours Overview Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Working Hours</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Logged hours vs daily 8-hour objective</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  On Track (34.3 hrs)
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} Hours`, 'Logged']}
                  />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                    {weeklyAttendanceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#4F46E5' : '#818CF8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Minimum full-time weekly requirement: 40.0 hours</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Punctuality Score: 98%</span>
          </div>
        </Card>
      </div>

      {/* Lower Row: Recent Activity & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <CardHeader
            title="Recent Leave Requests"
            subtitle="Status of your applied time-off"
            action={
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + New Request
              </button>
            }
          />
          <CardContent className="p-0">
            {employeeLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No leave requests filed yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {employeeLeaves.slice(0, 4).map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {req.leaveType}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({req.days} {req.days === 1 ? 'day' : 'days'})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {req.startDate} to {req.endDate}
                      </p>
                      {req.adminComment && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          Admin: "{req.adminComment}"
                        </p>
                      )}
                    </div>
                    <Badge variant={req.status as any}>
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Payslips */}
        <Card>
          <CardHeader
            title="Payroll Summary"
            subtitle="Latest salary distribution & payslips"
            action={
              <Link
                to="/employee/payroll"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                All Payslips →
              </Link>
            }
          />
          <CardContent className="p-0">
            {employeePayroll.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No payroll archives generated yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {employeePayroll.slice(0, 3).map(pay => (
                  <div key={pay.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{pay.month}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Disbursed on: {pay.paymentDate || 'End of month'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ${pay.netSalary.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {pay.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave / Time-Off"
        description="Submit a request for management approval. Balance will be recalculated."
      >
        <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
          {leaveError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{leaveError}</span>
            </div>
          )}

          <Select
            label="Leave Type"
            value={leaveType}
            onChange={e => setLeaveType(e.target.value as LeaveType)}
            options={[
              { value: 'Paid Leave', label: 'Paid Leave (Annual Quota)' },
              { value: 'Sick Leave', label: 'Sick Leave (Medical)' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave / Sabbatical' },
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

          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Calculated Leave Duration:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">
              {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <Textarea
            label="Reason / Remarks"
            placeholder="Brief reason for the leave request..."
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
              onClick={() => setIsLeaveModalOpen(false)}
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
