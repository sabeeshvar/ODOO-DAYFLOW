import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
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
  Legend 
} from 'recharts';
import { Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [dateRange, setDateRange] = useState('2026-Q3');

  const monthlyAttendanceTrends = [
    { month: 'Apr', present: 21, absent: 1, leave: 0 },
    { month: 'May', present: 22, absent: 0, leave: 1 },
    { month: 'Jun', present: 20, absent: 1, leave: 1 },
    { month: 'Jul', present: 22, absent: 0, leave: 1 },
    { month: 'Aug', present: 21, absent: 0, leave: 2 },
    { month: 'Sep (Current)', present: 5, absent: 0, leave: 0 },
  ];

  const leaveDistributionData = [
    { name: 'Paid Leaves Taken', value: 4, color: '#4F46E5' },
    { name: 'Sick Leaves Taken', value: 2, color: '#10B981' },
    { name: 'Remaining Balance', value: 18, color: '#94A3B8' },
  ];

  const handleExportSummary = () => {
    const csvContent = `Report,Employee,Period\nWorkforce Summary,${user?.name},${dateRange}\n\nMetric,Value\nAttendance Rate,98.2%\nTotal Working Hours,680 hrs\nApproved Leave Days,6 days\nAvailable Balance,18 days\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Performance_Report_${user?.employeeId}.csv`;
    a.click();
    showToast('Report Exported', 'CSV analytics report downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Personal Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual trends of your attendance regularity, time-off patterns, and compensation history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="2026-Q3">Q3 2026 (Jul - Sep)</option>
            <option value="2026-Q2">Q2 2026 (Apr - Jun)</option>
            <option value="2026-YTD">Year to Date 2026</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummary}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Attendance Trajectory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Days present vs time-off utilization</p>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAttendanceTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="present" name="Present Days" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leave" name="Leave Days" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent Days" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leave Utilization Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Annual Leave Entitlement Ratio</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of 24 allocated annual workdays</p>
            </div>
          </div>
          <div className="h-72 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Days`, 'Quota']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
