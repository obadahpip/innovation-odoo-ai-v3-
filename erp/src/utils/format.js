/**
 * format.js — Display formatters
 *
 * Replicates Odoo's formatting conventions for dates, numbers, and currency.
 * Used by field components across all modules.
 */

// ── Date formatters ───────────────────────────────────────────────

/** Format: Jan 15, 2025 */
export function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Format: Jan 15, 2025 10:30 AM */
export function formatDateTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

/** Format: relative time — "2 hours ago", "in 3 days" */
export function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const abs  = Math.abs(diff)
  const past = diff > 0

  if (abs < 60_000)        return past ? 'just now' : 'in a moment'
  if (abs < 3_600_000)     { const m = Math.round(abs / 60_000);      return past ? `${m}m ago` : `in ${m}m` }
  if (abs < 86_400_000)    { const h = Math.round(abs / 3_600_000);   return past ? `${h}h ago` : `in ${h}h` }
  if (abs < 2_592_000_000) { const d = Math.round(abs / 86_400_000);  return past ? `${d}d ago` : `in ${d}d` }
  return formatDate(isoString)
}

// ── Number formatters ─────────────────────────────────────────────

/** Format: 1,234,567 */
export function formatInteger(value) {
  if (value === null || value === undefined) return ''
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

/** Format: 1,234.56 */
export function formatFloat(value, decimals = 2) {
  if (value === null || value === undefined) return ''
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/** Format: $1,234.56 */
export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return ''
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Format: 12.5% */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return ''
  return `${Number(value).toFixed(decimals)}%`
}

// ── String formatters ─────────────────────────────────────────────

/** Odoo-style record name: "Lead #42" or the record name field */
export function formatRecordName(record, model) {
  if (!record) return ''
  if (record.name) return record.name
  if (record.display_name) return record.display_name
  if (record.id) return `${model} #${record.id.slice(-4)}`
  return '(no name)'
}

/** Truncate long strings with ellipsis */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str
}

/** Capitalize first letter */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Odoo "many2one" display: returns name of linked record */
export function displayMany2One(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[1] ?? ''
  if (typeof value === 'object') return value.name ?? value.display_name ?? ''
  return String(value)
}
