/**
 * WebsiteShell.jsx
 * Shared sidebar + content wrapper for all website sub-modules.
 * Used by: WebsitePage, EcommercePage, LiveChatPage, ElearningPage,
 *          ForumPage, BlogPage, StudioPage
 */
import { useNavigate, useLocation } from 'react-router-dom'

const SIDEBAR_ITEMS = [
  { label: 'WEBSITE', items: [
    { label: 'Website',        path: '/erp/website',              icon: '🌐' },
    { label: 'Pages',          path: '/erp/website/pages',        icon: '📄' },
  ]},
  { label: 'ECOMMERCE', items: [
    { label: 'Products',       path: '/erp/ecommerce',            icon: '🛒' },
    { label: 'Orders',         path: '/erp/ecommerce/orders',     icon: '📦' },
  ]},
  { label: 'PUBLISH', items: [
    { label: 'Blog Posts',     path: '/erp/blog',                 icon: '📝' },
    { label: 'eLearning',      path: '/erp/elearning',            icon: '🎓' },
    { label: 'Forum',          path: '/erp/forum',                icon: '💬' },
  ]},
  { label: 'LIVE CHAT', items: [
    { label: 'Live Chat',      path: '/erp/livechat',             icon: '💬' },
  ]},
  { label: 'STUDIO', items: [
    { label: 'Studio',         path: '/erp/studio',               icon: '⚙' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Settings',       path: '/erp/website/config',       icon: '⚙' },
    { label: 'Themes',         path: '/erp/website/themes',       icon: '🎨' },
  ]},
]

export default function WebsiteShell({ children, title }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Sidebar */}
      <div style={{
        width: 200, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
      }}>
        {SIDEBAR_ITEMS.map(section => (
          <div key={section.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
