import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, Employee } from '../types';
import { dataService } from '../services/dataService';

interface RegisterData {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  designation: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (targetRole: UserRole) => void;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateCurrentUserProfile: (updates: { phone?: string; address?: string; avatar?: string; name?: string }) => void;
}

const AUTH_STORAGE_KEY = 'dayflow_current_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        // Default to demo admin session on first boot for immediate exploration if desired,
        // or start null so user sees landing page. Let's start with null for standard auth flow.
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to parse auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string, _rememberMe: boolean = true): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate brief network delay
    await new Promise(res => setTimeout(res, 400));

    const cleanEmail = email.trim().toLowerCase();
    const employee = dataService.getEmployeeById(cleanEmail);

    if (!employee) {
      setIsLoading(false);
      return { success: false, message: 'Invalid credentials. No account matches this email or Employee ID.' };
    }

    if (employee.status === 'Inactive') {
      setIsLoading(false);
      return { success: false, message: 'Your account is deactivated. Please contact your HR department.' };
    }

    const sessionUser: User = {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      designation: employee.designation,
      avatar: employee.avatar,
      emailVerified: true,
      createdAt: employee.joiningDate,
    };

    setUser(sessionUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = (targetRole: UserRole) => {
    const demoEmail = targetRole === 'ADMIN' ? 'admin@dayflow.demo' : 'employee@dayflow.demo';
    const employee = dataService.getEmployeeById(demoEmail);

    if (employee) {
      const sessionUser: User = {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
        avatar: employee.avatar,
        emailVerified: true,
        createdAt: employee.joiningDate,
      };
      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));

    // Check duplicate email or employeeId
    const existingEmp = dataService.getEmployees().find(
      e => e.email.toLowerCase() === data.email.toLowerCase() || e.employeeId.toUpperCase() === data.employeeId.toUpperCase()
    );

    if (existingEmp) {
      setIsLoading(false);
      return { success: false, message: 'An employee with this Email or Employee ID already exists.' };
    }

    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: data.employeeId.toUpperCase(),
      name: data.name,
      email: data.email.toLowerCase(),
      phone: '+1 (555) 000-0000',
      address: 'Dayflow HQ, Suite 100',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      department: data.department || 'General',
      designation: data.designation || 'Specialist',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      role: data.role,
      salaryStructure: {
        basicSalary: 6000,
        allowances: {
          hra: 1800,
          transport: 400,
          special: 800,
          medical: 200,
        },
        deductions: {
          tax: 1100,
          providentFund: 720,
          insurance: 180,
        },
        grossSalary: 9000,
        netSalary: 7000,
      },
      documents: []
    };

    dataService.saveEmployee(newEmployee);

    const sessionUser: User = {
      id: newEmployee.id,
      employeeId: newEmployee.employeeId,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      designation: newEmployee.designation,
      avatar: newEmployee.avatar,
      emailVerified: true,
      createdAt: newEmployee.joiningDate,
    };

    setUser(sessionUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateCurrentUserProfile = (updates: { phone?: string; address?: string; avatar?: string; name?: string }) => {
    if (!user) return;
    dataService.updateEmployeeProfile(user.employeeId, updates);
    const updatedUser = {
      ...user,
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.avatar ? { avatar: updates.avatar } : {}),
    };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'ADMIN';
  const isEmployee = role === 'EMPLOYEE';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isEmployee,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
