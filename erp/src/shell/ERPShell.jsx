/**
 * ERPShell.jsx — Main ERP shell with nav config for all 57 modules
 * Odoo 19.0 Innovation ERP Simulator
 */
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import TopNavbar from './TopNavbar.jsx'
import LeftSidebar from './LeftSidebar.jsx'
import StatusBar from './StatusBar.jsx'

// ── App Switcher Menu (home screen tiles) ────────────────────────
export const APPS = [
  // Accounting & Finance
  { id:'accounting',    name:'Accounting',      icon:'💰', color:'#8e44ad', path:'/erp/accounting',          group:'Accounting' },
  { id:'expenses',      name:'Expenses',        icon:'🧾', color:'#9b59b6', path:'/erp/expenses',            group:'Accounting' },
  { id:'paymentprov',   name:'Payment Providers',icon:'💳',color:'#6c3483', path:'/erp/payment-providers',   group:'Accounting' },
  { id:'esg',           name:'ESG',             icon:'🌱', color:'#27ae60', path:'/erp/esg',                 group:'Accounting' },
  // Sales
  { id:'crm',           name:'CRM',             icon:'⭐', color:'#e74c3c', path:'/erp/crm/pipeline',        group:'Sales' },
  { id:'sales',         name:'Sales',           icon:'📦', color:'#c0392b', path:'/erp/sales/quotations',    group:'Sales' },
  { id:'pos',           name:'Point of Sale',   icon:'🏪', color:'#e67e22', path:'/erp/pos',                 group:'Sales' },
  { id:'subscriptions', name:'Subscriptions',   icon:'🔄', color:'#d35400', path:'/erp/subscriptions',       group:'Sales' },
  { id:'rental',        name:'Rental',          icon:'🚗', color:'#e67e22', path:'/erp/rental',              group:'Sales' },
  // Websites
  { id:'website',       name:'Website',         icon:'🌐', color:'#2ecc71', path:'/erp/website',             group:'Website' },
  { id:'ecommerce',     name:'eCommerce',       icon:'🛒', color:'#27ae60', path:'/erp/ecommerce',           group:'Website' },
  { id:'livechat',      name:'Live Chat',       icon:'💬', color:'#1abc9c', path:'/erp/livechat',            group:'Website' },
  { id:'elearning',     name:'eLearning',       icon:'🎓', color:'#16a085', path:'/erp/elearning',           group:'Website' },
  { id:'forum',         name:'Forum',           icon:'💬', color:'#2ecc71', path:'/erp/forum',               group:'Website' },
  { id:'blog',          name:'Blog',            icon:'📝', color:'#27ae60', path:'/erp/blog',                group:'Website' },
  // Supply Chain
  { id:'inventory',     name:'Inventory',       icon:'📦', color:'#3498db', path:'/erp/inventory/products',  group:'Supply Chain' },
  { id:'purchase',      name:'Purchase',        icon:'🛍️', color:'#2980b9', path:'/erp/purchase/orders',     group:'Supply Chain' },
  { id:'manufacturing', name:'Manufacturing',   icon:'🏭', color:'#1a5276', path:'/erp/manufacturing',       group:'Supply Chain' },
  { id:'barcode',       name:'Barcode',         icon:'📊', color:'#2471a3', path:'/erp/barcode',             group:'Supply Chain' },
  { id:'quality',       name:'Quality',         icon:'✅', color:'#148f77', path:'/erp/quality',             group:'Supply Chain' },
  { id:'maintenance',   name:'Maintenance',     icon:'🔧', color:'#2980b9', path:'/erp/maintenance',         group:'Supply Chain' },
  { id:'repairs',       name:'Repairs',         icon:'🔨', color:'#1f618d', path:'/erp/repairs',             group:'Supply Chain' },
  { id:'plm',           name:'PLM',             icon:'⚙️', color:'#1a5276', path:'/erp/plm',                 group:'Supply Chain' },
  // HR
  { id:'employees',     name:'Employees',       icon:'👥', color:'#714b67', path:'/erp/employees',           group:'Human Resources' },
  { id:'payroll',       name:'Payroll',         icon:'💵', color:'#7d6608', path:'/erp/payroll',             group:'Human Resources' },
  { id:'timeoff',       name:'Time Off',        icon:'🌴', color:'#0e6655', path:'/erp/time-off',            group:'Human Resources' },
  { id:'recruitment',   name:'Recruitment',     icon:'👔', color:'#5b2333', path:'/erp/recruitment',         group:'Human Resources' },
  { id:'appraisals',    name:'Appraisals',      icon:'⭐', color:'#7d6608', path:'/erp/appraisals',          group:'Human Resources' },
  { id:'attendances',   name:'Attendances',     icon:'🕐', color:'#0e6655', path:'/erp/attendances',         group:'Human Resources' },
  { id:'fleet',         name:'Fleet',           icon:'🚗', color:'#4a235a', path:'/erp/fleet',               group:'Human Resources' },
  { id:'frontdesk',     name:'Front Desk',      icon:'🏢', color:'#1a5276', path:'/erp/frontdesk',           group:'Human Resources' },
  { id:'lunch',         name:'Lunch',           icon:'🍕', color:'#784212', path:'/erp/lunch',               group:'Human Resources' },
  // Marketing
  { id:'email_marketing', name:'Email Marketing', icon:'📧', color:'#922b21', path:'/erp/email-marketing',  group:'Marketing' },
  { id:'sms',           name:'SMS Marketing',   icon:'📱', color:'#1a5276', path:'/erp/sms',                group:'Marketing' },
  { id:'social',        name:'Social Marketing',icon:'📲', color:'#922b21', path:'/erp/social',             group:'Marketing' },
  { id:'events',        name:'Events',          icon:'📅', color:'#d35400', path:'/erp/events',             group:'Marketing' },
  { id:'marketing_auto',name:'Mktg Automation', icon:'🤖', color:'#7d3c98', path:'/erp/marketing-automation',group:'Marketing' },
  { id:'surveys',       name:'Surveys',         icon:'📊', color:'#2471a3', path:'/erp/surveys',            group:'Marketing' },
  // Services
  { id:'project',       name:'Project',         icon:'📋', color:'#2c3e50', path:'/erp/project',            group:'Services' },
  { id:'timesheets',    name:'Timesheets',       icon:'⏱️', color:'#1a5276', path:'/erp/timesheets',         group:'Services' },
  { id:'helpdesk',      name:'Helpdesk',         icon:'🎧', color:'#922b21', path:'/erp/helpdesk',           group:'Services' },
  { id:'field_service', name:'Field Service',   icon:'🔧', color:'#145a32', path:'/erp/field-service',      group:'Services' },
  { id:'planning',      name:'Planning',         icon:'📅', color:'#4a235a', path:'/erp/planning',           group:'Services' },
  // Productivity
  { id:'contacts',      name:'Contacts',         icon:'👤', color:'#0e6655', path:'/erp/contacts',           group:'Productivity' },
  { id:'discuss',       name:'Discuss',          icon:'💬', color:'#2471a3', path:'/erp/discuss',            group:'Productivity' },
  { id:'calendar',      name:'Calendar',         icon:'📅', color:'#1a5276', path:'/erp/calendar',           group:'Productivity' },
  { id:'knowledge',     name:'Knowledge',        icon:'📚', color:'#4a235a', path:'/erp/knowledge',          group:'Productivity' },
  { id:'documents',     name:'Documents',        icon:'📄', color:'#1f618d', path:'/erp/documents',          group:'Productivity' },
  { id:'sign',          name:'Sign',             icon:'✍️', color:'#145a32', path:'/erp/sign',               group:'Productivity' },
  { id:'spreadsheet',   name:'Spreadsheet',      icon:'📊', color:'#1a5276', path:'/erp/spreadsheet',        group:'Productivity' },
  { id:'todo',          name:'To-Do',            icon:'✅', color:'#2c3e50', path:'/erp/todos',              group:'Productivity' },
  { id:'voip',          name:'VoIP',             icon:'📞', color:'#1f618d', path:'/erp/voip',               group:'Productivity' },
  { id:'whatsapp',      name:'WhatsApp',         icon:'💬', color:'#145a32', path:'/erp/whatsapp',           group:'Productivity' },
]

// ── Top nav menus ────────────────────────────────────────────────
export const NAV_MENUS = {
  crm: [
    { label:'Sales', items:[
      { label:'Pipeline',     path:'/erp/crm/pipeline' },
      { label:'Leads',        path:'/erp/crm/leads' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  sales: [
    { label:'Orders', items:[
      { label:'Quotations',   path:'/erp/sales/quotations' },
      { label:'Orders',       path:'/erp/sales/orders' },
    ]},
    { label:'Products', items:[] },
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  contacts: [
    { label:'Contacts',  items:[] },
    { label:'Sales & Purchase', items:[] },
    { label:'Configuration', items:[] },
  ],
  accounting: [
    { label:'Accounting', items:[
      { label:'Dashboard', path:'/erp/accounting' },
    ]},
    { label:'Customers', items:[
      { label:'Invoices', path:'/erp/accounting/invoices' },
      { label:'Credit Notes', path:'/erp/accounting/invoices' },
    ]},
    { label:'Vendors', items:[
      { label:'Bills', path:'/erp/accounting/bills' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  expenses: [
    { label:'My Expenses', items:[] },
    { label:'Expense Reports', items:[{ label:'My Expense Reports', path:'/erp/expenses' },{ label:'All Expense Reports', path:'/erp/expenses' }]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  purchase: [
    { label:'Purchase', items:[
      { label:'Requests for Quotation', path:'/erp/purchase/orders' },
      { label:'Purchase Orders', path:'/erp/purchase/orders' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  employees: [
    { label:'Employees', items:[
      { label:'Employees', path:'/erp/employees' },
      { label:'Departments', path:'/erp/employees/departments' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  helpdesk: [
    { label:'Tickets', items:[
      { label:'My Tickets', path:'/erp/helpdesk' },
      { label:'All Tickets', path:'/erp/helpdesk' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  timesheets: [
    { label:'Timesheets', items:[
      { label:'My Timesheets', path:'/erp/timesheets' },
      { label:'All Timesheets', path:'/erp/timesheets' },
    ]},
    { label:'Reporting', items:[] },
  ],
  project: [
    { label:'Project', items:[
      { label:'All Projects', path:'/erp/project' },
      { label:'All Tasks', path:'/erp/project/tasks' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  manufacturing: [
    { label:'Manufacturing', items:[
      { label:'Manufacturing Orders', path:'/erp/manufacturing' },
      { label:'Bill of Materials', path:'/erp/manufacturing' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  recruitment: [
    { label:'Recruitment', items:[
      { label:'Applications', path:'/erp/recruitment' },
      { label:'All Applications', path:'/erp/recruitment' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
}

// ── Sidebar config per active app ────────────────────────────────
export const SIDEBAR_CONFIG = {
  crm: {
    sections: [
      { label: 'PIPELINE', items: [
        { label: 'My Pipeline',  path: '/erp/crm/pipeline', icon: '⭐' },
        { label: 'All Leads',    path: '/erp/crm/leads',    icon: '📋' },
      ]},
    ],
  },
  sales: {
    sections: [
      { label: 'ORDERS', items: [
        { label: 'Quotations',   path: '/erp/sales/quotations', icon: '📄' },
        { label: 'Sales Orders', path: '/erp/sales/orders',     icon: '📦' },
      ]},
    ],
  },
  contacts: {
    sections: [
      { label: 'CONTACTS', items: [
        { label: 'Contacts', path: '/erp/contacts', icon: '👤' },
      ]},
    ],
  },
  accounting: {
    sections: [
      { label: 'ACCOUNTING', items: [
        { label: 'Dashboard',        path: '/erp/accounting',          icon: '📊' },
        { label: 'Customer Invoices',path: '/erp/accounting/invoices', icon: '📋' },
        { label: 'Vendor Bills',     path: '/erp/accounting/bills',    icon: '🧾' },
      ]},
    ],
  },
  expenses: {
    sections: [{ label: 'EXPENSES', items: [
      { label: 'My Expenses',         path: '/erp/expenses', icon: '🧾' },
      { label: 'All Expense Reports', path: '/erp/expenses', icon: '📋' },
    ]}],
  },
  employees: {
    sections: [{ label: 'EMPLOYEES', items: [
      { label: 'Employees',   path: '/erp/employees',             icon: '👥' },
      { label: 'Departments', path: '/erp/employees/departments', icon: '🏢' },
    ]}],
  },
  project: {
    sections: [{ label: 'PROJECT', items: [
      { label: 'All Projects', path: '/erp/project',       icon: '📋' },
      { label: 'All Tasks',    path: '/erp/project/tasks', icon: '✓' },
    ]}],
  },
  purchase: {
    sections: [{ label: 'PURCHASE', items: [
      { label: 'Requests for Quotation', path: '/erp/purchase/orders', icon: '📝' },
      { label: 'Purchase Orders',        path: '/erp/purchase/orders', icon: '🛍️' },
    ]}],
  },
  helpdesk: {
    sections: [{ label: 'HELPDESK', items: [
      { label: 'My Tickets',  path: '/erp/helpdesk', icon: '🎧' },
      { label: 'All Tickets', path: '/erp/helpdesk', icon: '📋' },
    ]}],
  },
  timesheets: {
    sections: [{ label: 'TIMESHEETS', items: [
      { label: 'All Timesheets', path: '/erp/timesheets', icon: '⏱️' },
      { label: 'My Timesheets',  path: '/erp/timesheets', icon: '📋' },
    ]}],
  },
  manufacturing: {
    sections: [{ label: 'MANUFACTURING', items: [
      { label: 'Manufacturing Orders', path: '/erp/manufacturing', icon: '🏭' },
      { label: 'Bill of Materials',    path: '/erp/manufacturing', icon: '📋' },
    ]}],
  },
}

// ── Helper: detect active app from URL ───────────────────────────
function getActiveApp(pathname) {
  if (pathname.startsWith('/erp/crm'))             return 'crm'
  if (pathname.startsWith('/erp/sales'))           return 'sales'
  if (pathname.startsWith('/erp/contacts'))        return 'contacts'
  if (pathname.startsWith('/erp/accounting'))      return 'accounting'
  if (pathname.startsWith('/erp/expenses'))        return 'expenses'
  if (pathname.startsWith('/erp/employees'))       return 'employees'
  if (pathname.startsWith('/erp/project'))         return 'project'
  if (pathname.startsWith('/erp/purchase'))        return 'purchase'
  if (pathname.startsWith('/erp/helpdesk'))        return 'helpdesk'
  if (pathname.startsWith('/erp/timesheets'))      return 'timesheets'
  if (pathname.startsWith('/erp/manufacturing'))   return 'manufacturing'
  if (pathname.startsWith('/erp/recruitment'))     return 'recruitment'
  return null
}

// ── ERPShell component ───────────────────────────────────────────
export default function ERPShell() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const activeApp  = getActiveApp(location.pathname)
  const navMenus   = NAV_MENUS[activeApp] || []
  const sidebarCfg = SIDEBAR_CONFIG[activeApp]
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openDropdown, setOpenDropdown] = useState(null)

    useEffect(() => {
    const close = () => setOpenDropdown(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)', color:'var(--text)', overflow:'hidden' }}>
      {/* Top navbar */}
      <TopNavbar
        appName={activeApp ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1) : ''}
        menuItems={navMenus.map(m => m.label)}
        activeMenu={null}
        openDropdown={openDropdown}
        dropdowns={Object.fromEntries(
          navMenus.filter(m => m.items?.length).map(m => [m.label, m.items])
        )}
        onMenuClick={label => setOpenDropdown(o => o === label ? null : label)}
        onDropdownNavigate={path => { navigate(path); setOpenDropdown(null) }}
      />

      {/* Main content area */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left sidebar — only shown when app has sidebar config */}
        {sidebarCfg && sidebarOpen && (
          <LeftSidebar
            sections={sidebarCfg.sections}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Page content */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>
          <Outlet />
        </div>
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  )
}
