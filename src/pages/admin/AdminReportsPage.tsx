import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
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
  LineChart, 
  Line 
} from 'recharts';
import { 
  Download, 
  Printer, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  DollarSign
} from 'lucide-react';
import type { Employee, LeaveRequest } from '../../types';

export const AdminReportsPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Filter States
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q3');

  useEffect(() => {
    setEmployees(dataService.getEmployees());
    setLeaves(dataService.getLeaveRequests());
  }, []);

  const departments = ['All', 'Engineering', 'Human Resources', 'Design', 'Product', 'Marketing', 'Finance', 'Sales'];

  const filteredEmployees = selectedDept === 'All' 
    ? employees 
    : employees.filter(e => e.department === selectedDept);

  // Compute Department Distribution
  const deptMap: Record<string, number> = {};
  employees.forEach(e => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, count]) => ({
    name,
    count
  }));

  // Leave Distribution by Type
  const paidLeaveCount = leaves.filter(l => l.leaveType === 'Paid Leave').length;
  const sickLeaveCount = leaves.filter(l => l.leaveType === 'Sick Leave').length;
  const unpaidLeaveCount = leaves.filter(l => l.leaveType === 'Unpaid Leave').length;
  const leavePieData = [
    { name: 'Paid Leaves', value: paidLeaveCount || 10, color: '#4F46E5' },
    { name: 'Sick Leaves', value: sickLeaveCount || 4, color: '#10B981' },
    { name: 'Unpaid Leaves', value: unpaidLeaveCount || 1, color: '#F59E0B' },
  ];

  // 6-Month Attendance & Compliance Trends
  const monthlyTrendData = [
    { month: 'Apr', attendanceRate: 97.5, approvedLeaves: 12, payroll: 84000 },
    { month: 'May', attendanceRate: 98.2, approvedLeaves: 8, payroll: 86500 },
    { month: 'Jun', attendanceRate: 96.8, approvedLeaves: 14, payroll: 89000 },
    { month: 'Jul', attendanceRate: 98.6, approvedLeaves: 9, payroll: 91500 },
    { month: 'Aug', attendanceRate: 97.9, approvedLeaves: 11, payroll: 93200 },
    { month: 'Sep', attendanceRate: 99.1, approvedLeaves: 6, payroll: 95800 },
  ];

  const handleExportCompanyCSV = () => {
    let csv = `DAYFLOW ENTERPRISE WORKFORCE REPORT\n`;
    csv += `Generated Period: ${selectedPeriod}, Department Filter: ${selectedDept}\n\n`;
    csv += `Employee ID,Name,Department,Designation,Status,Basic Salary,Net Salary\n`;

    filteredEmployees.forEach(e => {
      csv += `${e.employeeId},"${e.name}",${e.department},${e.designation},${e.status},${e.salaryStructure.basicSalary},${e.salaryStructure.netSalary}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Workforce_Report_${selectedPeriod}_${selectedDept}.csv`;
    a.click();
    showToast('Comprehensive Report Exported', 'CSV analytics document downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Organizational Reports & Talent Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise intelligence on headcount trends, leave patterns, payroll commitments, and attendance SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCompanyCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export All Data (CSV)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Summary Report
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Department Scope:</span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quarterly Period:</span>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="2026-Q3">Q3 2026 (Jul - Sep)</option>
              <option value="2026-Q2">Q2 2026 (Apr - Jun)</option>
              <option value="2026-Q1">Q1 2026 (Jan - Mar)</option>
              <option value="2026-YTD">Year-to-Date 2026</option>
            </select>
          </div>
        </div>

        <Badge variant="primary">
          Scope: {filteredEmployees.length} Personnel
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Workforce In Scope"
          value={filteredEmployees.length}
          change={`Across ${selectedDept} Dept`}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Average Attendance SLA"
          value="98.1%"
          trend="up"
          change="+0.8% from previous period"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Total Leave Approvals"
          value={leaves.filter(l => l.status === 'Approved').length}
          change="Authorized workforce days"
          icon={<CalendarCheck className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Gross Payroll Total"
          value={`$${filteredEmployees.reduce((s, e) => s + e.salaryStructure.grossSalary, 0).toLocaleString()}`}
          change="Monthly allocated budget"
          icon={<DollarSign className="w-5 h-5 text-violet-500" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card className="p-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Organization Attendance SLA Rate</h3>
            <p className="text-xs text-slate-400 mt-0.5">Historical monthly adherence percentage (%)</p>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Attendance Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="attendanceRate"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leave Category Distribution */}
        <Card className="p-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave Category Proportions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ratio of paid vacation vs medical vs unpaid</p>
          </div>
          <div className="h-72 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leavePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leavePieData.map((entry, index) => (
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
                  formatter={(val: any) => [`${val} Applications`, 'Count']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Talent Allocation */}
        <Card className="p-6 lg:col-span-2">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Headcount Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active personnel deployed per functional department</p>
            </div>
            <Badge variant="neutral">{employees.length} Total Headcount</Badge>
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
                <Bar dataKey="count" name="Staff Members" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Roster Preview */}
      <Card>
        <CardHeader
          title={`Detailed Workforce Ledger — ${selectedDept} Department`}
          subtitle="Tabular breakdown of current active personnel in selected scope"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Employee ID & Name</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Designation</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Gross Monthly</th>
                  <th className="px-6 py-3.5">Net Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                      {e.name} <span className="font-mono text-slate-400 font-normal">({e.employeeId})</span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-indigo-600 dark:text-indigo-400">{e.department}</td>
                    <td className="px-6 py-3.5">{e.designation}</td>
                    <td className="px-6 py-3.5">
                      <Badge variant={e.status === 'Active' ? 'success' : 'neutral'}>{e.status}</Badge>
                    </td>
                    <td className="px-6 py-3.5 font-mono">${e.salaryStructure.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${e.salaryStructure.netSalary.toLocaleString()}
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
