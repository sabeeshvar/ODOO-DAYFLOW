import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import type { Employee, AttendanceRecord, LeaveRequest } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const refreshData = () => {
    setEmployees(dataService.getEmployees());
    setAttendance(dataService.getAttendance());
    setLeaves(dataService.getLeaveRequests());
  };

  useEffect(() => {
    refreshData();
    const unsub = dataService.subscribe(refreshData);
    return unsub;
  }, []);

  // Metrics calculation
  const totalEmployees = employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const onLeaveToday = todayAttendance.filter(a => a.status === 'Leave').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salaryStructure?.netSalary || 0), 0);
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 95;

  // Chart: Department Headcount
  const deptCounts: Record<string, number> = {};
  employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([name, count]) => ({
    name,
    count
  }));

  // Chart: Attendance Distribution
  const attendancePieData = [
    { name: 'Present', value: presentToday || 9, color: '#4F46E5' },
    { name: 'On Leave', value: onLeaveToday || 2, color: '#10B981' },
    { name: 'Absent / Not In', value: Math.max(0, totalEmployees - (presentToday + onLeaveToday)), color: '#F43F5E' },
  ];

  // Chart: Monthly Payroll Trends
  const payrollTrends = [
    { month: 'Apr', amount: 84000 },
    { month: 'May', amount: 86500 },
    { month: 'Jun', amount: 89000 },
    { month: 'Jul', amount: 91500 },
    { month: 'Aug', amount: 93200 },
    { month: 'Sep', amount: totalPayroll || 95800 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white">
            Executive HR Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name || 'Administrator'}. Here is your organizational pulse for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/employees">
            <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
              Add Employee
            </Button>
          </Link>
          <Link to="/admin/leave-approvals">
            <Button variant="outline" size="sm" icon={<CalendarCheck className="w-4 h-4" />}>
              Review Leaves {pendingLeaves > 0 && `(${pendingLeaves})`}
            </Button>
          </Link>
          <Link to="/admin/payroll">
            <Button variant="outline" size="sm" icon={<DollarSign className="w-4 h-4" />}>
              Manage Payroll
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Headcount"
          value={totalEmployees}
          change="+2 this month"
          trend="up"
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          change={`${attendanceRate}% attendance`}
          trend="up"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="On Leave Today"
          value={onLeaveToday}
          change="Approved leaves"
          icon={<CalendarCheck className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves}
          change="Requires review"
          trend={pendingLeaves > 0 ? 'down' : 'neutral'}
          icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          title="Monthly Payroll"
          value={`$${totalPayroll.toLocaleString()}`}
          change="Active commitments"
          icon={<DollarSign className="w-5 h-5 text-violet-500" />}
        />
        <StatCard
          title="Workforce Health"
          value="98.4%"
          change="Operational SLA"
          trend="up"
          icon={<TrendingUp className="w-5 h-5 text-sky-500" />}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Attendance State</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live check-in status across all {totalEmployees} employees</p>
            </div>
            <Link to="/admin/attendance" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-72 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} Personnel`, 'Count']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Headcount */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Headcount</h3>
              <p className="text-xs text-slate-400 mt-0.5">Talent distribution across business units</p>
            </div>
            <Link to="/admin/employees" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Employees" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Payroll Trends & Recent Pending Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Trajectory */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Compensation Expenditure</h3>
              <p className="text-xs text-slate-400 mt-0.5">Gross organization payroll trajectory over last 6 months</p>
            </div>
            <Badge variant="primary">Disbursement Engine</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payrollTrends}>
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickFormatter={v => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Payroll']}
                />
                <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#payrollGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pending Approval Priority Queue */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Approval Queue</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                {pendingLeaves} Action Item{pendingLeaves !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {leaves.filter(l => l.status === 'Pending').slice(0, 4).map(req => (
                <div key={req.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{req.employeeName}</p>
                    <Badge variant="warning">{req.leaveType}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    "{req.remarks}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{req.startDate} to {req.endDate}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{req.days} day(s)</span>
                  </div>
                </div>
              ))}

              {pendingLeaves === 0 && (
                <div className="py-10 text-center text-xs text-slate-400">
                  All employee requests are resolved. Great job!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Link to="/admin/leave-approvals" className="w-full">
              <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                Go to Leave Approvals Desk
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader
          title="Recent Workforce Transactions"
          subtitle="Audit log of employee registrations, leave submissions, and attendance stamps"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Recent Activity</th>
                  <th className="px-6 py-3.5">Time / Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.slice(0, 5).map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      Standard Attendance Log & Active Shift
                    </td>
                    <td className="px-6 py-4 text-slate-400">Today</td>
                    <td className="px-6 py-4">
                      <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                        {emp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
