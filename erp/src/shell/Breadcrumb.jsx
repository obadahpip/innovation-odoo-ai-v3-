/**
 * Breadcrumb.jsx
 * Shows inside the ActionBar area as a path trail.
 * e.g.  CRM  ›  Leads  ›  REF0001
 */
import { useNavigate } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  const navigate = useNavigate()
  if (!items.length) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: 'var(--text3)', fontSize: 11 }}>›</span>}
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path)}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--teal)', cursor: 'pointer',
                  fontSize: 13, fontFamily: 'inherit', padding: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {item.label}
              </button>
            ) : (
              <span style={{ color: isLast ? 'var(--text)' : 'var(--text2)', fontWeight: isLast ? 600 : 400 }}>
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
