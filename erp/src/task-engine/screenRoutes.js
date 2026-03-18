/**
 * screenRoutes.js
 * Maps every odoo_screen_target from all_steps.json → ERP route
 * Used by useTaskEngine to navigate to the correct screen automatically.
 */
export const SCREEN_ROUTES = {
  home:             '/erp',
  crm:              '/erp/crm/pipeline',
  contacts:         '/erp/contacts',
  sales:            '/erp/sales/quotations',
  employees:        '/erp/employees',
  invoicing:        '/erp/accounting',
  inventory:        '/erp/inventory/products',
  project:          '/erp/project',
  settings:         '/erp/settings',
  calendar:         '/erp/calendar',
  discuss:          '/erp/discuss',
  expenses:         '/erp/expenses',
  leave_requests:   '/erp/timeoff',
  recruitment:      '/erp/recruitment',
  payroll:          '/erp/payroll',
  manufacturing:    '/erp/manufacturing',
  purchase:         '/erp/purchase',
  helpdesk:         '/erp/helpdesk',
  planning:         '/erp/planning',
  fleet:            '/erp/fleet',
  maintenance:      '/erp/maintenance',
  events:           '/erp/events',
  email_marketing:  '/erp/email-marketing',
  surveys:          '/erp/surveys',
  website_builder:  '/erp/website',
  appointments:     '/erp/appointments',
  rental:           '/erp/rental',
  data_cleaning:    '/erp/data-cleaning',
}

export function getRouteForScreen(screenKey) {
  return SCREEN_ROUTES[screenKey] ?? '/erp'
}
