import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  UserCheck, 
  UserX, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Mail,
  Phone
} from 'lucide-react';
import type { Employee, EmploymentStatus, UserRole } from '../../types';

export const EmployeeManagementPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate' | 'department'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add / Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Status Confirmation Dialog
  const [confirmStatusEmployee, setConfirmStatusEmployee] = useState<Employee | null>(null);

  // Form State
  const [formEmpId, setFormEmpId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDepartment, setFormDepartment] = useState('Engineering');
  const [formDesignation, setFormDesignation] = useState('Senior Specialist');
  const [formRole, setFormRole] = useState<UserRole>('EMPLOYEE');
  const [formStatus, setFormStatus] = useState<EmploymentStatus>('Active');
  const [formBasicSalary, setFormBasicSalary] = useState(6500);

  const refreshEmployees = () => {
    setEmployees(dataService.getEmployees());
  };

  useEffect(() => {
    refreshEmployees();
    const unsub = dataService.subscribe(refreshEmployees);
    return unsub;
  }, []);

  // Filter & Sort Logic
  const filtered = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
    if (sortBy === 'joiningDate') comparison = a.joiningDate.localeCompare(b.joiningDate);
    if (sortBy === 'department') comparison = a.department.localeCompare(b.department);
    return sortAsc ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedEmployees = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    const nextIdNum = 1000 + employees.length + 1;
    setFormEmpId(`DF-${nextIdNum}`);
    setFormName('');
    setFormEmail('');
    setFormPhone('+1 (555) 432-8765');
    setFormDepartment('Engineering');
    setFormDesignation('Software Engineer');
    setFormRole('EMPLOYEE');
    setFormStatus('Active');
    setFormBasicSalary(7000);
    setEditingEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormEmpId(emp.employeeId);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormPhone(emp.phone);
    setFormDepartment(emp.department);
    setFormDesignation(emp.designation);
    setFormRole(emp.role);
    setFormStatus(emp.status);
    setFormBasicSalary(emp.salaryStructure?.basicSalary || 6500);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim()) {
      showToast('Missing Fields', 'Please complete employee name and email.', 'error');
      return;
    }

    const basic = Number(formBasicSalary) || 5000;
    const hra = Math.round(basic * 0.3);
    const transport = 400;
    const special = Math.round(basic * 0.15);
    const tax = Math.round(basic * 0.18);
    const pf = Math.round(basic * 0.12);
    const gross = basic + hra + transport + special;
    const net = gross - (tax + pf);

    if (editingEmployee) {
      const updated: Employee = {
        ...editingEmployee,
        name: formName,
        email: formEmail,
        phone: formPhone,
        department: formDepartment,
        designation: formDesignation,
        role: formRole,
        status: formStatus,
        salaryStructure: {
          ...editingEmployee.salaryStructure,
          basicSalary: basic,
          allowances: {
            ...editingEmployee.salaryStructure?.allowances,
            hra,
            transport,
            special
          },
          deductions: {
            ...editingEmployee.salaryStructure?.deductions,
            tax,
            providentFund: pf
          },
          grossSalary: gross,
          netSalary: net
        }
      };
      dataService.saveEmployee(updated);
      showToast('Employee Updated', `Changes to ${formName} saved successfully.`, 'success');
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        employeeId: formEmpId.toUpperCase(),
        name: formName,
        email: formEmail.toLowerCase(),
        phone: formPhone,
        address: '742 Evergreen Terrace, San Francisco, CA',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formName)}`,
        department: formDepartment,
        designation: formDesignation,
        joiningDate: new Date().toISOString().split('T')[0],
        status: formStatus,
        role: formRole,
        salaryStructure: {
          basicSalary: basic,
          allowances: { hra, transport, special },
          deductions: { tax, providentFund: pf },
          grossSalary: gross,
          netSalary: net,
        },
        documents: []
      };
      dataService.saveEmployee(newEmp);
      showToast('Employee Registered', `${formName} (${formEmpId}) added to Dayflow workforce.`, 'success');
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = () => {
    if (!confirmStatusEmployee) return;
    dataService.toggleEmployeeStatus(confirmStatusEmployee.employeeId);
    showToast(
      'Status Changed',
      `${confirmStatusEmployee.name} is now marked ${confirmStatusEmployee.status === 'Active' ? 'Inactive' : 'Active'}.`,
      'info'
    );
    setConfirmStatusEmployee(null);
  };

  const departments = ['All', 'Engineering', 'Human Resources', 'Design', 'Product', 'Marketing', 'Finance', 'Sales'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Employee Directory & Workforce Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain employee profiles, access credentials, compensation packages, and active organizational states.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, designation..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
            <select
              value={departmentFilter}
              onChange={e => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs flex items-center gap-1"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortAsc ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {/* Employees Table Card */}
      <Card>
        <CardHeader
          title={`All Employees (${filtered.length})`}
          subtitle="Enterprise roster with full personnel records and credential management"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 cursor-pointer" onClick={() => setSortBy('name')}>
                    Employee ID & Name
                  </th>
                  <th className="px-6 py-3.5 cursor-pointer" onClick={() => setSortBy('department')}>
                    Department & Role
                  </th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5 cursor-pointer" onClick={() => setSortBy('joiningDate')}>
                    Joining Date
                  </th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No employees match your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                            <span className="font-mono text-[10px] text-slate-400">{emp.employeeId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.department}</p>
                        <p className="text-[11px] text-slate-400">{emp.designation}</p>
                      </td>

                      <td className="px-6 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{emp.phone}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {emp.joiningDate}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'neutral'}>
                          {emp.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/employees/${emp.employeeId}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setConfirmStatusEmployee(emp)}
                            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                              emp.status === 'Active' ? 'text-slate-400 hover:text-rose-600' : 'text-slate-400 hover:text-emerald-600'
                            }`}
                            title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                          >
                            {emp.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
              {Math.min(filtered.length, currentPage * itemsPerPage)} of {filtered.length} employees
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Prev
              </Button>
              <span className="font-semibold text-slate-900 dark:text-white px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Register New Employee'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              value={formEmpId}
              onChange={e => setFormEmpId(e.target.value)}
              disabled={!!editingEmployee}
              required
            />
            <Input
              label="Full Name"
              placeholder="e.g. Elena Rostova"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. elena@dayflow.demo"
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formPhone}
              onChange={e => setFormPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formDepartment}
              onChange={e => setFormDepartment(e.target.value)}
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
              label="Job Designation"
              placeholder="e.g. Senior Frontend Architect"
              value={formDesignation}
              onChange={e => setFormDesignation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="System Role"
              value={formRole}
              onChange={e => setFormRole(e.target.value as UserRole)}
              options={[
                { value: 'EMPLOYEE', label: 'Employee' },
                { value: 'ADMIN', label: 'HR Admin' },
              ]}
            />
            <Select
              label="Employment Status"
              value={formStatus}
              onChange={e => setFormStatus(e.target.value as EmploymentStatus)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Probation', label: 'Probation' },
              ]}
            />
            <Input
              label="Basic Monthly Salary ($)"
              type="number"
              value={formBasicSalary}
              onChange={e => setFormBasicSalary(Number(e.target.value))}
              required
            />
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300">
            Allowances (HRA, transport, special) and deductions (tax, PF) are automatically calculated and set up in the company payroll engine.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              {editingEmployee ? 'Save Changes' : 'Confirm Registration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Status Change */}
      <Modal
        isOpen={!!confirmStatusEmployee}
        onClose={() => setConfirmStatusEmployee(null)}
        title="Confirm Status Change"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Are you sure you want to {confirmStatusEmployee?.status === 'Active' ? 'deactivate' : 'activate'}{' '}
            <span className="font-bold text-slate-900 dark:text-white">{confirmStatusEmployee?.name}</span>?
          </p>
          <p className="text-[11px] text-slate-400">
            {confirmStatusEmployee?.status === 'Active'
              ? 'Deactivated accounts cannot log into the Dayflow platform or submit attendance stamps.'
              : 'Reactivating will restore full employee workspace access and check-in privileges.'}
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmStatusEmployee(null)}
            >
              Cancel
            </Button>
            <Button
              variant={confirmStatusEmployee?.status === 'Active' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleToggleStatus}
            >
              Confirm {confirmStatusEmployee?.status === 'Active' ? 'Deactivation' : 'Activation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
