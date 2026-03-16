import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages — unchanged from V1
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// V2 pages
import DashboardPage from './pages/dashboard/DashboardPage';
import CoursePage from './pages/course/CoursePage';
import PlanPage from './pages/plan/PlanPage';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

// Global AI chat toggle (visible on all pages except /course)
import GlobalAIChat from './components/common/GlobalAIChat';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Public */}
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/verify-otp"      element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/course/:fileId"  element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/plan"            element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />

        {/* Default */}
        <Route path="/"   element={<Navigate to="/login" replace />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>

      {/* Floating AI toggle — hides itself on /course routes */}
      <GlobalAIChat />
    </BrowserRouter>
  );
}
