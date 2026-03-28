import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public
import LandingPage from './pages/LandingPage';

// Auth
import RegisterPage      from './pages/auth/RegisterPage';
import LoginPage         from './pages/auth/LoginPage';
import VerifyOtpPage     from './pages/auth/VerifyOtpPage';
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

// Task 2 — Payment & Subscription
import PaymentPage       from './pages/payment/PaymentPage';
import SubscriptionGuard from './components/subscription/SubscriptionGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>

        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/verify-otp"      element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Payment (protected by login, not by subscription) ───────────── */}
        <Route path="/payment" element={
          <ProtectedRoute><PaymentPage /></ProtectedRoute>
        } />

        {/* ── Onboarding (no subscription check — new users need this) ────── */}
        <Route path="/welcome" element={
          <ProtectedRoute><ErrorBoundary><WelcomePage /></ErrorBoundary></ProtectedRoute>
        } />

        {/* ── Profile (no subscription check — users need access to manage
                       their account even when expired) ─────────────────────── */}
        <Route path="/profile" element={
          <ProtectedRoute><ErrorBoundary><ProfilePage /></ErrorBoundary></ProtectedRoute>
        } />

        {/* ── Subscription-gated content ──────────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <ErrorBoundary><DashboardPage /></ErrorBoundary>
            </SubscriptionGuard>
          </ProtectedRoute>
        } />
        <Route path="/course/:fileId" element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <ErrorBoundary><CoursePage /></ErrorBoundary>
            </SubscriptionGuard>
          </ProtectedRoute>
        } />
        <Route path="/plan" element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <ErrorBoundary><PlanPage /></ErrorBoundary>
            </SubscriptionGuard>
          </ProtectedRoute>
        } />
        <Route path="/certificate" element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <ErrorBoundary><CertificatePage /></ErrorBoundary>
            </SubscriptionGuard>
          </ProtectedRoute>
        } />

        {/* ── Errors ─────────────────────────────────────────────────────── */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*"    element={<NotFound />} />

      </Routes>

      <GlobalAIChat />
    </BrowserRouter>
  );
}