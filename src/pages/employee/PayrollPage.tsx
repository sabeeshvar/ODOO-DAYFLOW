import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { PayrollRecord, Employee } from '../../types';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  CreditCard,
  Sparkles,
  Lock
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [employee, setEmployee] = useState<Employee | undefined>();
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

  const refreshPayroll = () => {
    if (user) {
      const emp = dataService.getEmployeeById(user.employeeId);
      setEmployee(emp);
      const history = dataService.getEmployeePayroll(user.employeeId);
      setPayrollHistory(history);
      if (history.length > 0) {
        setSelectedSlip(history[0]);
      }
    }
  };

  useEffect(() => {
    refreshPayroll();
    const unsub = dataService.subscribe(refreshPayroll);
    return unsub;
  }, [user]);

  const salary = employee?.salaryStructure;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Payslip Downloaded', `Generated official PDF payslip for ${selectedSlip?.month}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              My Payroll & Compensation
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Read Only</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official compensation structure, monthly disbursements, and itemized salary slips.
          </p>
        </div>

        {selectedSlip && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePrint()}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Current Payslip
          </Button>
        )}
      </div>

      {/* Salary Overview KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Basic Base Salary"
          value={`$${(salary?.basicSalary || 8500).toLocaleString()}`}
          subtitle="Fixed monthly base compensation"
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-slate-100 dark:bg-slate-800"
          iconColor="text-slate-700 dark:text-slate-300"
        />
        <StatCard
          title="Total Allowances"
          value={`+$${(
            (salary?.allowances.hra || 2550) +
            (salary?.allowances.transport || 500) +
            (salary?.allowances.special || 1200) +
            (salary?.allowances.medical || 350)
          ).toLocaleString()}`}
          subtitle="HRA, travel & performance allowances"
          icon={<CreditCard className="w-5 h-5" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Statutory Deductions"
          value={`-$${(
            (salary?.deductions.tax || 1850) +
            (salary?.deductions.providentFund || 1020) +
            (salary?.deductions.insurance || 300)
          ).toLocaleString()}`}
          subtitle="Income tax withholding, PF, insurance"
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Net Take-Home Pay"
          value={`$${(salary?.netSalary || 9930).toLocaleString()}`}
          subtitle="Direct deposit to registered bank account"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Itemized Structure Details & Payslip View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Itemized Components Breakdown */}
        <Card className="lg:col-span-1 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Compensation Package
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Contractually ratified salary specifications.
            </p>
          </div>

          {/* Earnings */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Earnings & Allowances</p>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Basic Pay</span>
              <span className="font-semibold text-slate-900 dark:text-white">${salary?.basicSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">House Rent Allowance (HRA)</span>
              <span className="font-semibold text-slate-900 dark:text-white">${salary?.allowances.hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Special Allowance</span>
              <span className="font-semibold text-slate-900 dark:text-white">${salary?.allowances.special.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Transport & Commute</span>
              <span className="font-semibold text-slate-900 dark:text-white">${salary?.allowances.transport.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="font-bold text-slate-900 dark:text-white">Gross Total Earnings</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">${salary?.grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Standard Deductions</p>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Income Tax (TDS)</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">-${salary?.deductions.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Provident Fund (PF)</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">-${salary?.deductions.providentFund.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-300">Health & Life Insurance</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">-${salary?.deductions.insurance?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="font-bold text-slate-900 dark:text-white">Total Deductions</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                -${((salary?.deductions.tax || 0) + (salary?.deductions.providentFund || 0) + (salary?.deductions.insurance || 0)).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
            <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 tracking-wide">
              Final Net Take-Home
            </p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              ${salary?.netSalary.toLocaleString()}
              <span className="text-xs font-normal text-emerald-700/80 dark:text-emerald-400/80 ml-1.5">/ month</span>
            </p>
          </div>
        </Card>

        {/* Right: Interactive Payslip Document Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Printable Payslip Card */}
          {selectedSlip && (
            <div className="printable-payslip bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md">
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                      DAYFLOW ENTERPRISE
                    </h2>
                    <p className="text-xs text-slate-400">Official Monthly Pay Advice / Salary Slip</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedSlip.month}</p>
                  <Badge variant="success" dot className="mt-1">
                    {selectedSlip.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Employee Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <p className="text-slate-400">Employee Name</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Employee ID</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee?.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Department</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee?.department}</p>
                </div>
                <div>
                  <p className="text-slate-400">Designation</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee?.designation}</p>
                </div>
              </div>

              {/* Table of Earnings & Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">Earnings</h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Basic Pay:</span>
                      <span className="font-semibold">${selectedSlip.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Allowances:</span>
                      <span className="font-semibold">${selectedSlip.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                      <span>Gross Salary:</span>
                      <span>${selectedSlip.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">Deductions</h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Tax & Social Security:</span>
                      <span className="font-semibold">-${selectedSlip.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions:</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-rose-600 dark:text-rose-400">
                      <span>Total Deductions:</span>
                      <span>-${selectedSlip.deductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">Net Amount Disbursed</p>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${selectedSlip.netSalary.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Account: {selectedSlip.bankAccountMasked || '•••• •••• •••• 4921'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    icon={<Printer className="w-4 h-4" />}
                  >
                    Print Slip
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Historical Salary Archive Table */}
          <Card>
            <CardHeader
              title="Disbursement History"
              subtitle="Archive of previous monthly salary statements"
            />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Month</th>
                      <th className="px-6 py-3.5">Gross</th>
                      <th className="px-6 py-3.5">Deductions</th>
                      <th className="px-6 py-3.5">Net Pay</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payrollHistory.map(slip => (
                      <tr
                        key={slip.id}
                        onClick={() => setSelectedSlip(slip)}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          selectedSlip?.id === slip.id ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          {slip.month}
                        </td>
                        <td className="px-6 py-4">${slip.grossSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 text-rose-500">-${slip.deductions.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                          ${slip.netSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success" size="sm" dot>
                            {slip.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedSlip(slip);
                              handlePrint();
                            }}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
