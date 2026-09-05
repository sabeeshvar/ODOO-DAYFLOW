import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Edit3, 
  Download,
  Users
} from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus, Employee } from '../../types';

export const AdminAttendancePage: React.FC = () => {
  const { showToast } = useNotifications();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'daily' | 'all'>('daily');

  // Manual Edit Modal
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editHours, setEditHours] = useState(8.5);

  const refreshData = () => {
    setAttendance(dataService.getAttendance());
    setEmployees(dataService.getEmployees());
  };

  useEffect(() => {
    refreshData();
    const unsub = dataService.subscribe(refreshData);
    return unsub;
  }, []);

  // Filter records
  const filtered = attendance.filter(rec => {
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = viewMode === 'all' || rec.date === selectedDate;
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Calculate statistics for currently selected date
  const dateRecords = attendance.filter(a => a.date === selectedDate);
  const presentCount = dateRecords.filter(a => a.status === 'Present').length;
  const leaveCount = dateRecords.filter(a => a.status === 'Leave').length;
  const halfDayCount = dateRecords.filter(a => a.status === 'Half-day').length;
  const absentCount = dateRecords.filter(a => a.status === 'Absent').length;
  const totalRoster = employees.length || 1;
  const attendanceRate = Math.round((presentCount / totalRoster) * 100);

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setEditCheckIn(rec.checkIn || '09:00 AM');
    setEditCheckOut(rec.checkOut || '05:30 PM');
    setEditStatus(rec.status);
    setEditHours(rec.workingHours || 8.5);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const list = dataService.getAttendance();
    const idx = list.findIndex(a => a.id === editingRecord.id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        checkIn: editCheckIn,
        checkOut: editCheckOut,
        status: editStatus,
        workingHours: Number(editHours),
        notes: 'Administrative correction'
      };
      localStorage.setItem('dayflow_attendance_v1', JSON.stringify(list));
      showToast('Attendance Updated', `Attendance log for ${editingRecord.employeeName} corrected.`, 'success');
      setEditingRecord(null);
      refreshData();
    }
  };

  const handleExportCSV = () => {
    let csv = 'Record ID,Date,Employee ID,Employee Name,Check In,Check Out,Hours,Status\n';
    filtered.forEach(r => {
      csv += `${r.id},${r.date},${r.employeeId},"${r.employeeName}",${r.checkIn || ''},${r.checkOut || ''},${r.workingHours},${r.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Attendance_${selectedDate}.csv`;
    a.click();
    showToast('Export Generated', `Exported ${filtered.length} attendance rows to CSV.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Enterprise Attendance Administration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor daily employee check-ins, verify shift hours, and execute administrative attendance corrections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export Attendance CSV
          </Button>
        </div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change={`Date: ${selectedDate}`}
          trend="up"
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Present On-Duty"
          value={presentCount}
          change={`Of ${totalRoster} total employees`}
          icon={<Users className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Approved Leave"
          value={leaveCount}
          change="Scheduled time-off"
          icon={<Calendar className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Half-Day Shifts"
          value={halfDayCount}
          change="Partial shift"
          icon={<Clock className="w-5 h-5 text-sky-500" />}
        />
        <StatCard
          title="Unexcused Absence"
          value={absentCount}
          change="Flagged non-check-in"
          trend={absentCount > 0 ? 'down' : 'neutral'}
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        />
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee name or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              All Records
            </button>
          </div>

          {/* Date Picker */}
          {viewMode === 'daily' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
              />
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">On Leave</option>
              <option value="Half-day">Half-day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader
          title={`Attendance Log (${filtered.length} entries)`}
          subtitle={`Showing records for ${viewMode === 'daily' ? selectedDate : 'all recorded sessions'}`}
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Check-In</th>
                  <th className="px-6 py-3.5">Check-Out</th>
                  <th className="px-6 py-3.5">Working Hours</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Admin Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No attendance records found matching this query.
                    </td>
                  </tr>
                ) : (
                  filtered.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">{rec.date}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{rec.employeeName}</p>
                        <p className="font-mono text-[10px] text-slate-400">{rec.employeeId}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{rec.checkIn || '—'}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{rec.checkOut || '—'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {rec.workingHours > 0 ? `${rec.workingHours} hrs` : '0.0 hrs'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={rec.status === 'Present' ? 'success' : rec.status === 'Leave' ? 'warning' : 'danger'}>
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(rec)}
                          icon={<Edit3 className="w-3.5 h-3.5" />}
                        >
                          Modify
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Override Modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title={`Adjust Attendance Record: ${editingRecord?.employeeName}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Date: <span className="font-semibold text-slate-900 dark:text-white">{editingRecord?.date}</span> • Employee:{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{editingRecord?.employeeId}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Check-In Time"
              value={editCheckIn}
              onChange={e => setEditCheckIn(e.target.value)}
              placeholder="e.g. 09:00 AM"
              required
            />
            <Input
              label="Check-Out Time"
              value={editCheckOut}
              onChange={e => setEditCheckOut(e.target.value)}
              placeholder="e.g. 05:30 PM"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status Designation"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value as AttendanceStatus)}
              options={[
                { value: 'Present', label: 'Present' },
                { value: 'Absent', label: 'Absent' },
                { value: 'Half-day', label: 'Half-day' },
                { value: 'Leave', label: 'Leave' },
              ]}
            />
            <Input
              label="Working Hours"
              type="number"
              step="0.5"
              value={editHours}
              onChange={e => setEditHours(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingRecord(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Attendance Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
