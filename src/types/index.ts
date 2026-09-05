export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar?: string;
  emailVerified?: boolean;
  createdAt: string;
}

export interface SalaryStructure {
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    special: number;
    medical?: number;
  };
  deductions: {
    tax: number;
    providentFund: number;
    insurance?: number;
  };
  grossSalary: number;
  netSalary: number;
}

export type EmploymentStatus = 'Active' | 'Inactive' | 'On Leave' | 'Probation';

export interface DocumentItem {
  id: string;
  employeeId: string;
  name: string;
  type: 'Resume' | 'ID Document' | 'Joining Letter' | 'Tax Form' | 'Contract' | 'Other';
  fileUrl?: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmploymentStatus;
  role: UserRole;
  salaryStructure: SalaryStructure;
  documents: DocumentItem[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // HH:mm:ss or ISO
  checkOut: string | null; // HH:mm:ss or ISO
  workingHours: number; // e.g. 8.5
  status: AttendanceStatus;
  notes?: string;
}

export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  remarks: string;
  status: LeaveStatus;
  adminComment?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface LeaveQuota {
  paidLeaveTotal: number;
  paidLeaveUsed: number;
  sickLeaveTotal: number;
  sickLeaveUsed: number;
  unpaidLeaveUsed: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string; // e.g., "September 2026"
  monthKey: string; // e.g., "2026-09"
  basicSalary: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
  bankAccountMasked?: string;
}

export type NotificationType = 'leave' | 'attendance' | 'payroll' | 'system' | 'employee';

export interface AppNotification {
  id: string;
  userId: string; // or 'ALL'
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  leaveNotifications: boolean;
  payrollNotifications: boolean;
  attendanceNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}
