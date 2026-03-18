/**
 * AppHome.jsx — App switcher home page
 * Matches real Odoo 19.0 home screen style exactly:
 * - No sidebar, no top nav menu bar
 * - Centered grid of app tiles
 * - Colorful gradient icons
 * - App name below each icon
 */
import { useNavigate } from 'react-router-dom'
import useAppStore from '@store/appStore.js'

// App tiles matching Odoo 19 style with gradient colors
const APPS = [
  // Row 1
  { id:'discuss',       name:'Discuss',         path:'/erp/discuss',            colors:['#f6a623','#e8490f'] },
  { id:'calendar',      name:'Calendar',        path:'/erp/calendar',           colors:['#21b799','#3db0ef'] },
  { id:'knowledge',     name:'Knowledge',       path:'/erp/knowledge',          colors:['#00a09d','#2d9fd8'] },
  { id:'contacts',      name:'Contacts',        path:'/erp/contacts',           colors:['#00a09d','#875a7b'] },
  { id:'crm',           name:'CRM',             path:'/erp/crm/pipeline',       colors:['#00a09d','#64c3d4'] },
  { id:'sales',         name:'Sales',           path:'/erp/sales/quotations',   colors:['#e8490f','#f6a623'] },
  // Row 2
  { id:'accounting',    name:'Accounting',      path:'/erp/accounting',         colors:['#e8490f','#875a7b'] },
  { id:'documents',     name:'Documents',       path:'/erp/documents',          colors:['#00a09d','#1b6ca8'] },
  { id:'inventory',     name:'Inventory',       path:'/erp/inventory/products', colors:['#f6a623','#e8490f'] },
  { id:'barcode',       name:'Barcode',         path:'/erp/barcode',            colors:['#313d53','#64748b'] },
  { id:'employees',     name:'Employees',       path:'/erp/employees',          colors:['#875a7b','#6c3483'] },
  { id:'project',       name:'Project',         path:'/erp/project',            colors:['#3db0ef','#00a09d'] },
  // Row 3
  { id:'payroll',       name:'Payroll',         path:'/erp/payroll',            colors:['#875a7b','#e8490f'] },
  { id:'timeoff',       name:'Time Off',        path:'/erp/time-off',           colors:['#f6a623','#3db0ef'] },
  { id:'todos',         name:'To-Do',           path:'/erp/todos',              colors:['#21b799','#f6a623'] },
  { id:'settings',      name:'Settings',        path:'/erp/settings',           colors:['#875a7b','#e8490f'] },
  // More apps
  { id:'purchase',      name:'Purchase',        path:'/erp/purchase/orders',    colors:['#3db0ef','#1b6ca8'] },
  { id:'manufacturing', name:'Manufacturing',   path:'/erp/manufacturing',      colors:['#313d53','#3db0ef'] },
  { id:'pos',           name:'Point of Sale',   path:'/erp/pos',                colors:['#f6a623','#64c3d4'] },
  { id:'helpdesk',      name:'Helpdesk',        path:'/erp/helpdesk',           colors:['#e8490f','#f6a623'] },
  { id:'ecommerce',     name:'eCommerce',       path:'/erp/ecommerce',          colors:['#21b799','#1b6ca8'] },
  { id:'website',       name:'Website',         path:'/erp/website',            colors:['#3db0ef','#21b799'] },
  { id:'email_mktg',    name:'Email Marketing', path:'/erp/email-marketing',    colors:['#e8490f','#313d53'] },
  { id:'expenses',      name:'Expenses',        path:'/erp/expenses',           colors:['#875a7b','#3db0ef'] },
  { id:'timesheets',    name:'Timesheets',       path:'/erp/timesheets',         colors:['#313d53','#21b799'] },
  { id:'recruitment',   name:'Recruitment',     path:'/erp/recruitment',        colors:['#875a7b','#f6a623'] },
]

// SVG icons for each app (simplified but colorful like Odoo)
const APP_ICONS = {
  discuss:      <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="19" r="13" fill="white" fillOpacity="0.9"/><path d="M14 16h12M14 20h8" stroke="#e8490f" strokeWidth="2.5" strokeLinecap="round"/><path d="M17 27l-5 4v-4" fill="white" fillOpacity="0.9"/></svg>,
  calendar:     <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="10" width="24" height="22" rx="3" fill="white" fillOpacity="0.9"/><path d="M8 16h24" stroke="#21b799" strokeWidth="2"/><rect x="14" y="7" width="3" height="6" rx="1.5" fill="white"/><rect x="23" y="7" width="3" height="6" rx="1.5" fill="white"/><rect x="13" y="21" width="4" height="4" rx="1" fill="#21b799"/><rect x="22" y="21" width="4" height="4" rx="1" fill="#21b799"/></svg>,
  knowledge:    <svg viewBox="0 0 40 40" fill="none"><path d="M12 8h16v24H12z" fill="white" fillOpacity="0.9" rx="2"/><path d="M16 15h8M16 19h8M16 23h5" stroke="#00a09d" strokeWidth="2" strokeLinecap="round"/></svg>,
  contacts:     <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="7" fill="white" fillOpacity="0.9"/><path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="white" strokeWidth="3" strokeOpacity="0.9" strokeLinecap="round"/></svg>,
  crm:          <svg viewBox="0 0 40 40" fill="none"><path d="M8 28l8-10 6 6 10-14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="32" cy="10" r="4" fill="white" fillOpacity="0.9"/></svg>,
  sales:        <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="14" width="24" height="18" rx="2" fill="white" fillOpacity="0.9"/><path d="M15 14v-3a5 5 0 0110 0v3" stroke="white" strokeWidth="2.5" strokeOpacity="0.9"/><circle cx="20" cy="23" r="3" fill="#e8490f"/></svg>,
  accounting:   <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="13" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2"/><path d="M20 13v14M14 17h12M14 23h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  documents:    <svg viewBox="0 0 40 40" fill="none"><path d="M12 8h12l8 8v16H12z" fill="white" fillOpacity="0.9"/><path d="M24 8v8h8" fill="none" stroke="white" strokeWidth="1.5"/><path d="M17 22h6M17 26h6" stroke="#00a09d" strokeWidth="2" strokeLinecap="round"/></svg>,
  inventory:    <svg viewBox="0 0 40 40" fill="none"><rect x="9" y="14" width="22" height="16" rx="2" fill="white" fillOpacity="0.9"/><path d="M14 14v-3h12v3" stroke="white" strokeWidth="2" strokeOpacity="0.9"/><path d="M15 22h10M20 19v6" stroke="#f6a623" strokeWidth="2" strokeLinecap="round"/></svg>,
  barcode:      <svg viewBox="0 0 40 40" fill="none"><rect x="9" y="11" width="3" height="18" fill="white" fillOpacity="0.9"/><rect x="14" y="11" width="2" height="18" fill="white" fillOpacity="0.9"/><rect x="18" y="11" width="4" height="18" fill="white" fillOpacity="0.9"/><rect x="24" y="11" width="2" height="18" fill="white" fillOpacity="0.9"/><rect x="28" y="11" width="3" height="18" fill="white" fillOpacity="0.9"/></svg>,
  employees:    <svg viewBox="0 0 40 40" fill="none"><circle cx="15" cy="15" r="5" fill="white" fillOpacity="0.9"/><circle cx="27" cy="15" r="5" fill="white" fillOpacity="0.6"/><path d="M5 32c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round"/><path d="M25 22c3.866 0 7 3.134 7 7" stroke="white" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round"/></svg>,
  project:      <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="8" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/><rect x="22" y="8" width="10" height="10" rx="2" fill="white" fillOpacity="0.7"/><rect x="8" y="22" width="10" height="10" rx="2" fill="white" fillOpacity="0.7"/><rect x="22" y="22" width="10" height="10" rx="2" fill="white" fillOpacity="0.5"/></svg>,
  payroll:      <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="12" width="24" height="16" rx="2" fill="white" fillOpacity="0.9"/><circle cx="20" cy="20" r="4" fill="#875a7b"/><path d="M10 17h4M26 17h4M10 23h4M26 23h4" stroke="#875a7b" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  timeoff:      <svg viewBox="0 0 40 40" fill="none"><path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8z" fill="white" fillOpacity="0.9"/><path d="M20 14v7l5 3" stroke="#f6a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  todos:        <svg viewBox="0 0 40 40" fill="none"><rect x="9" y="8" width="22" height="24" rx="2" fill="white" fillOpacity="0.9"/><path d="M14 16l3 3 6-6" stroke="#21b799" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 24h12" stroke="#21b799" strokeWidth="2" strokeLinecap="round"/></svg>,
  settings:     <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" fill="white" fillOpacity="0.9"/><path d="M20 8v4M20 28v4M8 20h4M28 20h4M11.5 11.5l2.8 2.8M25.7 25.7l2.8 2.8M11.5 28.5l2.8-2.8M25.7 14.3l2.8-2.8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  purchase:     <svg viewBox="0 0 40 40" fill="none"><path d="M10 10h4l4 14h10l3-10H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="18" cy="28" r="2" fill="white" fillOpacity="0.9"/><circle cx="28" cy="28" r="2" fill="white" fillOpacity="0.9"/></svg>,
  manufacturing:<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="22" width="24" height="10" rx="1" fill="white" fillOpacity="0.9"/><rect x="12" y="16" width="6" height="6" fill="white" fillOpacity="0.7"/><rect x="22" y="16" width="6" height="6" fill="white" fillOpacity="0.7"/><rect x="17" y="10" width="6" height="6" fill="white" fillOpacity="0.5"/></svg>,
  pos:          <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="10" width="24" height="16" rx="2" fill="white" fillOpacity="0.9"/><rect x="12" y="28" width="16" height="3" rx="1" fill="white" fillOpacity="0.7"/><rect x="12" y="14" width="6" height="4" rx="1" fill="#f6a623"/><rect x="22" y="14" width="6" height="4" rx="1" fill="#f6a623"/></svg>,
  helpdesk:     <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="18" r="10" fill="white" fillOpacity="0.9"/><path d="M17 15c0-1.657 1.343-3 3-3s3 1.343 3 3c0 2-3 3-3 5" stroke="#e8490f" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="24" r="1.5" fill="#e8490f"/><path d="M14 30l-4 5" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round"/></svg>,
  ecommerce:    <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" fill="white" fillOpacity="0.9"/><path d="M14 20c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6" stroke="#21b799" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 14v12" stroke="#21b799" strokeWidth="2" strokeLinecap="round"/></svg>,
  website:      <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="white" strokeWidth="2.5" fill="none" fillOpacity="0.9"/><path d="M8 20h24M20 8c-3 4-5 8-5 12s2 8 5 12M20 8c3 4 5 8 5 12s-2 8-5 12" stroke="white" strokeWidth="2" strokeOpacity="0.9"/></svg>,
  email_mktg:   <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="12" width="24" height="16" rx="2" fill="white" fillOpacity="0.9"/><path d="M8 14l12 9 12-9" stroke="#e8490f" strokeWidth="2" strokeLinecap="round"/></svg>,
  expenses:     <svg viewBox="0 0 40 40" fill="none"><rect x="10" y="8" width="20" height="24" rx="2" fill="white" fillOpacity="0.9"/><path d="M15 16h10M15 20h10M15 24h7" stroke="#875a7b" strokeWidth="2" strokeLinecap="round"/><path d="M10 12h20" stroke="#875a7b" strokeWidth="1.5"/></svg>,
  timesheets:   <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" fill="white" fillOpacity="0.9"/><path d="M20 13v8l5 3" stroke="#313d53" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  recruitment:  <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="6" fill="white" fillOpacity="0.9"/><path d="M10 32c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round"/><path d="M28 20l4 4-4 4" stroke="white" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="4" fill="white" fillOpacity="0.9"/>
    <path d="M14 20h12M20 14v12" stroke="#875a7b" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

export default function AppHome() {
  const navigate  = useNavigate()
  const devMode   = useAppStore(s => s.developerMode)
  const toggleDev = useAppStore(s => s.toggleDeveloperMode)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top-right icons only — matches Odoo 19 home (no app name, no menu) */}

      {/* App grid — centered exactly like Odoo 19 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 40,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 88px)',
          gap: '16px 8px',
          justifyContent: 'center',
        }}>
          {APPS.map(app => (
            <AppTile
              key={app.id}
              app={app}
              icon={APP_ICONS[app.id] || DEFAULT_ICON}
              onClick={() => navigate(app.path)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AppTile({ app, icon, onClick }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 88, padding: '10px 4px 8px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        background: hover ? 'var(--surface2)' : 'none',
        border: 'none', borderRadius: 8,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background 0.15s',
      }}
    >
      {/* Colorful gradient icon square */}
      <div style={{
        width: 56, height: 56, borderRadius: 12,
        background: `linear-gradient(135deg, ${app.colors[0]}, ${app.colors[1]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hover ? `0 4px 16px ${app.colors[0]}55` : 'none',
        transition: 'box-shadow 0.15s',
        flexShrink: 0,
      }}>
        <div style={{ width: 32, height: 32 }}>{icon}</div>
      </div>

      {/* App name */}
      <span style={{
        fontSize: 12, color: 'var(--text)', textAlign: 'center',
        lineHeight: 1.3, wordBreak: 'break-word',
      }}>
        {app.name}
      </span>
    </button>
  )
}

// Need useState import
import { useState } from 'react'

function NavIconBtn({ children, title, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', borderRadius:4, color:'var(--text2)', cursor:'pointer' }}
      onMouseEnter={e=>{e.currentTarget.style.background='var(--surface2)';e.currentTarget.style.color='var(--text)'}}
      onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text2)'}}>
      {children}
    </button>
  )
}
function AiIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 9h.01M9.5 15a5 5 0 005 0"/></svg> }
function ClockIcon(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> }
function ChatIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }