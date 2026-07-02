import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import LeadListPage from '../pages/leads/LeadListPage';
import LeadFormPage from '../pages/leads/LeadFormPage';
import LeadViewPage from '../pages/leads/LeadViewPage';
import CustomerListPage from '../pages/customers/CustomerListPage';
import CustomerViewPage from '../pages/customers/CustomerViewPage';
import CustomerEditPage from '../pages/customers/CustomerEditPage';
import FollowUpListPage from '../pages/followups/FollowUpListPage';
import FollowUpFormPage from '../pages/followups/FollowUpFormPage';
import FollowUpViewPage from '../pages/followups/FollowUpViewPage';
import TaskListPage from '../pages/tasks/TaskListPage';
import TaskFormPage from '../pages/tasks/TaskFormPage';
import TaskViewPage from '../pages/tasks/TaskViewPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes — redirect authenticated users to dashboard */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes — redirect unauthenticated users to login */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Lead Management Routes */}
        <Route path="/leads" element={<LeadListPage />} />
        <Route path="/leads/new" element={<LeadFormPage />} />
        <Route path="/leads/:id/edit" element={<LeadFormPage />} />
        <Route path="/leads/:id" element={<LeadViewPage />} />

        {/* Customer Management Routes */}
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/:id" element={<CustomerViewPage />} />
        <Route path="/customers/:id/edit" element={<CustomerEditPage />} />

        {/* Follow-up Management Routes */}
        <Route path="/followups" element={<FollowUpListPage />} />
        <Route path="/followups/new" element={<FollowUpFormPage />} />
        <Route path="/followups/:id/edit" element={<FollowUpFormPage />} />
        <Route path="/followups/:id" element={<FollowUpViewPage />} />

        {/* Task Management Routes */}
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
        <Route path="/tasks/:id" element={<TaskViewPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

