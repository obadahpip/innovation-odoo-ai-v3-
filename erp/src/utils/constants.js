/**
 * constants.js — Shared ERP constants
 *
 * Central place for magic values, route paths, model names,
 * and other constants used across multiple modules.
 */

// ── Route prefixes ────────────────────────────────────────────────
export const ROUTES = {
  HOME:              '/erp',
  SETTINGS:          '/erp/settings',
  CONTACTS:          '/erp/contacts',
  USERS:             '/erp/users',
  CRM:               '/erp/crm',
  CRM_PIPELINE:      '/erp/crm/pipeline',
  CRM_LEADS:         '/erp/crm/leads',
  SALES:             '/erp/sales',
  SALES_QUOTATIONS:  '/erp/sales/quotations',
  SALES_ORDERS:      '/erp/sales/orders',
  INVENTORY:         '/erp/inventory',
  INVENTORY_PRODUCTS:'/erp/inventory/products',
  ACCOUNTING:        '/erp/accounting',
  HR_EMPLOYEES:      '/erp/employees',
  PROJECT:           '/erp/project',
  HELPDESK:          '/erp/helpdesk',
  TIMESHEETS:        '/erp/timesheets',
}

// ── Model names (must match db.js store names) ────────────────────
export const MODELS = {
  PARTNER:     'res.partner',
  USER:        'res.users',
  COMPANY:     'res.company',
  CRM_LEAD:    'crm.lead',
  SALE_ORDER:  'sale.order',
  INVOICE:     'account.move',
  EMPLOYEE:    'hr.employee',
  LEAVE:       'hr.leave',
  PRODUCT:     'product.template',
  PICKING:     'stock.picking',
  TASK:        'project.task',
  PROJECT:     'project.project',
  TICKET:      'helpdesk.ticket',
  TIMESHEET:   'account.analytic.line',
  ACTIVITY:    'mail.activity',
  MESSAGE:     'mail.message',
}

// ── CRM pipeline stages ───────────────────────────────────────────
export const CRM_STAGES = [
  { id: 'stage-new',         name: 'New',          sequence: 1, fold: false },
  { id: 'stage-qualified',   name: 'Qualified',    sequence: 2, fold: false },
  { id: 'stage-proposition', name: 'Proposition',  sequence: 3, fold: false },
  { id: 'stage-won',         name: 'Won',          sequence: 4, fold: true  },
  { id: 'stage-lost',        name: 'Lost',         sequence: 5, fold: true  },
]

// ── Sale order states ─────────────────────────────────────────────
export const SALE_STATES = [
  { value: 'draft',     label: 'Quotation',       color: 'muted'   },
  { value: 'sent',      label: 'Quotation Sent',  color: 'info'    },
  { value: 'sale',      label: 'Sales Order',     color: 'success' },
  { value: 'cancel',    label: 'Cancelled',       color: 'danger'  },
]

// ── Invoice types & states ────────────────────────────────────────
export const INVOICE_TYPES = [
  { value: 'out_invoice',  label: 'Customer Invoice' },
  { value: 'in_invoice',   label: 'Vendor Bill'      },
  { value: 'out_refund',   label: 'Credit Note'      },
  { value: 'in_refund',    label: 'Vendor Refund'    },
]

export const INVOICE_STATES = [
  { value: 'draft',    label: 'Draft',    color: 'muted'   },
  { value: 'posted',   label: 'Posted',   color: 'success' },
  { value: 'cancel',   label: 'Cancelled',color: 'danger'  },
]

// ── HR leave states ───────────────────────────────────────────────
export const LEAVE_STATES = [
  { value: 'draft',    label: 'To Submit',  color: 'muted'   },
  { value: 'confirm',  label: 'To Approve', color: 'warning' },
  { value: 'validate', label: 'Approved',   color: 'success' },
  { value: 'refuse',   label: 'Refused',    color: 'danger'  },
]

// ── Stock picking types ───────────────────────────────────────────
export const PICKING_TYPES = [
  { value: 'incoming', label: 'Receipt',       icon: '📥' },
  { value: 'outgoing', label: 'Delivery',      icon: '📤' },
  { value: 'internal', label: 'Internal',      icon: '🔄' },
]

// ── Activity types ────────────────────────────────────────────────
export const ACTIVITY_TYPES = [
  { id: 'act-email',   name: 'Email',          icon: '📧', color: '#1f7abd' },
  { id: 'act-call',    name: 'Phone Call',     icon: '📞', color: '#28a745' },
  { id: 'act-meeting', name: 'Meeting',        icon: '👥', color: '#714b67' },
  { id: 'act-todo',    name: 'To-Do',          icon: '✅', color: '#e78c3e' },
  { id: 'act-upload',  name: 'Upload Document',icon: '📄', color: '#6c757d' },
]

// ── Priority levels ───────────────────────────────────────────────
export const PRIORITIES = [
  { value: '0', label: 'Normal', icon: '☆' },
  { value: '1', label: 'Low',    icon: '★' },
  { value: '2', label: 'High',   icon: '★★' },
  { value: '3', label: 'Very High', icon: '★★★' },
]

// ── Page sizes ────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 80
export const KANBAN_PAGE_SIZE  = 40

// ── Lesson task engine ────────────────────────────────────────────
export const MAX_HINTS_PER_LESSON = 3
