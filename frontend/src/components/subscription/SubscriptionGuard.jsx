import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../../api/subscription';

/**
 * SubscriptionGuard
 * Wrap any route that requires an active subscription.
 *
 * Usage in App.jsx:
 *   <Route path="/courses" element={
 *     <SubscriptionGuard><CoursesPage /></SubscriptionGuard>
 *   } />
 *
 * Behaviour:
 *   - While checking → shows a subtle loading overlay
 *   - has_active_access = true  → renders children normally
 *   - has_active_access = false → redirects to /payment
 */
export default function SubscriptionGuard({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'allowed' | 'blocked'

  useEffect(() => {
    getSubscriptionStatus()
      .then(r => {
        setStatus(r.data.has_active_access ? 'allowed' : 'blocked');
      })
      .catch(() => {
        // If the check fails (e.g. not logged in), block and let the auth guard handle it
        setStatus('blocked');
      });
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f7ff', zIndex: 9999,
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (status === 'blocked') {
    return <Navigate to="/payment" replace />;
  }

  return children;
}
