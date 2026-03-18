/**
 * selectorMap.js
 * 
 * Maps every highlight_selector from all_steps.json to a DOM query strategy.
 * 
 * Strategy order (tried in sequence until an element is found):
 *   1. data-task-id="<selector>"          — most reliable, we add these to key elements
 *   2. aria-label / text content match    — fallback for common buttons
 *   3. role + text combos                 — final fallback
 * 
 * Returns a function: () => HTMLElement | null
 */

// Primary: data-task-id attributes placed on ERP elements
// Secondary: DOM queries as fallback
const SELECTOR_MAP = {
  // ── App launcher tiles (AppSwitcher) ──────────────────────────
  'app-crm':              () => q('[data-task-id="app-crm"]')      || qText('CRM', 'button'),
  'app-contacts':         () => q('[data-task-id="app-contacts"]')  || qText('Contacts', 'button'),
  'app-sales':            () => q('[data-task-id="app-sales"]')     || qText('Sales', 'button'),
  'app-employees':        () => q('[data-task-id="app-employees"]') || qText('Employees', 'button'),
  'app-inventory':        () => q('[data-task-id="app-inventory"]') || qText('Inventory', 'button'),
  'app-invoicing':        () => q('[data-task-id="app-invoicing"]') || qText('Accounting', 'button'),
  'app-project':          () => q('[data-task-id="app-project"]')   || qText('Project', 'button'),
  'app-settings':         () => q('[data-task-id="app-settings"]')  || qText('Settings', 'button'),
  'app-calendar':         () => q('[data-task-id="app-calendar"]')  || qText('Calendar', 'button'),
  'app-discuss':          () => q('[data-task-id="app-discuss"]')   || qText('Discuss', 'button'),
  'app-expenses':         () => q('[data-task-id="app-expenses"]')  || qText('Expenses', 'button'),
  'app-email':            () => q('[data-task-id="app-email"]')     || qText('Email Marketing', 'button'),
  'app-leaves':           () => q('[data-task-id="app-leaves"]')    || qText('Time Off', 'button'),
  'app-helpdesk':         () => q('[data-task-id="app-helpdesk"]')  || qText('Helpdesk', 'button'),
  'app-manufacturing':    () => q('[data-task-id="app-manufacturing"]') || qText('Manufacturing', 'button'),
  'app-payroll':          () => q('[data-task-id="app-payroll"]')   || qText('Payroll', 'button'),
  'app-planning':         () => q('[data-task-id="app-planning"]')  || qText('Planning', 'button'),
  'app-fleet':            () => q('[data-task-id="app-fleet"]')     || qText('Fleet', 'button'),
  'app-maintenance':      () => q('[data-task-id="app-maintenance"]') || qText('Maintenance', 'button'),
  'app-events':           () => q('[data-task-id="app-events"]')    || qText('Events', 'button'),
  'app-surveys':          () => q('[data-task-id="app-surveys"]')   || qText('Surveys', 'button'),
  'app-website':          () => q('[data-task-id="app-website"]')   || qText('Website', 'button'),
  'app-appointments':     () => q('[data-task-id="app-appointments"]') || qText('Appointments', 'button'),
  'app-rental':           () => q('[data-task-id="app-rental"]')    || qText('Rental', 'button'),
  'app-products':         () => q('[data-task-id="app-products"]')  || qText('Products', 'button'),
  'app-data-cleaning':    () => q('[data-task-id="app-data-cleaning"]') || qText('Data Cleaning', 'button'),
  'app-deduplication':    () => q('[data-task-id="app-deduplication"]') || qText('Deduplication', 'button'),
  'app-configuration':    () => q('[data-task-id="app-configuration"]') || qText('Configuration', 'button'),

  // ── Common action bar buttons ──────────────────────────────────
  'new-button':           () => q('[data-task-id="new-button"]')    || qText('New', 'button'),
  'save-button':          () => q('[data-task-id="save-button"]')   || qText('Save', 'button'),
  'cancel-button':        () => q('[data-task-id="cancel-button"]') || qText('Cancel', 'button'),
  'confirm-button':       () => q('[data-task-id="confirm-button"]')|| qText('Confirm', 'button'),
  'create-button':        () => q('[data-task-id="create-button"]') || qText('Activity', 'button'),
  'send-button':          () => q('[data-task-id="send-button"]')   || qText('Send', 'button'),
  'approve-button':       () => q('[data-task-id="approve-button"]')|| qText('Approve', 'button'),
  'download-button':      () => q('[data-task-id="download-button"]')|| qText('Download', 'button'),
  'submit-button':        () => q('[data-task-id="submit-button"]') || qText('Submit', 'button'),
  'share-button':         () => q('[data-task-id="share-button"]')  || qText('Share', 'button'),
  'test-button':          () => q('[data-task-id="test-button"]')   || qText('Test', 'button'),
  'merge-button':         () => q('[data-task-id="merge-button"]')  || qText('Merge', 'button'),
  'see-results-button':   () => q('[data-task-id="see-results-button"]') || qText('See Results', 'button'),
  'start-live-session-button': () => q('[data-task-id="start-live-session-button"]') || qText('Start Live Session', 'button'),
  'activate-developer-mode-button': () => q('[data-task-id="activate-developer-mode-button"]') || qText('Activate Developer Mode', 'button'),
  'bug-icon':             () => q('[data-task-id="bug-icon"]'),

  // ── List / Kanban items ───────────────────────────────────────
  'list-row':             () => q('[data-task-id="list-row"]')      || q('tbody tr:first-child'),
  'kanban-card':          () => q('[data-task-id="kanban-card"]'),

  // ── Form fields ────────────────────────────────────────────────
  'field-name':           () => q('[data-task-id="field-name"]')    || q('input[placeholder*="name" i]'),
  'field-email':          () => q('[data-task-id="field-email"]')   || q('input[type="email"]'),
  'field-phone':          () => q('[data-task-id="field-phone"]')   || q('input[placeholder*="phone" i]'),
  'field-type':           () => q('[data-task-id="field-type"]'),
  'field-date':           () => q('[data-task-id="field-date"]')    || q('input[type="date"]'),
  'field-description':    () => q('[data-task-id="field-description"]') || q('textarea'),
  'field-customer':       () => q('[data-task-id="field-customer"]')|| q('input[placeholder*="customer" i]'),
  'field-product':        () => q('[data-task-id="field-product"]') || q('input[placeholder*="product" i]'),
  'field-amount':         () => q('[data-task-id="field-amount"]')  || q('input[type="number"]'),
  'field-address':        () => q('[data-task-id="field-address"]') || q('input[placeholder*="street" i]'),
  'field-project':        () => q('[data-task-id="field-project"]') || q('select'),

  // ── UI chrome ─────────────────────────────────────────────────
  'status-bar':           () => q('[data-task-id="status-bar"]'),
  'calendar':             () => q('[data-task-id="calendar"]'),
  'calendar-day':         () => q('[data-task-id="calendar-day"]'),
}

// ── DOM helpers ───────────────────────────────────────────────────
function q(selector) {
  try { return document.querySelector(selector) } catch { return null }
}

function qText(text, tag = '*') {
  const all = document.querySelectorAll(tag)
  for (const el of all) {
    if (el.textContent?.trim() === text) return el
  }
  return null
}

/**
 * Find the DOM element for a given highlight_selector string.
 * Returns null if no element is found.
 */
export function findElement(selector) {
  if (!selector) return null
  const strategy = SELECTOR_MAP[selector]
  if (!strategy) return null
  try { return strategy() ?? null } catch { return null }
}

/**
 * Returns true if the selector has a DOM mapping defined.
 */
export function hasMapping(selector) {
  return !!SELECTOR_MAP[selector]
}
