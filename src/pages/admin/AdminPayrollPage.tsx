import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { 
  DollarSign, 
  Download, 
  Printer, 
  Edit3, 
  Search, 
  FileText, 
  ShieldCheck,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import type { Employee, SalaryStructure } from '../../types';

export const AdminPayrollPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');

  // Edit Salary Structure Modal
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [basic, setBasic] = useState<number>(6000);
  const [hra, setHra] = useState<number>(1800);
  const [transport, setTransport] = useState<number>(400);
  const [special, setSpecial] = useState<number>(800);
  const [medical, setMedical] = useState<number>(200);
  const [tax, setTax] = useState<number>(1200);
  const [pf, setPf] = useState<number>(720);
  const [insurance, setInsurance] = useState<number>(180);

  // View Slip Modal
  const [viewingSlip, setViewingSlip] = useState<{ employee: Employee; month: string } | null>(null);

  const refreshData = () => {
    setEmployees(dataService.getEmployees());
  };

  useEffect(() => {
    refreshData();
    const unsub = dataService.subscribe(refreshData);
    return unsub;
  }, []);

  // Filtered employees
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computed summary metrics
  const totalGrossPayroll = employees.reduce((sum, e) => sum + (e.salaryStructure?.grossSalary || 0), 0);
  const totalNetPayroll = employees.reduce((sum, e) => sum + (e.salaryStructure?.netSalary || 0), 0);
  const totalDeductions = totalGrossPayroll - totalNetPayroll;
  const avgNetSalary = employees.length > 0 ? Math.round(totalNetPayroll / employees.length) : 0;

  // Live Auto-Calculation for Edit Modal
  const totalAllowances = Number(hra || 0) + Number(transport || 0) + Number(special || 0) + Number(medical || 0);
  const totalDeductionsCalculated = Number(tax || 0) + Number(pf || 0) + Number(insurance || 0);
  const computedGross = Number(basic || 0) + totalAllowances;
  const computedNet = computedGross - totalDeductionsCalculated;

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    const struct = emp.salaryStructure;
    setBasic(struct?.basicSalary || 6000);
    setHra(struct?.allowances?.hra || 1800);
    setTransport(struct?.allowances?.transport || 400);
    setSpecial(struct?.allowances?.special || 800);
    setMedical(struct?.allowances?.medical || 200);
    setTax(struct?.deductions?.tax || 1100);
    setPf(struct?.deductions?.providentFund || 720);
    setInsurance(struct?.deductions?.insurance || 180);
  };

  const handleSaveSalaryStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const newStructure: SalaryStructure = {
      basicSalary: Number(basic),
      allowances: {
        hra: Number(hra),
        transport: Number(transport),
        special: Number(special),
        medical: Number(medical),
      },
      deductions: {
        tax: Number(tax),
        providentFund: Number(pf),
        insurance: Number(insurance),
      },
      grossSalary: computedGross,
      netSalary: computedNet,
    };

    dataService.updateSalaryStructure(editingEmployee.employeeId, newStructure);
    showToast(
      'Salary Package Updated',
      `Updated compensation for ${editingEmployee.name}. Net: $${computedNet.toLocaleString()}/mo.`,
      'success'
    );
    setEditingEmployee(null);
    refreshData();
  };

  const handleExportCSV = () => {
    let csv = 'Employee ID,Full Name,Department,Basic,HRA,Transport,Special,Gross Salary,Tax,PF,Net Salary,Disbursement Month\n';
    employees.forEach(e => {
      const s = e.salaryStructure;
      csv += `${e.employeeId},"${e.name}",${e.department},${s.basicSalary},${s.allowances.hra},${s.allowances.transport},${s.allowances.special},${s.grossSalary},${s.deductions.tax},${s.deductions.providentFund},${s.netSalary},${selectedMonth}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Payroll_Register_${selectedMonth.replace(' ', '_')}.csv`;
    a.click();
    showToast('Payroll CSV Exported', 'Payroll ledger exported successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Enterprise Payroll & Compensation Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain employee compensation structures, calculate gross and net disbursements, and generate audit-ready payslips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export Payroll Ledger (CSV)
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Payroll"
          value={`$${totalNetPayroll.toLocaleString()}`}
          change={`${selectedMonth} Commitment`}
          trend="up"
          icon={<DollarSign className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Gross Organization Budget"
          value={`$${totalGrossPayroll.toLocaleString()}`}
          change="Pre-deduction salary pool"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Statutory Deductions"
          value={`$${totalDeductions.toLocaleString()}`}
          change="TDS, PF, and Medical Insurance"
          icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Average Net Compensation"
          value={`$${avgNetSalary.toLocaleString()}`}
          change="Across all departments"
          icon={<CreditCard className="w-5 h-5 text-sky-500" />}
        />
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee by name, ID, department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Payroll Cycle:</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none"
          >
            <option value="September 2026">September 2026 (Active)</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>
        </div>
      </div>

      {/* Payroll Register Table */}
      <Card>
        <CardHeader
          title={`Compensation Register — ${selectedMonth}`}
          subtitle="Real-time gross and take-home calculations across company headcount"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Basic Base</th>
                  <th className="px-6 py-3.5">Allowances</th>
                  <th className="px-6 py-3.5">Gross Salary</th>
                  <th className="px-6 py-3.5">Deductions</th>
                  <th className="px-6 py-3.5">Net Pay</th>
                  <th className="px-6 py-3.5">Disbursement Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map(emp => {
                  const s = emp.salaryStructure;
                  const totalAllow = s.allowances.hra + s.allowances.transport + s.allowances.special + (s.allowances.medical || 0);
                  const totalDeduct = s.deductions.tax + s.deductions.providentFund + (s.deductions.insurance || 0);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{emp.employeeId} • {emp.department}</p>
                      </td>

                      <td className="px-6 py-4 font-mono font-medium">
                        ${s.basicSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                        +${totalAllow.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        ${s.grossSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-mono text-rose-500 dark:text-rose-400 font-medium">
                        -${totalDeduct.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        ${s.netSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant="success">Paid / Processed</Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingSlip({ employee: emp, month: selectedMonth })}
                            icon={<FileText className="w-3.5 h-3.5" />}
                          >
                            Payslip
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenEdit(emp)}
                            icon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Recalibrate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Salary Package Modal with Live Calculation */}
      <Modal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title={`Recalibrate Compensation Package: ${editingEmployee?.name}`}
      >
        <form onSubmit={handleSaveSalaryStructure} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Employee ID: <span className="font-mono font-bold text-slate-900 dark:text-white">{editingEmployee?.employeeId}</span> •{' '}
            Department: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{editingEmployee?.department}</span>
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Base Salary</h4>
            <Input
              label="Basic Monthly Salary ($)"
              type="number"
              value={basic}
              onChange={e => setBasic(Number(e.target.value))}
              required
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Allowances (Earnings)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="House Rent Allowance (HRA)"
                type="number"
                value={hra}
                onChange={e => setHra(Number(e.target.value))}
                required
              />
              <Input
                label="Transport & Commute Allowance"
                type="number"
                value={transport}
                onChange={e => setTransport(Number(e.target.value))}
                required
              />
              <Input
                label="Special Executive Allowance"
                type="number"
                value={special}
                onChange={e => setSpecial(Number(e.target.value))}
                required
              />
              <Input
                label="Medical & Health Allowance"
                type="number"
                value={medical}
                onChange={e => setMedical(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Statutory Deductions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Income Tax / TDS"
                type="number"
                value={tax}
                onChange={e => setTax(Number(e.target.value))}
                required
              />
              <Input
                label="Provident Fund (PF)"
                type="number"
                value={pf}
                onChange={e => setPf(Number(e.target.value))}
                required
              />
              <Input
                label="Health Insurance"
                type="number"
                value={insurance}
                onChange={e => setInsurance(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Real-Time Live Calculation Display */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Gross Salary (Basic + Allowances):</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">${computedGross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Total Statutory Deductions:</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">-${totalDeductionsCalculated.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800 flex justify-between text-sm font-extrabold text-indigo-950 dark:text-white">
              <span>Net Take-Home Salary:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">${computedNet.toLocaleString()} / mo</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingEmployee(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Confirm & Save Package
            </Button>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Print / Preview Modal */}
      <Modal
        isOpen={!!viewingSlip}
        onClose={() => setViewingSlip(null)}
        title={`Official Payslip — ${viewingSlip?.employee.name}`}
      >
        {viewingSlip && (
          <div className="space-y-6 printable-payslip">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  DF
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">DAYFLOW HRMS</h4>
                  <p className="text-[10px] text-slate-400">Enterprise Payroll Statement</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{viewingSlip.month}</p>
                <p className="text-[10px] text-slate-400">Issued: {new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            {/* Employee Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl">
              <div>
                <p className="text-slate-400">Employee Name</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewingSlip.employee.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Employee ID</p>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{viewingSlip.employee.employeeId}</p>
              </div>
              <div>
                <p className="text-slate-400">Designation</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingSlip.employee.designation}</p>
              </div>
              <div>
                <p className="text-slate-400">Department</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{viewingSlip.employee.department}</p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] pb-1 border-b border-slate-200 dark:border-slate-800">
                  Earnings
                </h5>
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Salary</span>
                  <span className="font-mono">${viewingSlip.employee.salaryStructure.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">House Rent (HRA)</span>
                  <span className="font-mono">${viewingSlip.employee.salaryStructure.allowances.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transport Allowance</span>
                  <span className="font-mono">${viewingSlip.employee.salaryStructure.allowances.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Special Allowance</span>
                  <span className="font-mono">${viewingSlip.employee.salaryStructure.allowances.special.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <span>Gross Earnings</span>
                  <span className="font-mono">${viewingSlip.employee.salaryStructure.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] pb-1 border-b border-slate-200 dark:border-slate-800">
                  Deductions
                </h5>
                <div className="flex justify-between">
                  <span className="text-slate-500">Income Tax (TDS)</span>
                  <span className="font-mono text-rose-500">-${viewingSlip.employee.salaryStructure.deductions.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provident Fund (PF)</span>
                  <span className="font-mono text-rose-500">-${viewingSlip.employee.salaryStructure.deductions.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Medical Insurance</span>
                  <span className="font-mono text-rose-500">-${(viewingSlip.employee.salaryStructure.deductions.insurance || 180).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-6 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-500">
                    -${(viewingSlip.employee.salaryStructure.grossSalary - viewingSlip.employee.salaryStructure.netSalary).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Salary Summary */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">Net Take-Home Pay</p>
                <h3 className="text-2xl font-black text-indigo-950 dark:text-white mt-0.5">
                  ${viewingSlip.employee.salaryStructure.netSalary.toLocaleString()}
                </h3>
              </div>
              <Badge variant="success">Electronic Transfer Confirmed</Badge>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingSlip(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print Official Slip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
