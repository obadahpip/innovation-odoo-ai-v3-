/**
 * moduleConfig.js
 * Source of truth for all ERP modules.
 *
 * status:
 *   'built'  — fully implemented module
 *   'stub'   — basic list/form exists, selectors present
 *   'coming' — placeholder only
 *
 * route: must exactly match a <Route path="..."> in App.jsx
 */

export const SWITCHER_MODULES = [
  // ── Accounting & Finance ──────────────────────────────────────
  { id: 'accounting',      label: 'Accounting',        icon: '💰', color: '#8e44ad', route: '/erp/accounting',             status: 'built',  group: 'Accounting' },
  { id: 'expenses',        label: 'Expenses',           icon: '🧾', color: '#9b59b6', route: '/erp/expenses',               status: 'built',  group: 'Accounting' },
  { id: 'paymentprov',     label: 'Payment Providers',  icon: '💳', color: '#6c3483', route: '/erp/payment-providers',       status: 'built',  group: 'Accounting' },
  { id: 'esg',             label: 'ESG',                icon: '🌱', color: '#27ae60', route: '/erp/esg',                    status: 'stub',   group: 'Accounting' },

  // ── Sales ─────────────────────────────────────────────────────
  { id: 'crm',             label: 'CRM',                icon: '⭐', color: '#e74c3c', route: '/erp/crm/pipeline',           status: 'built',  group: 'Sales' },
  { id: 'sales',           label: 'Sales',              icon: '📦', color: '#c0392b', route: '/erp/sales/quotations',       status: 'built',  group: 'Sales' },
  { id: 'pos',             label: 'Point of Sale',      icon: '🏪', color: '#e67e22', route: '/erp/pos',                    status: 'stub',   group: 'Sales' },
  { id: 'subscriptions',   label: 'Subscriptions',      icon: '🔄', color: '#d35400', route: '/erp/subscriptions',          status: 'stub',   group: 'Sales' },
  { id: 'rental',          label: 'Rental',             icon: '🚗', color: '#e67e22', route: '/erp/rental',                 status: 'built',  group: 'Sales' },

  // ── Websites ──────────────────────────────────────────────────
  { id: 'website',         label: 'Website',            icon: '🌐', color: '#2ecc71', route: '/erp/website',                status: 'built',  group: 'Website' },
  { id: 'ecommerce',       label: 'eCommerce',          icon: '🛒', color: '#27ae60', route: '/erp/ecommerce',              status: 'built',  group: 'Website' },
  { id: 'livechat',        label: 'Live Chat',          icon: '💬', color: '#1abc9c', route: '/erp/livechat',               status: 'built',  group: 'Website' },
  { id: 'elearning',       label: 'eLearning',          icon: '🎓', color: '#16a085', route: '/erp/elearning',              status: 'built',  group: 'Website' },
  { id: 'forum',           label: 'Forum',              icon: '💬', color: '#2ecc71', route: '/erp/forum',                  status: 'built',  group: 'Website' },
  { id: 'blog',            label: 'Blog',               icon: '📝', color: '#27ae60', route: '/erp/blog',                   status: 'built',  group: 'Website' },

  // ── Supply Chain ──────────────────────────────────────────────
  { id: 'inventory',       label: 'Inventory',          icon: '📦', color: '#3498db', route: '/erp/inventory/products',     status: 'built',  group: 'Supply Chain' },
  { id: 'purchase',        label: 'Purchase',           icon: '🛍️', color: '#2980b9', route: '/erp/purchase/orders',        status: 'built',  group: 'Supply Chain' },
  { id: 'manufacturing',   label: 'Manufacturing',      icon: '🏭', color: '#1a5276', route: '/erp/manufacturing',          status: 'built',  group: 'Supply Chain' },
  { id: 'barcode',         label: 'Barcode',            icon: '📊', color: '#2471a3', route: '/erp/barcode',                status: 'stub',   group: 'Supply Chain' },
  { id: 'quality',         label: 'Quality',            icon: '✅', color: '#148f77', route: '/erp/quality',                status: 'stub',   group: 'Supply Chain' },
  { id: 'maintenance',     label: 'Maintenance',        icon: '🔧', color: '#2980b9', route: '/erp/maintenance',            status: 'built',  group: 'Supply Chain' },
  { id: 'repairs',         label: 'Repairs',            icon: '🔨', color: '#1f618d', route: '/erp/repairs',                status: 'stub',   group: 'Supply Chain' },
  { id: 'plm',             label: 'PLM',                icon: '⚙️', color: '#1a5276', route: '/erp/plm',                    status: 'built',  group: 'Supply Chain' },

  // ── Human Resources ───────────────────────────────────────────
  { id: 'employees',       label: 'Employees',          icon: '👥', color: '#714b67', route: '/erp/employees',              status: 'built',  group: 'HR' },
  { id: 'payroll',         label: 'Payroll',            icon: '💵', color: '#7d6608', route: '/erp/payroll',                status: 'built',  group: 'HR' },
  { id: 'timeoff',         label: 'Time Off',           icon: '🌴', color: '#0e6655', route: '/erp/time-off',               status: 'built',  group: 'HR' },
  { id: 'recruitment',     label: 'Recruitment',        icon: '👔', color: '#5b2333', route: '/erp/recruitment',            status: 'built',  group: 'HR' },
  { id: 'appraisals',      label: 'Appraisals',         icon: '⭐', color: '#7d6608', route: '/erp/appraisals',             status: 'built',  group: 'HR' },
  { id: 'attendances',     label: 'Attendances',        icon: '🕐', color: '#0e6655', route: '/erp/attendances',            status: 'built',  group: 'HR' },
  { id: 'fleet',           label: 'Fleet',              icon: '🚗', color: '#4a235a', route: '/erp/fleet',                  status: 'built',  group: 'HR' },
  { id: 'frontdesk',       label: 'Front Desk',         icon: '🏢', color: '#1a5276', route: '/erp/frontdesk',              status: 'stub',   group: 'HR' },
  { id: 'lunch',           label: 'Lunch',              icon: '🍕', color: '#784212', route: '/erp/lunch',                  status: 'built',  group: 'HR' },

  // ── Marketing ─────────────────────────────────────────────────
  { id: 'email_marketing', label: 'Email Marketing',    icon: '📧', color: '#922b21', route: '/erp/email-marketing',        status: 'built',  group: 'Marketing' },
  { id: 'sms',             label: 'SMS Marketing',      icon: '📱', color: '#1a5276', route: '/erp/sms',                    status: 'built',  group: 'Marketing' },
  { id: 'social',          label: 'Social Marketing',   icon: '📲', color: '#922b21', route: '/erp/social',                 status: 'stub',   group: 'Marketing' },
  { id: 'events',          label: 'Events',             icon: '📅', color: '#d35400', route: '/erp/events',                 status: 'built',  group: 'Marketing' },
  { id: 'marketing_auto',  label: 'Mktg Automation',    icon: '🤖', color: '#7d3c98', route: '/erp/marketing-automation',   status: 'built',  group: 'Marketing' },
  { id: 'surveys',         label: 'Surveys',            icon: '📊', color: '#2471a3', route: '/erp/surveys',                status: 'built',  group: 'Marketing' },

  // ── Services ──────────────────────────────────────────────────
  { id: 'project',         label: 'Project',            icon: '📋', color: '#2c3e50', route: '/erp/project',                status: 'built',  group: 'Services' },
  { id: 'timesheets',      label: 'Timesheets',         icon: '⏱️', color: '#1a5276', route: '/erp/timesheets',             status: 'built',  group: 'Services' },
  { id: 'helpdesk',        label: 'Helpdesk',           icon: '🎧', color: '#922b21', route: '/erp/helpdesk',               status: 'built',  group: 'Services' },
  { id: 'field_service',   label: 'Field Service',      icon: '🔧', color: '#145a32', route: '/erp/field-service',          status: 'built',  group: 'Services' },
  { id: 'planning',        label: 'Planning',           icon: '📅', color: '#4a235a', route: '/erp/planning',               status: 'built',  group: 'Services' },

  // ── Productivity ──────────────────────────────────────────────
  { id: 'contacts',        label: 'Contacts',           icon: '👤', color: '#0e6655', route: '/erp/contacts',               status: 'built',  group: 'Productivity' },
  { id: 'discuss',         label: 'Discuss',            icon: '💬', color: '#2471a3', route: '/erp/discuss',                status: 'built',  group: 'Productivity' },
  { id: 'calendar',        label: 'Calendar',           icon: '📅', color: '#1a5276', route: '/erp/calendar',               status: 'built',  group: 'Productivity' },
  { id: 'knowledge',       label: 'Knowledge',          icon: '📚', color: '#4a235a', route: '/erp/knowledge',              status: 'built',  group: 'Productivity' },
  { id: 'documents',       label: 'Documents',          icon: '📄', color: '#1f618d', route: '/erp/documents',              status: 'built',  group: 'Productivity' },
  { id: 'sign',            label: 'Sign',               icon: '✍️', color: '#145a32', route: '/erp/sign',                   status: 'built',  group: 'Productivity' },
  { id: 'spreadsheet',     label: 'Spreadsheet',        icon: '📊', color: '#1a5276', route: '/erp/spreadsheet',            status: 'built',  group: 'Productivity' },
  { id: 'todo',            label: 'To-Do',              icon: '✅', color: '#2c3e50', route: '/erp/todos',                  status: 'built',  group: 'Productivity' },
  { id: 'voip',            label: 'VoIP',               icon: '📞', color: '#1f618d', route: '/erp/voip',                   status: 'built',  group: 'Productivity' },
  { id: 'whatsapp',        label: 'WhatsApp',           icon: '💬', color: '#145a32', route: '/erp/whatsapp',               status: 'built',  group: 'Productivity' },

  // ── Studio ────────────────────────────────────────────────────
  { id: 'studio',          label: 'Studio',             icon: '⚙',  color: '#714b67', route: '/erp/studio',                 status: 'built',  group: 'Studio' },

  // ── Extra ─────────────────────────────────────────────────────
  { id: 'appointments',    label: 'Appointments',       icon: '📅', color: '#16a085', route: '/erp/appointments',           status: 'built',  group: 'Productivity' },
  { id: 'data_cleaning',   label: 'Data Cleaning',      icon: '🧹', color: '#2e86c1', route: '/erp/data-cleaning',          status: 'built',  group: 'Productivity' },
]

/**
 * MODULE_MAP — used by TopNavbar to look up the current app's
 * label and route from the URL segment.
 * Key = URL segment or moduleId as used in URL_TO_MODULE.
 */
export const MODULE_MAP = Object.fromEntries(
  SWITCHER_MODULES.map(m => [m.id, { label: m.label, route: m.route, icon: m.icon, color: m.color }])
)
