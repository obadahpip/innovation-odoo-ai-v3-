/**
 * SupplyChainShell.jsx
 * Shared sidebar wrapper for Inventory, Purchase, Manufacturing.
 * Each module passes its own sidebarItems.
 */
import { useNavigate, useLocation } from 'react-router-dom'

export default function SupplyChainShell({ children, sidebarSections }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Sidebar */}
      <div style={{
        width: 210, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
      }}>
        {sidebarSections.map(section => (
          <div key={section.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{
              padding: '4px 14px 2px',
              fontSize: 10, fontWeight: 700,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/')
              return (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    width: '100%', padding: '7px 14px',
                    background: active ? 'var(--surface3)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                    textAlign: 'left', fontSize: 13,
                    color: active ? 'var(--teal)' : 'var(--text2)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all var(--t)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}
