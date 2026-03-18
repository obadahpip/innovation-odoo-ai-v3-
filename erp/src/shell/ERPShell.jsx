/**
 * ERPShell.jsx — Main ERP shell with nav config for all 57 modules
 * Odoo 19.0 Innovation ERP Simulator
 * Updated: Batch 2 — Website, eCommerce, LiveChat, eLearning, Forum, Blog, Studio
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
      { label:'Invoices',     path:'/erp/accounting/invoices' },
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
    { label:'Expense Reports', items:[
      { label:'My Expense Reports',  path:'/erp/expenses' },
      { label:'All Expense Reports', path:'/erp/expenses' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  purchase: [
    { label:'Purchase', items:[
      { label:'Requests for Quotation', path:'/erp/purchase/rfq' },
      { label:'Purchase Orders',        path:'/erp/purchase/orders' },
    ]},
    { label:'Products', items:[
      { label:'Products',      path:'/erp/purchase/products' },
      { label:'Vendor Prices', path:'/erp/purchase/pricelists' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  employees: [
    { label:'Employees', items:[
      { label:'Employees',   path:'/erp/employees' },
      { label:'Departments', path:'/erp/employees/departments' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  helpdesk: [
    { label:'Tickets', items:[
      { label:'My Tickets',      path:'/erp/helpdesk' },
      { label:'All Tickets',     path:'/erp/helpdesk/all' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Stages',  path:'/erp/helpdesk/stages' },
      { label:'Teams',   path:'/erp/helpdesk/teams' },
    ]},
  ],
  discuss: [
    { label:'Discuss', items:[] },
  ],
  email_marketing: [
    { label:'Email Marketing', items:[
      { label:'Mailings',         path:'/erp/email-marketing' },
      { label:'Mailing Lists',    path:'/erp/email-marketing/lists' },
    ]},
    { label:'SMS', items:[
      { label:'SMS Marketing',    path:'/erp/sms' },
    ]},
    { label:'Marketing Automation', items:[
      { label:'Automation',       path:'/erp/marketing-automation' },
    ]},
    { label:'Reporting', items:[] },
  ],
  timesheets: [
    { label:'Timesheets', items:[
      { label:'My Timesheets',  path:'/erp/timesheets' },
      { label:'All Timesheets', path:'/erp/timesheets' },
    ]},
    { label:'Reporting', items:[] },
  ],
  fleet: [
    { label:'Fleet', items:[
      { label:'Vehicles',   path:'/erp/fleet' },
      { label:'Contracts',  path:'/erp/fleet/contracts' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Models',   path:'/erp/fleet/models' },
    ]},
  ],
  events: [
    { label:'Events', items:[
      { label:'Events',  path:'/erp/events' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  calendar: [
    { label:'Calendar', items:[] },
  ],
  maintenance: [
    { label:'Maintenance', items:[
      { label:'Maintenance Requests', path:'/erp/maintenance' },
      { label:'Equipment',            path:'/erp/maintenance/equipment' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Stages', path:'/erp/maintenance/stages' },
    ]},
  ],
  planning: [
    { label:'Planning', items:[
      { label:'Planning', path:'/erp/planning' },
    ]},
  ],
  project: [
    { label:'Project', items:[
      { label:'All Projects', path:'/erp/project' },
      { label:'All Tasks',    path:'/erp/project/tasks' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  manufacturing: [
    { label:'Manufacturing', items:[
      { label:'Manufacturing Orders', path:'/erp/manufacturing' },
      { label:'Work Orders',          path:'/erp/manufacturing/work' },
    ]},
    { label:'Products', items:[
      { label:'Bills of Materials', path:'/erp/manufacturing/bom' },
      { label:'Products',           path:'/erp/manufacturing/products' },
    ]},
    { label:'PLM', items:[
      { label:'Engineering Changes', path:'/erp/plm' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  recruitment: [
    { label:'Recruitment', items:[
      { label:'All Applications',  path:'/erp/recruitment' },
      { label:'New Applications',  path:'/erp/recruitment/new-apps' },
    ]},
    { label:'Job Positions', items:[
      { label:'Job Positions',     path:'/erp/recruitment/positions' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  expenses: [
    { label:'My Expenses', items:[
      { label:'My Expenses',        path:'/erp/expenses' },
      { label:'My Reports',         path:'/erp/expenses/reports' },
    ]},
    { label:'Managers', items:[
      { label:'All Expenses',       path:'/erp/expenses/all' },
      { label:'Expense Reports',    path:'/erp/expenses/all-reports' },
    ]},
    { label:'Reporting', items:[] },
  ],
  payroll: [
    { label:'Employees', items:[
      { label:'Payslips',           path:'/erp/payroll' },
      { label:'All Payslips',       path:'/erp/payroll/all' },
      { label:'Payslip Batches',    path:'/erp/payroll/batches' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Salary Structures',  path:'/erp/payroll/structures' },
    ]},
  ],
  time_off: [
    { label:'My Time Off', items:[
      { label:'My Time Off',        path:'/erp/time-off' },
      { label:'My Allocations',     path:'/erp/time-off/allocations' },
    ]},
    { label:'Managers', items:[
      { label:'All Time Off',       path:'/erp/time-off/all' },
      { label:'All Allocations',    path:'/erp/time-off/all-allocations' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Leave Types',        path:'/erp/time-off/types' },
    ]},
  ],

  // ── Batch 2: Website modules ─────────────────────────────────
  website: [
    { label:'Website', items:[
      { label:'Pages', path:'/erp/website' },
    ]},
    { label:'eCommerce', items:[
      { label:'Products',  path:'/erp/ecommerce' },
      { label:'Orders',    path:'/erp/ecommerce/orders' },
      { label:'Customers', path:'/erp/contacts' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[
      { label:'Settings', path:'/erp/website/config' },
    ]},
  ],
  ecommerce: [
    { label:'eCommerce', items:[
      { label:'Products', path:'/erp/ecommerce' },
      { label:'Orders',   path:'/erp/ecommerce/orders' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  livechat: [
    { label:'Live Chat', items:[
      { label:'Channels', path:'/erp/livechat' },
    ]},
    { label:'Reporting', items:[] },
    { label:'Configuration', items:[] },
  ],
  elearning: [
    { label:'eLearning', items:[
      { label:'Courses', path:'/erp/elearning' },
    ]},
    { label:'Configuration', items:[] },
  ],
  forum: [
    { label:'Forum', items:[
      { label:'Forums', path:'/erp/forum' },
    ]},
    { label:'Configuration', items:[] },
  ],
  blog: [
    { label:'Blog', items:[
      { label:'Blog Posts', path:'/erp/blog' },
      { label:'Blogs',      path:'/erp/blog' },
    ]},
    { label:'Configuration', items:[] },
  ],
  studio: [
    { label:'Studio', items:[
      { label:'Models',            path:'/erp/studio' },
      { label:'Views',             path:'/erp/studio/views' },
      { label:'Automated Actions', path:'/erp/studio/actions' },
      { label:'PDF Reports',       path:'/erp/studio/reports' },
      { label:'Approval Rules',    path:'/erp/studio/rules' },
    ]},
  ],
}

// ── Sidebar config per active app ────────────────────────────────
export const SIDEBAR_CONFIG = {
  crm: {
    sections: [
      { label: 'PIPELINE', items: [
        { label: 'My Pipeline', path: '/erp/crm/pipeline', icon: '⭐' },
        { label: 'All Leads',   path: '/erp/crm/leads',    icon: '📋' },
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
        { label: 'Dashboard',         path: '/erp/accounting',          icon: '📊' },
        { label: 'Customer Invoices', path: '/erp/accounting/invoices', icon: '📋' },
        { label: 'Vendor Bills',      path: '/erp/accounting/bills',    icon: '🧾' },
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
      { label: 'Requests for Quotation', path: '/erp/purchase/rfq',    icon: '📝' },
      { label: 'Purchase Orders',        path: '/erp/purchase/orders', icon: '🛍️' },
    ]}],
  },
  expenses: {
    sections: [
      { label: 'MY EXPENSES', items: [
        { label: 'My Expenses',       path: '/erp/expenses',         icon: '🧾' },
        { label: 'My Reports',        path: '/erp/expenses/reports', icon: '📋' },
      ]},
      { label: 'MANAGERS', items: [
        { label: 'All Expenses',      path: '/erp/expenses/all',     icon: '📊' },
        { label: 'Expense Reports',   path: '/erp/expenses/all-reports', icon: '📁' },
      ]},
    ],
  },
  payroll: {
    sections: [
      { label: 'EMPLOYEES', items: [
        { label: 'Payslips',         path: '/erp/payroll',          icon: '💸' },
        { label: 'All Payslips',     path: '/erp/payroll/all',      icon: '📋' },
        { label: 'Batches',          path: '/erp/payroll/batches',  icon: '📦' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Salary Structures',path: '/erp/payroll/structures',icon: '⚙' },
      ]},
    ],
  },
  time_off: {
    sections: [
      { label: 'MY TIME OFF', items: [
        { label: 'My Time Off',      path: '/erp/time-off',               icon: '🏖' },
        { label: 'My Allocations',   path: '/erp/time-off/allocations',   icon: '📋' },
      ]},
      { label: 'MANAGERS', items: [
        { label: 'All Time Off',     path: '/erp/time-off/all',           icon: '📊' },
        { label: 'All Allocations',  path: '/erp/time-off/all-allocations',icon: '📁' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Leave Types',      path: '/erp/time-off/types',         icon: '⚙' },
      ]},
    ],
  },
  recruitment: {
    sections: [
      { label: 'RECRUITMENT', items: [
        { label: 'Applications',     path: '/erp/recruitment',           icon: '👔' },
        { label: 'Job Positions',    path: '/erp/recruitment/positions', icon: '📋' },
      ]},
    ],
  },
  helpdesk: {
    sections: [
      { label: 'HELPDESK', items: [
        { label: 'My Tickets',   path: '/erp/helpdesk',          icon: '🎧' },
        { label: 'All Tickets',  path: '/erp/helpdesk/all',      icon: '📋' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Stages',       path: '/erp/helpdesk/stages',   icon: '📌' },
        { label: 'Teams',        path: '/erp/helpdesk/teams',    icon: '👥' },
      ]},
    ],
  },
  discuss: {
    sections: [{ label: 'DISCUSS', items: [
      { label: 'Inbox',    path: '/erp/discuss', icon: '📥' },
      { label: 'Channels', path: '/erp/discuss', icon: '#' },
    ]}],
  },
  email_marketing: {
    sections: [
      { label: 'EMAIL MARKETING', items: [
        { label: 'Email Marketing',      path: '/erp/email-marketing',  icon: '📧' },
        { label: 'Mailing Lists',        path: '/erp/email-marketing/lists', icon: '📋' },
      ]},
      { label: 'SMS', items: [
        { label: 'SMS Marketing',        path: '/erp/sms',               icon: '📱' },
      ]},
      { label: 'AUTOMATION', items: [
        { label: 'Marketing Automation', path: '/erp/marketing-automation', icon: '🤖' },
      ]},
      { label: 'SIGN', items: [
        { label: 'Sign Templates',       path: '/erp/sign',              icon: '✍' },
      ]},
    ],
  },
  timesheets: {
    sections: [{ label: 'TIMESHEETS', items: [
      { label: 'All Timesheets', path: '/erp/timesheets', icon: '⏱️' },
      { label: 'My Timesheets',  path: '/erp/timesheets', icon: '📋' },
    ]}],
  },
  fleet: {
    sections: [
      { label: 'FLEET', items: [
        { label: 'Vehicles',  path: '/erp/fleet',           icon: '🚗' },
        { label: 'Contracts', path: '/erp/fleet/contracts', icon: '📋' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Models',    path: '/erp/fleet/models',    icon: '🏎' },
      ]},
    ],
  },
  events: {
    sections: [{ label: 'EVENTS', items: [
      { label: 'Events', path: '/erp/events', icon: '📅' },
    ]}],
  },
  maintenance: {
    sections: [
      { label: 'MAINTENANCE', items: [
        { label: 'Requests',  path: '/erp/maintenance',           icon: '🔧' },
        { label: 'Equipment', path: '/erp/maintenance/equipment', icon: '⚙' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Stages',    path: '/erp/maintenance/stages',    icon: '📌' },
      ]},
    ],
  },
  planning: {
    sections: [{ label: 'PLANNING', items: [
      { label: 'Planning', path: '/erp/planning', icon: '📅' },
    ]}],
  },
  surveys: {
    sections: [{ label: 'SURVEYS', items: [
      { label: 'Surveys',       path: '/erp/surveys',        icon: '📊' },
      { label: 'Configuration', path: '/erp/surveys/config', icon: '⚙' },
    ]}],
  },
  rental: {
    sections: [{ label: 'RENTAL', items: [
      { label: 'Rental Orders', path: '/erp/rental',          icon: '📋' },
      { label: 'Products',      path: '/erp/rental/products', icon: '📦' },
    ]}],
  },
  appointments: {
    sections: [
      { label: 'APPOINTMENTS', items: [
        { label: 'Appointments',      path: '/erp/appointments',       icon: '📅' },
        { label: 'Appointment Types', path: '/erp/appointments/types', icon: '⚙' },
      ]},
    ],
  },
  data_cleaning: {
    sections: [{ label: 'DATA CLEANING', items: [
      { label: 'Deduplication',  path: '/erp/data-cleaning',       icon: '🔀' },
      { label: 'Cleaning Rules', path: '/erp/data-cleaning/rules', icon: '🧹' },
    ]}],
  },
  inventory: {
    sections: [
      { label: 'PRODUCTS', items: [
        { label: 'Products',           path: '/erp/inventory/products', icon: '📦' },
        { label: 'Lots & Serials',     path: '/erp/inventory/lots',     icon: '🔢' },
      ]},
      { label: 'OPERATIONS', items: [
        { label: 'Transfers',          path: '/erp/inventory/transfers', icon: '🔄' },
        { label: 'Physical Inventory', path: '/erp/inventory/physical',  icon: '📋' },
      ]},
      { label: 'CONFIGURATION', items: [
        { label: 'Warehouses', path: '/erp/inventory/warehouses', icon: '🏭' },
        { label: 'Settings',   path: '/erp/inventory/config',     icon: '⚙' },
      ]},
    ],
  },
  manufacturing: {
    sections: [
      { label: 'MANUFACTURING', items: [
        { label: 'Manufacturing Orders', path: '/erp/manufacturing',      icon: '🏭' },
        { label: 'Work Orders',          path: '/erp/manufacturing/work', icon: '🔧' },
      ]},
      { label: 'PRODUCTS', items: [
        { label: 'Bills of Materials', path: '/erp/manufacturing/bom',     icon: '📋' },
        { label: 'Products',           path: '/erp/manufacturing/products',icon: '📦' },
      ]},
      { label: 'PLM', items: [
        { label: 'Engineering Changes', path: '/erp/plm', icon: '📝' },
      ]},
    ],
  },

  // ── Batch 2 ──────────────────────────────────────────────────
  website: {
    sections: [{ label: 'WEBSITE', items: [
      { label: 'Pages',     path: '/erp/website',    icon: '📄' },
      { label: 'eCommerce', path: '/erp/ecommerce',  icon: '🛒' },
      { label: 'Blog',      path: '/erp/blog',       icon: '📝' },
      { label: 'eLearning', path: '/erp/elearning',  icon: '🎓' },
      { label: 'Forum',     path: '/erp/forum',      icon: '💬' },
      { label: 'Live Chat', path: '/erp/livechat',   icon: '💬' },
    ]}],
  },
  ecommerce: {
    sections: [{ label: 'ECOMMERCE', items: [
      { label: 'Products', path: '/erp/ecommerce',        icon: '📦' },
      { label: 'Orders',   path: '/erp/ecommerce/orders', icon: '🛒' },
    ]}],
  },
  livechat: {
    sections: [{ label: 'LIVE CHAT', items: [
      { label: 'Channels', path: '/erp/livechat', icon: '💬' },
    ]}],
  },
  elearning: {
    sections: [{ label: 'ELEARNING', items: [
      { label: 'Courses', path: '/erp/elearning', icon: '🎓' },
    ]}],
  },
  forum: {
    sections: [{ label: 'FORUM', items: [
      { label: 'Forums', path: '/erp/forum', icon: '💬' },
    ]}],
  },
  blog: {
    sections: [{ label: 'BLOG', items: [
      { label: 'Blog Posts', path: '/erp/blog', icon: '📝' },
    ]}],
  },
  studio: {
    sections: [{ label: 'STUDIO', items: [
      { label: 'Models',            path: '/erp/studio',          icon: '🗄' },
      { label: 'Views',             path: '/erp/studio/views',    icon: '🖼' },
      { label: 'Automated Actions', path: '/erp/studio/actions',  icon: '⚡' },
      { label: 'PDF Reports',       path: '/erp/studio/reports',  icon: '📄' },
      { label: 'Approval Rules',    path: '/erp/studio/rules',    icon: '✅' },
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
  if (pathname.startsWith('/erp/inventory'))       return 'inventory'
  if (pathname.startsWith('/erp/purchase'))        return 'purchase'
  if (pathname.startsWith('/erp/plm'))             return 'manufacturing'
  if (pathname.startsWith('/erp/helpdesk'))        return 'helpdesk'
  if (pathname.startsWith('/erp/discuss'))         return 'discuss'
  if (pathname.startsWith('/erp/email-marketing'))  return 'email_marketing'
  if (pathname.startsWith('/erp/sms'))              return 'email_marketing'
  if (pathname.startsWith('/erp/social'))           return 'email_marketing'
  if (pathname.startsWith('/erp/marketing-automation')) return 'email_marketing'
  if (pathname.startsWith('/erp/sign'))             return 'email_marketing'
  if (pathname.startsWith('/erp/timesheets'))      return 'timesheets'
  if (pathname.startsWith('/erp/fleet'))            return 'fleet'
  if (pathname.startsWith('/erp/events'))           return 'events'
  if (pathname.startsWith('/erp/calendar'))         return 'calendar'
  if (pathname.startsWith('/erp/maintenance'))      return 'maintenance'
  if (pathname.startsWith('/erp/planning'))         return 'planning'
  if (pathname.startsWith('/erp/surveys'))          return 'surveys'
  if (pathname.startsWith('/erp/rental'))           return 'rental'
  if (pathname.startsWith('/erp/appointments'))     return 'appointments'
  if (pathname.startsWith('/erp/data-cleaning'))    return 'data_cleaning'
  if (pathname.startsWith('/erp/manufacturing'))   return 'manufacturing'
  if (pathname.startsWith('/erp/recruitment'))     return 'recruitment'
  if (pathname.startsWith('/erp/time-off'))         return 'time_off'
  if (pathname.startsWith('/erp/payroll'))          return 'payroll'
  // ── Batch 2 ──────────────────────────────────────────────────
  if (pathname.startsWith('/erp/studio'))          return 'studio'
  if (pathname.startsWith('/erp/ecommerce'))       return 'ecommerce'
  if (pathname.startsWith('/erp/livechat'))        return 'livechat'
  if (pathname.startsWith('/erp/elearning'))       return 'elearning'
  if (pathname.startsWith('/erp/forum'))           return 'forum'
  if (pathname.startsWith('/erp/blog'))            return 'blog'
  if (pathname.startsWith('/erp/website'))         return 'website'
  return null
}

// ── ERPShell component ───────────────────────────────────────────
export default function ERPShell() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const activeApp  = getActiveApp(location.pathname)
  const navMenus   = NAV_MENUS[activeApp] || []
  const sidebarCfg = SIDEBAR_CONFIG[activeApp]
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
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
        onMenuClick={label => setTimeout(() => setOpenDropdown(o => o === label ? null : label), 0)}
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
