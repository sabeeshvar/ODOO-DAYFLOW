import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EmailVerificationPage } from './pages/auth/EmailVerificationPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { 
  PrivacyPolicyPage, 
  TermsOfServicePage, 
  SecurityPolicyPage 
} from './pages/legal/LegalPages';

// Employee Workspace Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { ProfilePage } from './pages/employee/ProfilePage';
import { AttendancePage } from './pages/employee/AttendancePage';
import { LeavePage } from './pages/employee/LeavePage';
import { PayrollPage } from './pages/employee/PayrollPage';
import { DocumentsPage } from './pages/employee/DocumentsPage';
import { ReportsPage } from './pages/employee/ReportsPage';

// Admin / HR Officer Workspace Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmployeeManagementPage } from './pages/admin/EmployeeManagementPage';
import { EmployeeDetailPage } from './pages/admin/EmployeeDetailPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { LeaveApprovalsPage } from './pages/admin/LeaveApprovalsPage';
import { AdminPayrollPage } from './pages/admin/AdminPayrollPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

// Common Workspace Pages
import { NotificationCenterPage } from './pages/common/NotificationCenterPage';
import { SettingsPage } from './pages/common/SettingsPage';

// System Pages
import { AccessDeniedPage } from './pages/system/AccessDeniedPage';
import { NotFoundPage } from './pages/system/NotFoundPage';
import { ErrorPage } from './pages/system/ErrorPage';

const DashboardRedirect: React.FC = () => {
  const { role, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Legal & Policy Pages */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/security" element={<SecurityPolicyPage />} />
              <Route path="/compliance" element={<SecurityPolicyPage />} />
              <Route path="/cookies" element={<PrivacyPolicyPage />} />
              <Route path="/accessibility" element={<PrivacyPolicyPage />} />

              {/* Intelligent Dashboard Redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Employee Protected Routes (Role: EMPLOYEE or ADMIN) */}
              <Route
                path="/employee"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/employee/dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="leave" element={<LeavePage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="notifications" element={<NotificationCenterPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Admin / HR Protected Routes (Strictly Role: ADMIN only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeManagementPage />} />
                <Route path="employees/:id" element={<EmployeeDetailPage />} />
                <Route path="attendance" element={<AdminAttendancePage />} />
                <Route path="leave" element={<LeaveApprovalsPage />} />
                <Route path="leave-approvals" element={<LeaveApprovalsPage />} />
                <Route path="payroll" element={<AdminPayrollPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="notifications" element={<NotificationCenterPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* System Routes */}
              <Route path="/403" element={<AccessDeniedPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
