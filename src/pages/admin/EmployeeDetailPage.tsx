import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  UserX, 
  UserCheck
} from 'lucide-react';
import type { Employee, AttendanceRecord, LeaveRequest, EmploymentStatus, UserRole } from '../../types';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [employee, setEmployee] = useState<Employee | undefined>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'leave' | 'salary' | 'documents'>('profile');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editStatus, setEditStatus] = useState<EmploymentStatus>('Active');
  const [editRole, setEditRole] = useState<UserRole>('EMPLOYEE');

  const refreshData = () => {
    if (!id) return;
    const emp = dataService.getEmployeeById(id);
    if (!emp) {
      // not found
      return;
    }
    setEmployee(emp);
    setAttendance(dataService.getEmployeeAttendance(emp.employeeId));
    setLeaves(dataService.getEmployeeLeaveRequests(emp.employeeId));

    // Populate edit fields
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone);
    setEditAddress(emp.address);
    setEditDepartment(emp.department);
    setEditDesignation(emp.designation);
    setEditStatus(emp.status);
    setEditRole(emp.role);
  };

  useEffect(() => {
    refreshData();
    const unsub = dataService.subscribe(refreshData);
    return unsub;
  }, [id]);

  if (!employee) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Employee Not Located</h2>
        <p className="text-xs text-slate-400">The requested employee identifier does not match any current personnel record.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/employees')} icon={<ArrowLeft className="w-4 h-4" />}>
          Return to Directory
        </Button>
      </div>
    );
  }

  // Attendance stats
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const leaveCount = attendance.filter(a => a.status === 'Leave').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const totalDays = attendance.length || 1;
  const attendancePercentage = Math.round((presentCount / totalDays) * 100);

  // Leave stats
  const leaveStats = dataService.getLeaveStats(employee.employeeId);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Employee = {
      ...employee,
      name: editName,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
      department: editDepartment,
      designation: editDesignation,
      status: editStatus,
      role: editRole,
    };
    dataService.saveEmployee(updated);
    showToast('Profile Updated', `Executive changes to ${editName} have been recorded.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = () => {
    dataService.toggleEmployeeStatus(employee.employeeId);
    showToast('Status Updated', `${employee.name} is now ${employee.status === 'Active' ? 'Inactive' : 'Active'}.`, 'info');
  };

  const handleDeleteDoc = (docId: string, docName: string) => {
    if (confirm(`Remove document "${docName}" from personnel vault?`)) {
      dataService.deleteDocument(employee.employeeId, docId);
      showToast('Document Removed', `${docName} has been purged.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workforce Directory</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            icon={employee.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          >
            {employee.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            icon={<Edit3 className="w-4 h-4" />}
          >
            Edit All Personnel Records
          </Button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={employee.avatar}
            alt=""
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                {employee.name}
              </h1>
              <Badge variant={employee.status === 'Active' ? 'success' : 'neutral'}>
                {employee.status}
              </Badge>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {employee.role === 'ADMIN' ? 'HR Administrator' : 'Standard Employee'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {employee.designation} • <span className="text-indigo-600 dark:text-indigo-400">{employee.department}</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{employee.employeeId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {employee.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {employee.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto">
        {[
          { id: 'profile', label: 'Personal & Job Dossier', icon: Briefcase },
          { id: 'attendance', label: 'Attendance History', icon: Clock },
          { id: 'leave', label: 'Leave Entitlements', icon: Calendar },
          { id: 'salary', label: 'Compensation & Payroll', icon: DollarSign },
          { id: 'documents', label: 'Personnel Documents', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Job Details */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Personal Identification"
              subtitle="Full contact, residency, and emergency profile"
            />
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-slate-400">Employee ID</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{employee.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Full Legal Name</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-slate-400">Personal & Work Email</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.email}</p>
                </div>
                <div>
                  <p className="text-slate-400">Contact Number</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400">Physical Residential Address</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.address}</p>
              </div>

              {employee.emergencyContact && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400">Emergency Contact</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {employee.emergencyContact.name} ({employee.emergencyContact.relationship}) — {employee.emergencyContact.phone}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Corporate & Employment Details"
              subtitle="Enterprise placement, title, and seniority tier"
            />
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-slate-400">Assigned Department</p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{employee.department}</p>
                </div>
                <div>
                  <p className="text-slate-400">Job Title / Designation</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-slate-400">Official Joining Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.joiningDate}</p>
                </div>
                <div>
                  <p className="text-slate-400">Workstation Status</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400">Access Role</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{employee.role}</p>
                </div>
                <div>
                  <p className="text-slate-400">Contract Type</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">Full-Time Regular</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Attendance Summary */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Attendance Rate"
              value={`${attendancePercentage}%`}
              trend="up"
              icon={<ShieldCheck className="w-5 h-5 text-indigo-500" />}
            />
            <StatCard
              title="Present Days"
              value={presentCount}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            />
            <StatCard
              title="Leave Days"
              value={leaveCount}
              icon={<Calendar className="w-5 h-5 text-amber-500" />}
            />
            <StatCard
              title="Absent Days"
              value={absentCount}
              icon={<Clock className="w-5 h-5 text-rose-500" />}
            />
          </div>

          <Card>
            <CardHeader
              title="Recorded Attendance Logs"
              subtitle="Timestamps registered by this employee"
            />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Check-In</th>
                      <th className="px-6 py-3.5">Check-Out</th>
                      <th className="px-6 py-3.5">Working Hours</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attendance.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{a.date}</td>
                        <td className="px-6 py-3.5 text-slate-500">{a.checkIn || '—'}</td>
                        <td className="px-6 py-3.5 text-slate-500">{a.checkOut || '—'}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {a.workingHours > 0 ? `${a.workingHours} hrs` : '—'}
                        </td>
                        <td className="px-6 py-3.5">
                          <Badge variant={a.status === 'Present' ? 'success' : a.status === 'Leave' ? 'warning' : 'neutral'}>
                            {a.status}
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
      )}

      {/* Tab 3: Leave Entitlements */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Total Annual Quota"
              value={`${leaveStats.totalAllocated} Days`}
              icon={<Calendar className="w-5 h-5 text-indigo-500" />}
            />
            <StatCard
              title="Approved & Used"
              value={`${leaveStats.usedDays} Days`}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            />
            <StatCard
              title="Pending Approval"
              value={`${leaveStats.pendingDays} Days`}
              icon={<Clock className="w-5 h-5 text-amber-500" />}
            />
            <StatCard
              title="Remaining Balance"
              value={`${leaveStats.remainingDays} Days`}
              trend="up"
              icon={<ShieldCheck className="w-5 h-5 text-sky-500" />}
            />
          </div>

          <Card>
            <CardHeader
              title="Leave Applications & Records"
              subtitle="All historical leave submissions from this employee"
            />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Leave Type</th>
                      <th className="px-6 py-3.5">Date Range</th>
                      <th className="px-6 py-3.5">Duration</th>
                      <th className="px-6 py-3.5">Remarks</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaves.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">{l.leaveType}</td>
                        <td className="px-6 py-3.5 text-slate-500">{l.startDate} to {l.endDate}</td>
                        <td className="px-6 py-3.5 font-semibold text-indigo-600 dark:text-indigo-400">{l.days} day(s)</td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{l.remarks}</td>
                        <td className="px-6 py-3.5">
                          <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}>
                            {l.status}
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
      )}

      {/* Tab 4: Salary & Payroll Structure */}
      {activeTab === 'salary' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Salary Package Architecture"
              subtitle="Configured breakdown of gross and deductions"
            />
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 uppercase font-bold tracking-wider">Net Monthly Take-Home</p>
                  <h3 className="text-2xl font-extrabold text-indigo-950 dark:text-white mt-1">
                    ${employee.salaryStructure.netSalary.toLocaleString()}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 uppercase font-medium">Gross Annualized</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                    ${(employee.salaryStructure.grossSalary * 12).toLocaleString()} / yr
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Basic Base Salary</span>
                  <span className="font-bold text-slate-900 dark:text-white">${employee.salaryStructure.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+${employee.salaryStructure.allowances.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Transport & Commute Allowance</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+${employee.salaryStructure.allowances.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Special Executive Allowance</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+${employee.salaryStructure.allowances.special.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span className="text-slate-900 dark:text-white">Gross Salary</span>
                  <span className="text-slate-900 dark:text-white">${employee.salaryStructure.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-[11px] uppercase tracking-wider text-rose-500">Statutory Deductions</p>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Income Tax (TDS / PAYE)</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">-${employee.salaryStructure.deductions.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Provident Fund (Retirement)</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">-${employee.salaryStructure.deductions.providentFund.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader
              title="Payroll Quick Actions"
              subtitle="Recalibrate or jump to comprehensive payroll ledger"
            />
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 leading-relaxed">
                As an HR administrator, modifying base salary or allowances will immediately adjust future payslip calculations and issue an internal system notification to the employee.
              </div>

              <Link to="/admin/payroll" className="block">
                <Button variant="primary" size="md" className="w-full" icon={<DollarSign className="w-4 h-4" />}>
                  Open Company Payroll Desk
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader
            title="Archived Credentials & Documents"
            subtitle="Personnel documents uploaded by the employee or deposited by HR"
          />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Document Title</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">File Size</th>
                    <th className="px-6 py-3.5">Upload Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(employee.documents || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No documents currently stored in this employee's dossier.
                      </td>
                    </tr>
                  ) : (
                    employee.documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="px-6 py-4">{doc.type}</td>
                        <td className="px-6 py-4 text-slate-400">{doc.fileSize}</td>
                        <td className="px-6 py-4 text-slate-400">{doc.uploadedAt}</td>
                        <td className="px-6 py-4">
                          <Badge variant="success">{doc.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => showToast('Downloading File', `Retrieving ${doc.name}...`, 'info')}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc.id, doc.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      )}

      {/* Admin Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Personnel Record: ${employee.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              required
            />
            <Input
              label="Mailing Address"
              value={editAddress}
              onChange={e => setEditAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={editDepartment}
              onChange={e => setEditDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Design', label: 'Design' },
                { value: 'Product', label: 'Product' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Sales', label: 'Sales' },
              ]}
            />
            <Input
              label="Designation / Title"
              value={editDesignation}
              onChange={e => setEditDesignation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Employment Status"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value as EmploymentStatus)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Probation', label: 'Probation' },
              ]}
            />
            <Select
              label="System Privileges (Role)"
              value={editRole}
              onChange={e => setEditRole(e.target.value as UserRole)}
              options={[
                { value: 'EMPLOYEE', label: 'Standard Employee' },
                { value: 'ADMIN', label: 'HR Administrator' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Personnel Updates
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
