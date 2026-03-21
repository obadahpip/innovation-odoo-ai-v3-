// ── V3: Odoo instance URL ─────────────────────────────────────────────────────
// Set VITE_ODOO_BASE_URL in .env.development / .env.production to switch
// between test and production Odoo instances without touching code.
export const ODOO_BASE_URL =
  import.meta.env.VITE_ODOO_BASE_URL || 'https://mtab.odoo.com/odoo';