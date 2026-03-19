import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import SimulatePage from './pages/simulate/SimulatePage';


// Public
import LandingPage from './pages/LandingPage';

// Auth
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Onboarding
import WelcomePage from './pages/onboarding/WelcomePage';

// App pages
import DashboardPage   from './pages/dashboard/DashboardPage';
import CoursePage      from './pages/course/CoursePage';
import PlanPage        from './pages/plan/PlanPage';
import CertificatePage from './pages/certificate/CertificatePage';
import ProfilePage     from './pages/profile/ProfilePage';
import NotFound        from './pages/NotFound';
import ServerError     from './pages/ServerError';

// Global AI chat
import GlobalAIChat from './components/common/GlobalAIChat';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Public */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/verify-otp"      element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding */}
        <Route path="/welcome" element={
          <ProtectedRoute><ErrorBoundary><WelcomePage /></ErrorBoundary></ProtectedRoute>
        } />

        {/* Protected app */}
        <Route path="/dashboard" element={
          <ProtectedRoute><ErrorBoundary><DashboardPage /></ErrorBoundary></ProtectedRoute>
        } />
        <Route path="/course/:fileId" element={
          <ProtectedRoute><ErrorBoundary><CoursePage /></ErrorBoundary></ProtectedRoute>
        } />
        <Route path="/plan" element={
          <ProtectedRoute><ErrorBoundary><PlanPage /></ErrorBoundary></ProtectedRoute>
        } />
        <Route path="/certificate" element={
          <ProtectedRoute><ErrorBoundary><CertificatePage /></ErrorBoundary></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ErrorBoundary><ProfilePage /></ErrorBoundary></ProtectedRoute>
        } />
        <Route path="/simulate/:fileId" element={
          <ProtectedRoute><ErrorBoundary><SimulatePage /></ErrorBoundary></ProtectedRoute>} />

        {/* Errors */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*"    element={<NotFound />} />

      </Routes>

      <GlobalAIChat />
    </BrowserRouter>
  );
}
