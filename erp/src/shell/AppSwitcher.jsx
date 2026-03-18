import { useNavigate } from 'react-router-dom'

const APPS = [
  // Section 1 - Core
  { id:'settings',    icon:'⚙️',  label:'Settings',    path:'/erp/settings',     color:'#5a6268' },
  { id:'contacts',    icon:'👥',  label:'Contacts',    path:'/erp/contacts',     color:'#20c997' },
  { id:'users',       icon:'🔐',  label:'Users',       path:'/erp/users',        color:'#6f42c1' },
  // Section 2 - Sales
  { id:'crm',         icon:'📈',  label:'CRM',         path:'/erp/crm/pipeline', color:'#e5722e' },
  { id:'sales',       icon:'🛒',  label:'Sales',       path:'/erp/sales/quotations', color:'#f4a224' },
  // Section 3 - Finance
  { id:'accounting',  icon:'💰',  label:'Accounting',  path:'/erp/accounting',   color:'#00a09d' },
  // Section 4 - HR
  { id:'employees',   icon:'👤',  label:'Employees',   path:'/erp/employees',    color:'#875a7b' },
  { id:'timeoff',     icon:'🏖️',  label:'Time Off',    path:'/erp/timeoff',      color:'#3498db' },
  // Section 5 - Inventory
  { id:'inventory',   icon:'📦',  label:'Inventory',   path:'/erp/inventory',    color:'#00b5b5' },
  // Section 6 - Project
  { id:'project',     icon:'✅',  label:'Project',     path:'/erp/project',      color:'#7c7bad' },
  // Future modules
  { id:'purchase',    icon:'🛍️',  label:'Purchase',    path:'/erp/purchase',     color:'#f0ad4e' },
  { id:'manufacturing',icon:'🏭', label:'Manufacturing',path:'/erp/manufacturing',color:'#e74c3c' },
  { id:'helpdesk',    icon:'🎧',  label:'Helpdesk',    path:'/erp/helpdesk',     color:'#2ecc71' },
  { id:'calendar',    icon:'📅',  label:'Calendar',    path:'/erp/calendar',     color:'#3498db' },
  { id:'documents',   icon:'📄',  label:'Documents',   path:'/erp/documents',    color:'#1abc9c' },
  { id:'timesheets',  icon:'⏱️',  label:'Timesheets',  path:'/erp/timesheets',   color:'#8e44ad' },
  { id:'payroll',     icon:'💵',  label:'Payroll',     path:'/erp/payroll',      color:'#27ae60' },
  { id:'elearning',   icon:'🎓',  label:'eLearning',   path:'/erp/elearning',    color:'#e91e63' },
  { id:'website',     icon:'🌐',  label:'Website',     path:'/erp/website',      color:'#009688' },
  { id:'pos',         icon:'🏪',  label:'Point of Sale',path:'/erp/pos',          color:'#ff5722' },
]

export default function AppSwitcher() {
  const navigate = useNavigate()

  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', minHeight:'100vh',
      background:'var(--bg)', padding:24,
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:40 }}>
        <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg, var(--teal), var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚀</div>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:'var(--text)' }}>Innovation ERP</div>
          <div style={{ fontSize:12, color:'var(--text3)' }}>Powered by Odoo Simulation</div>
        </div>
      </div>

      {/* App grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))',
        gap:16,
        maxWidth:900, width:'100%',
      }}>
        {APPS.map(app => (
          <button key={app.id} onClick={() => navigate(app.path)}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              padding:'16px 8px', background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:12, cursor:'pointer', transition:'all var(--t)', fontFamily:'inherit',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--surface3)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)' }}>
            <div style={{ width:52, height:52, borderRadius:12, background:app.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
              {app.icon}
            </div>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--text2)', textAlign:'center', lineHeight:1.3 }}>{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
