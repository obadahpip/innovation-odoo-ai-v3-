/**
 * ProtectedRoute.jsx — fixed
 *
 * Problem: Zustand persist hydrates asynchronously. On client-side navigation
 * the first render sees isAuthenticated=false → redirects to /login → blank page.
 * Refresh works because the full page load gives persist time to hydrate.
 *
 * Fix: Check localStorage directly for the access token as an immediate fallback.
 * If a token exists in localStorage, don't redirect even if Zustand hasn't
 * hydrated yet. The axios interceptor handles token refresh if it's expired.
 */
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Zustand persist may not have hydrated yet on first client-side render.
  // Fall back to checking localStorage directly — fast, synchronous.
  const hasToken = !!localStorage.getItem('access_token');

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}