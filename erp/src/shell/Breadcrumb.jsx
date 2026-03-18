import { useNavigate, useLocation } from 'react-router-dom';
import { MODULE_MAP } from '../data/moduleConfig';

/**
 * Breadcrumb.jsx
 * Shows path like: Home > CRM > Pipeline
 * Reads from React Router location + optional crumbs prop for deep pages.
 *
 * Usage:
 *   <Breadcrumb />                        ← auto from URL
 *   <Breadcrumb crumbs={[{label, route}]} /> ← explicit override
 */
export default function Breadcrumb({ crumbs }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Auto-build crumbs from URL ──────────────────────────────
  const parts = location.pathname.split('/').filter(Boolean); // ['erp','crm','leads']

  const URL_TO_MODULE = {
    'crm': 'crm', 'sales': 'sales', 'contacts': 'contacts',
    'invoicing': 'invoicing', 'employees': 'employees', 'project': 'project',
    'settings': 'settings', 'inventory': 'inventory', 'time-off': 'leave_requests',
    'payroll': 'payroll', 'recruitment': 'recruitment', 'website': 'website_builder',
    'manufacturing': 'manufacturing', 'purchase': 'purchase', 'helpdesk': 'helpdesk',
    'email-marketing': 'email_marketing', 'discuss': 'discuss', 'calendar': 'calendar',
    'expenses': 'expenses', 'fleet': 'fleet', 'events': 'events',
    'maintenance': 'maintenance', 'planning': 'planning', 'surveys': 'surveys',
    'rental': 'rental', 'appointments': 'appointments', 'data-cleaning': 'data_cleaning',
    'attendances': 'attendances', 'pos': 'point_of_sale', 'subscriptions': 'subscriptions',
  };

  function segmentLabel(seg) {
    const modId = URL_TO_MODULE[seg];
    if (modId && MODULE_MAP[modId]) return MODULE_MAP[modId].label;
    return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  const autoCrumbs = crumbs || (() => {
    const result = [{ label: 'Home', route: '/erp/home' }];
    if (parts.length < 2) return result;
    // parts[0] = 'erp', parts[1] = module, parts[2+] = sub-pages
    const moduleSeg = parts[1];
    if (moduleSeg && moduleSeg !== 'home') {
      result.push({ label: segmentLabel(moduleSeg), route: `/${parts.slice(0, 2).join('/')}` });
    }
    for (let i = 2; i < parts.length; i++) {
      result.push({
        label: segmentLabel(parts[i]),
        route: '/' + parts.slice(0, i + 1).join('/'),
      });
    }
    return result;
  })();

  if (autoCrumbs.length <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 16px',
      background: 'var(--erp-sidebar)',
      borderBottom: '1px solid var(--erp-border)',
      fontSize: 12,
      color: 'var(--erp-text-muted)',
      flexShrink: 0,
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    }}>
      {autoCrumbs.map((crumb, i) => {
        const isLast = i === autoCrumbs.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4 }}>
                <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {isLast ? (
              <span style={{ color: 'var(--erp-text)', fontWeight: 500 }}>{crumb.label}</span>
            ) : (
              <button
                onClick={() => navigate(crumb.route)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--erp-teal)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: 0,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
