import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';

// Auth pages
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Onboarding
import WelcomePage from './pages/onboarding/WelcomePage';

// V2 pages
import DashboardPage from './pages/dashboard/DashboardPage';
import CoursePage from './pages/course/CoursePage';
import PlanPage from './pages/plan/PlanPage';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

// Global AI chat toggle (visible on all protected pages except /course)
import GlobalAIChat from './components/common/GlobalAIChat';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Public landing page — replaces the old redirect-to-login */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/verify-otp"      element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding (protected — shown once after registration) */}
        <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />

        {/* Protected app */}
        <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/course/:fileId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/plan"           element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />

        {/* Errors */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>

      {/* Floating AI toggle — hides itself on /course routes */}
      <GlobalAIChat />
    </BrowserRouter>
  );
}
