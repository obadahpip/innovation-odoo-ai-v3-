/**
 * taskRoutes.js
 * Maps every odoo_screen_target value from all_steps.json
 * to a real ERP route the router can navigate to.
 */
export const SCREEN_ROUTES = {
  home:            '/erp/home',
  crm:             '/erp/crm/pipeline',
  sales:           '/erp/sales/quotations',
  contacts:        '/erp/contacts',
  invoicing:       '/erp/accounting/invoices',
  employees:       '/erp/employees',
  project:         '/erp/project',
  settings:        '/erp/settings',
  inventory:       '/erp/inventory/products',
  leave_requests:  '/erp/time-off',
  payroll:         '/erp/payroll',
  recruitment:     '/erp/recruitment',
  website_builder: '/erp/website',
  manufacturing:   '/erp/manufacturing',
  purchase:        '/erp/purchase/orders',
  helpdesk:        '/erp/helpdesk',
  email_marketing: '/erp/email-marketing',
  discuss:         '/erp/discuss',
  calendar:        '/erp/calendar',
  expenses:        '/erp/expenses',
  fleet:           '/erp/fleet',
  events:          '/erp/events',
  maintenance:     '/erp/maintenance',
  planning:        '/erp/planning',
  surveys:         '/erp/surveys',
  rental:          '/erp/rental',
  appointments:    '/erp/appointments',
  data_cleaning:   '/erp/data-cleaning',
}

/**
 * Maps highlight_selector (data-erp value) of navigate steps
 * to specific routes — used when a step navigates to a sub-page.
 * e.g. "app-crm" → go to /erp/crm/pipeline
 */
export const APP_SELECTOR_ROUTES = {
  'app-crm':            '/erp/crm/pipeline',
  'app-sales':          '/erp/sales/quotations',
  'app-contacts':       '/erp/contacts',
  'app-accounting':     '/erp/accounting',
  'app-invoicing':      '/erp/accounting/invoices',
  'app-expenses':       '/erp/expenses',
  'app-employees':      '/erp/employees',
  'app-project':        '/erp/project',
  'app-inventory':      '/erp/inventory/products',
  'app-purchase':       '/erp/purchase/orders',
  'app-manufacturing':  '/erp/manufacturing',
  'app-website':        '/erp/website',
  'app-ecommerce':      '/erp/ecommerce',
  'app-livechat':       '/erp/livechat',
  'app-discuss':        '/erp/discuss',
  'app-helpdesk':       '/erp/helpdesk',
  'app-timesheets':     '/erp/timesheets',
  'app-leaves':         '/erp/time-off',
  'app-email':          '/erp/email-marketing',
  'app-calendar':       '/erp/calendar',
  'app-fleet':          '/erp/fleet',
  'app-events':         '/erp/events',
  'app-maintenance':    '/erp/maintenance',
  'app-planning':       '/erp/planning',
  'app-surveys':        '/erp/surveys',
  'app-rental':         '/erp/rental',
  'app-appointments':   '/erp/appointments',
  'app-deduplication':  '/erp/data-cleaning',
  'app-configuration':  '/erp/data-cleaning/rules',
  'app-products':       '/erp/inventory/products',
}
