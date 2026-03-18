import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MODULE_MAP, MODULES } from '../data/moduleConfig';

/**
 * ComingSoon.jsx
 * Graceful placeholder for modules that are not yet built.
 * Shows the module name, icon, build status, and a back button.
 * Receives moduleId as a prop (set in ERPApp router).
 */
export default function ComingSoon({ moduleId }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Try to resolve from prop, then from URL segment
  const resolvedId = moduleId || location.pathname.split('/')[2] || 'unknown';
  const mod = MODULE_MAP[resolvedId] || {
    label: resolvedId,
    icon: '📦',
    color: '#6c757d',
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--erp-bg)',
      minHeight: 0,
      padding: '2rem',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 420,
      }}>
        {/* Big icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: mod.color + '22',
          border: `2px solid ${mod.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          margin: '0 auto 20px',
        }}>
          {mod.icon}
        </div>

        {/* Title */}
        <h2 style={{
          color: 'var(--erp-text)',
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 8,
        }}>
          {mod.label}
        </h2>

        {/* Status message */}
        <p style={{
          color: 'var(--erp-text-muted)',
          fontSize: 14,
          marginBottom: 6,
          lineHeight: 1.6,
        }}>
          This module is being built in a future batch.
        </p>
        <p style={{
          color: 'var(--erp-text-muted)',
          fontSize: 13,
          marginBottom: 28,
        }}>
          All 28 ERP modules will be fully functional by Batch 7.
        </p>

        {/* Batch badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: mod.color + '18',
          border: `1px solid ${mod.color}44`,
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: 12,
          color: mod.color,
          fontWeight: 500,
          marginBottom: 28,
        }}>
          <span>⏳</span>
          <span>Scheduled for next batch</span>
        </div>

        {/* Back button */}
        <div>
          <button
            onClick={() => navigate('/erp/home')}
            style={{
              background: 'var(--erp-teal)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '9px 24px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
