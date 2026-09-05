import type { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  PayrollRecord, 
  AppNotification, 
  DocumentItem,
  SalaryStructure
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_PAYROLL, 
  INITIAL_NOTIFICATIONS 
} from '../data/seedData';

const STORAGE_KEYS = {
  EMPLOYEES: 'dayflow_employees_v1',
  ATTENDANCE: 'dayflow_attendance_v1',
  LEAVE_REQUESTS: 'dayflow_leaves_v1',
  PAYROLL: 'dayflow_payroll_v1',
  NOTIFICATIONS: 'dayflow_notifications_v1',
  SETTINGS: 'dayflow_settings_v1',
};

class DataService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(INITIAL_LEAVE_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYROLL)) {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Reset to Default Seed Data ---
  public resetData() {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(INITIAL_LEAVE_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    this.notify();
  }

  // --- EMPLOYEES ---
  public getEmployees(): Employee[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return raw ? JSON.parse(raw) : INITIAL_EMPLOYEES;
  }

  public getEmployeeById(idOrEmpId: string): Employee | undefined {
    const list = this.getEmployees();
    return list.find(e => e.id === idOrEmpId || e.employeeId === idOrEmpId || e.email.toLowerCase() === idOrEmpId.toLowerCase());
  }

  public saveEmployee(emp: Employee): void {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.id === emp.id || e.employeeId === emp.employeeId);
    if (index >= 0) {
      list[index] = emp;
    } else {
      list.unshift(emp);
      this.createNotification({
        userId: 'DF-1001',
        title: 'New Employee Added',
        message: `${emp.name} (${emp.employeeId}) has joined ${emp.department} department.`,
        type: 'employee'
      });
    }
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
    this.notify();
  }

  public updateEmployeeProfile(employeeId: string, updates: { phone?: string; address?: string; avatar?: string }): boolean {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.employeeId === employeeId);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
      this.notify();
      return true;
    }
    return false;
  }

  public toggleEmployeeStatus(employeeId: string): void {
    const list = this.getEmployees();
    const index = list.findIndex(e => e.employeeId === employeeId);
    if (index >= 0) {
      list[index].status = list[index].status === 'Active' ? 'Inactive' : 'Active';
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
      this.notify();
    }
  }

  // --- ATTENDANCE ---
  public getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : INITIAL_ATTENDANCE;
  }

  public getEmployeeAttendance(employeeId: string): AttendanceRecord[] {
    return this.getAttendance().filter(a => a.employeeId === employeeId);
  }

  public getTodayAttendanceForEmployee(employeeId: string): AttendanceRecord | undefined {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.getAttendance().find(a => a.employeeId === employeeId && a.date === todayStr);
  }

  public checkIn(employeeId: string, employeeName: string): AttendanceRecord {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const list = this.getAttendance();
    const existingIndex = list.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

    let record: AttendanceRecord;
    if (existingIndex >= 0) {
      if (!list[existingIndex].checkIn) {
        list[existingIndex].checkIn = timeStr;
      }
      list[existingIndex].status = 'Present';
      record = list[existingIndex];
    } else {
      record = {
        id: `att-${Date.now()}`,
        employeeId,
        employeeName,
        date: todayStr,
        checkIn: timeStr,
        checkOut: null,
        workingHours: 0,
        status: 'Present',
        notes: 'Regular check-in'
      };
      list.unshift(record);
    }

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
    this.createNotification({
      userId: employeeId,
      title: 'Checked In Successfully',
      message: `You checked in today at ${record.checkIn}. Have a great workday!`,
      type: 'attendance'
    });
    this.notify();
    return record;
  }

  public checkOut(employeeId: string): AttendanceRecord | null {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const list = this.getAttendance();
    const existingIndex = list.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

    if (existingIndex >= 0 && list[existingIndex].checkIn) {
      const record = list[existingIndex];
      record.checkOut = timeStr;
      record.workingHours = 8.5; 
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
      this.createNotification({
        userId: employeeId,
        title: 'Checked Out Successfully',
        message: `You checked out today at ${timeStr}. Working hours recorded: ${record.workingHours} hrs.`,
        type: 'attendance'
      });
      this.notify();
      return record;
    }
    return null;
  }

  // --- LEAVE & TIME-OFF ---
  public getLeaveRequests(): LeaveRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
    return raw ? JSON.parse(raw) : INITIAL_LEAVE_REQUESTS;
  }

  public getEmployeeLeaveRequests(employeeId: string): LeaveRequest[] {
    return this.getLeaveRequests().filter(l => l.employeeId === employeeId);
  }

  public applyLeave(request: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt'>): LeaveRequest {
    const list = this.getLeaveRequests();
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRequest: LeaveRequest = {
      ...request,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedAt: dateStr,
    };

    list.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(list));

    // Notify Admin
    this.createNotification({
      userId: 'DF-1001',
      title: 'New Leave Request Requiring Approval',
      message: `${newRequest.employeeName} (${newRequest.department}) requested ${newRequest.days} day(s) ${newRequest.leaveType}.`,
      type: 'leave',
      link: '/admin/leave-approvals'
    });

    this.notify();
    return newRequest;
  }

  public reviewLeaveRequest(leaveId: string, status: 'Approved' | 'Rejected', adminComment: string, reviewerName: string = 'Alex Rivera'): boolean {
    const list = this.getLeaveRequests();
    const index = list.findIndex(l => l.id === leaveId);
    if (index >= 0) {
      const item = list[index];
      item.status = status;
      item.adminComment = adminComment;
      item.reviewedAt = new Date().toISOString();
      item.reviewedBy = reviewerName;

      localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(list));

      // Notify the employee
      this.createNotification({
        userId: item.employeeId,
        title: status === 'Approved' ? 'Leave Request Approved' : 'Leave Request Rejected',
        message: status === 'Approved' 
          ? `Your ${item.leaveType} for ${item.days} day(s) (${item.startDate} to ${item.endDate}) was approved.` 
          : `Your ${item.leaveType} request was rejected. Reason: ${adminComment}`,
        type: 'leave',
        link: '/employee/leave'
      });

      this.notify();
      return true;
    }
    return false;
  }

  public getLeaveStats(employeeId: string) {
    const leaves = this.getEmployeeLeaveRequests(employeeId);
    const approved = leaves.filter(l => l.status === 'Approved');
    const pending = leaves.filter(l => l.status === 'Pending');

    const totalAllocated = 24; // annual paid leaves
    const usedDays = approved.reduce((acc, l) => acc + l.days, 0);
    const pendingDays = pending.reduce((acc, l) => acc + l.days, 0);
    const remainingDays = Math.max(0, totalAllocated - usedDays);

    return {
      totalAllocated,
      usedDays,
      pendingDays,
      remainingDays,
      approvedRequestsCount: approved.length,
      pendingRequestsCount: pending.length,
    };
  }

  // --- PAYROLL ---
  public getPayroll(): PayrollRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYROLL);
    return raw ? JSON.parse(raw) : INITIAL_PAYROLL;
  }

  public getEmployeePayroll(employeeId: string): PayrollRecord[] {
    return this.getPayroll().filter(p => p.employeeId === employeeId);
  }

  public updateSalaryStructure(employeeId: string, structure: SalaryStructure): void {
    const employees = this.getEmployees();
    const empIndex = employees.findIndex(e => e.employeeId === employeeId);
    if (empIndex >= 0) {
      employees[empIndex].salaryStructure = structure;
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));

      // notify employee
      this.createNotification({
        userId: employeeId,
        title: 'Salary Details Updated',
        message: `Your revised salary package structure has been configured. Net salary: $${structure.netSalary.toLocaleString()}/mo.`,
        type: 'payroll',
        link: '/employee/payroll'
      });

      this.notify();
    }
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string, role: string): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    return list.filter(n => n.userId === userId || n.userId === 'ALL' || (role === 'ADMIN' && n.userId === 'DF-1001'));
  }

  public createNotification(notif: { userId: string; title: string; message: string; type: AppNotification['type']; link?: string }) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      createdAt: 'Just now',
      link: notif.link,
    };
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  public markNotificationAsRead(id: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    list.forEach(n => {
      if (n.userId === userId || n.userId === 'ALL' || (userId === 'DF-1001' && n.userId === 'DF-1001')) {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  // --- DOCUMENTS ---
  public addDocument(employeeId: string, doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'status' | 'employeeId'>): DocumentItem {
    const employees = this.getEmployees();
    const emp = employees.find(e => e.employeeId === employeeId);
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      employeeId,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
    };

    if (emp) {
      emp.documents = emp.documents || [];
      emp.documents.unshift(newDoc);
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      this.notify();
    }
    return newDoc;
  }

  public deleteDocument(employeeId: string, documentId: string): void {
    const employees = this.getEmployees();
    const emp = employees.find(e => e.employeeId === employeeId);
    if (emp && emp.documents) {
      emp.documents = emp.documents.filter(d => d.id !== documentId);
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      this.notify();
    }
  }
}

export const dataService = new DataService();
