import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { AttendanceRecord } from '../../types';
import { 
  Clock, 
  PlayCircle, 
  StopCircle, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [filterMonth, setFilterMonth] = useState('2026-09');

  const refreshAttendance = () => {
    if (!user) return;
    const records = dataService.getEmployeeAttendance(user.employeeId);
    setAttendanceList(records);
  };

  useEffect(() => {
    refreshAttendance();
    const unsub = dataService.subscribe(refreshAttendance);
    return unsub;
  }, [user]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceList.find(a => a.date === todayStr);

  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;

  const handleCheckIn = () => {
    if (!user) return;
    dataService.checkIn(user.employeeId, user.name);
    showToast('Checked In', 'Your arrival time has been saved.', 'success');
  };

  const handleCheckOut = () => {
    if (!user) return;
    dataService.checkOut(user.employeeId);
    showToast('Checked Out', 'Your departure time has been saved.', 'info');
  };

  // Stats calculation
  const totalRecords = attendanceList.length;
  const presentDays = attendanceList.filter(a => a.status === 'Present').length;
  const halfDays = attendanceList.filter(a => a.status === 'Half-day').length;
  const leaveDays = attendanceList.filter(a => a.status === 'Leave').length;
  const absentDays = attendanceList.filter(a => a.status === 'Absent').length;
  const attendanceRate = totalRecords > 0 ? Math.round(((presentDays + halfDays * 0.5) / totalRecords) * 100) : 100;

  // Filter records
  const filteredRecords = attendanceList.filter(r => r.date.startsWith(filterMonth));

  const exportCSV = () => {
    const headers = ['Date,Check In,Check Out,Working Hours,Status,Notes\n'];
    const rows = filteredRecords.map(
      r => `"${r.date}","${r.checkIn || ''}","${r.checkOut || ''}",${r.workingHours},"${r.status}","${r.notes || ''}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${user?.employeeId}_${filterMonth}.csv`;
    a.click();
    showToast('Attendance Exported', 'CSV report downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            My Attendance & Timesheets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time daily punch clock, historical working logs, and punctuality records.
          </p>
        </div>

        {/* Punch Controls */}
        <div className="flex items-center gap-3">
          {!todayRecord?.checkIn && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCheckIn}
              icon={<PlayCircle className="w-4 h-4" />}
            >
              Punch In (Check In)
            </Button>
          )}

          {isCheckedIn && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCheckOut}
              icon={<StopCircle className="w-4 h-4" />}
            >
              Punch Out (Check Out)
            </Button>
          )}

          {isCheckedOut && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Shift Completed Today</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Present Days"
          value={presentDays}
          subtitle="Regular full shifts"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Half-Days"
          value={halfDays}
          subtitle="Partial shifts"
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Leave Days"
          value={leaveDays}
          subtitle="Approved leaves"
          icon={<Calendar className="w-4 h-4" />}
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          iconColor="text-sky-600 dark:text-sky-400"
        />
        <StatCard
          title="Absences"
          value={absentDays}
          subtitle="Unexcused"
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Overall reliability"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Timesheet Table */}
      <Card>
        <CardHeader
          title="Attendance Logs"
          subtitle="Verified check-ins and check-outs for this period"
          action={
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Month:</label>
              <input
                type="month"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          }
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Check In</th>
                  <th className="px-6 py-3.5">Check Out</th>
                  <th className="px-6 py-3.5">Working Hours</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {record.date} {record.date === todayStr ? '(Today)' : ''}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {record.checkIn || '--:--'}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {record.checkOut || '--:--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {record.workingHours > 0 ? `${record.workingHours} hrs` : record.checkIn ? 'In Progress' : '0.0 hrs'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={record.status as any} dot>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {record.notes || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
