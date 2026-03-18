/**
 * Accounting seed data — chart of accounts, journals, invoices, bills
 */
const D = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0,10)

export const ACCOUNTS = [
  // Assets
  { id:'acc-1100', code:'1100', name:'Cash',                    account_type:'asset_cash',        active:true },
  { id:'acc-1200', code:'1200', name:'Bank',                    account_type:'asset_cash',        active:true },
  { id:'acc-1300', code:'1300', name:'Accounts Receivable',     account_type:'asset_receivable',  active:true },
  { id:'acc-1500', code:'1500', name:'Inventory',               account_type:'asset_current',     active:true },
  { id:'acc-1800', code:'1800', name:'Fixed Assets',            account_type:'asset_fixed',       active:true },
  // Liabilities
  { id:'acc-2100', code:'2100', name:'Accounts Payable',        account_type:'liability_payable', active:true },
  { id:'acc-2300', code:'2300', name:'Tax Payable',             account_type:'liability_current', active:true },
  // Equity
  { id:'acc-3100', code:'3100', name:'Owner\'s Equity',         account_type:'equity',            active:true },
  { id:'acc-3200', code:'3200', name:'Retained Earnings',       account_type:'equity',            active:true },
  // Revenue
  { id:'acc-4100', code:'4100', name:'Service Revenue',         account_type:'income',            active:true },
  { id:'acc-4200', code:'4200', name:'Product Revenue',         account_type:'income',            active:true },
  // Expenses
  { id:'acc-5100', code:'5100', name:'Cost of Goods Sold',      account_type:'expense',           active:true },
  { id:'acc-5200', code:'5200', name:'Salaries & Wages',        account_type:'expense',           active:true },
  { id:'acc-5300', code:'5300', name:'Rent',                    account_type:'expense',           active:true },
  { id:'acc-5400', code:'5400', name:'Marketing & Advertising', account_type:'expense',           active:true },
  { id:'acc-5500', code:'5500', name:'Office Supplies',         account_type:'expense',           active:true },
  { id:'acc-5600', code:'5600', name:'Travel & Entertainment',  account_type:'expense',           active:true },
  { id:'acc-5700', code:'5700', name:'Depreciation',            account_type:'expense',           active:true },
]

export const JOURNALS = [
  { id:'journal-sales',    name:'Customer Invoices', type:'sale',      code:'INV',  default_account_id:'acc-4100' },
  { id:'journal-purchase', name:'Vendor Bills',      type:'purchase',  code:'BILL', default_account_id:'acc-5100' },
  { id:'journal-cash',     name:'Cash',              type:'cash',      code:'CSH',  default_account_id:'acc-1100' },
  { id:'journal-bank',     name:'Bank',              type:'bank',      code:'BNK',  default_account_id:'acc-1200' },
  { id:'journal-misc',     name:'Miscellaneous',     type:'general',   code:'MISC', default_account_id:'acc-1100' },
]

export const INVOICES = [
  // 3 posted customer invoices
  {
    id:'inv-001', name:'INV/2025/00001', move_type:'out_invoice', state:'posted',
    partner_id:'partner-acme', partner_name:'Acme Corp',
    invoice_date: D(30), invoice_date_due: D(0),
    journal_id:'journal-sales',
    amount_untaxed:14625, amount_tax:0, amount_total:14625, amount_residual:0,
    currency_id:'USD', payment_state:'paid',
    line_ids:[
      { id:'invl-001a', name:'ERP Base License', quantity:1, price_unit:10000, price_subtotal:10000, account_id:'acc-4100' },
      { id:'invl-001b', name:'Implementation Hours x25', quantity:25, price_unit:100, price_subtotal:2500, account_id:'acc-4100' },
      { id:'invl-001c', name:'Annual Support', quantity:1, price_unit:2125, price_subtotal:2125, account_id:'acc-4100' },
    ],
  },
  {
    id:'inv-002', name:'INV/2025/00002', move_type:'out_invoice', state:'posted',
    partner_id:'partner-delta', partner_name:'Delta Technologies',
    invoice_date: D(22), invoice_date_due: D(8),
    journal_id:'journal-sales',
    amount_untaxed:9828, amount_tax:0, amount_total:9828, amount_residual:4914,
    currency_id:'USD', payment_state:'partial',
    line_ids:[
      { id:'invl-002a', name:'Annual Support', quantity:1, price_unit:6000, price_subtotal:6000, account_id:'acc-4100' },
      { id:'invl-002b', name:'Implementation Hours x24', quantity:24, price_unit:100, price_subtotal:2400, account_id:'acc-4100' },
      { id:'invl-002c', name:'Training x10', quantity:10, price_unit:142.80, price_subtotal:1428, account_id:'acc-4100' },
    ],
  },
  {
    id:'inv-003', name:'INV/2025/00003', move_type:'out_invoice', state:'posted',
    partner_id:'partner-global', partner_name:'Global Imports LLC',
    invoice_date: D(14), invoice_date_due: D(16),
    journal_id:'journal-sales',
    amount_untaxed:6727.50, amount_tax:0, amount_total:6727.50, amount_residual:6727.50,
    currency_id:'USD', payment_state:'not_paid',
    line_ids:[
      { id:'invl-003a', name:'ERP Base License', quantity:1, price_unit:5000, price_subtotal:5000, account_id:'acc-4100' },
      { id:'invl-003b', name:'Training Session x5', quantity:5, price_unit:150, price_subtotal:750, account_id:'acc-4100' },
      { id:'invl-003c', name:'Tax', quantity:1, price_unit:977.50, price_subtotal:977.50, account_id:'acc-2300' },
    ],
  },
  // 1 draft invoice
  {
    id:'inv-004', name:'INV/2025/00004', move_type:'out_invoice', state:'draft',
    partner_id:'partner-nexus', partner_name:'Nexus Solutions',
    invoice_date: D(2), invoice_date_due: D(-28),
    journal_id:'journal-sales',
    amount_untaxed:25740, amount_tax:0, amount_total:25740, amount_residual:25740,
    currency_id:'USD', payment_state:'not_paid',
    line_ids:[
      { id:'invl-004a', name:'Custom Development x80h', quantity:80, price_unit:250, price_subtotal:20000, account_id:'acc-4100' },
      { id:'invl-004b', name:'Annual Support', quantity:1, price_unit:2000, price_subtotal:2000, account_id:'acc-4100' },
      { id:'invl-004c', name:'Tax', quantity:1, price_unit:3740, price_subtotal:3740, account_id:'acc-2300' },
    ],
  },
  // 2 vendor bills
  {
    id:'bill-001', name:'BILL/2025/00001', move_type:'in_invoice', state:'posted',
    partner_id:'partner-nordic', partner_name:'Nordic Supplies AB',
    invoice_date: D(25), invoice_date_due: D(-5),
    journal_id:'journal-purchase',
    amount_untaxed:3200, amount_tax:0, amount_total:3200, amount_residual:0,
    currency_id:'USD', payment_state:'paid',
    line_ids:[
      { id:'billl-001a', name:'Office Supplies Q1', quantity:1, price_unit:3200, price_subtotal:3200, account_id:'acc-5500' },
    ],
  },
  {
    id:'bill-002', name:'BILL/2025/00002', move_type:'in_invoice', state:'posted',
    partner_id:'partner-apex', partner_name:'Apex Industries',
    invoice_date: D(10), invoice_date_due: D(20),
    journal_id:'journal-purchase',
    amount_untaxed:8500, amount_tax:0, amount_total:8500, amount_residual:8500,
    currency_id:'USD', payment_state:'not_paid',
    line_ids:[
      { id:'billl-002a', name:'Marketing Campaign', quantity:1, price_unit:8500, price_subtotal:8500, account_id:'acc-5400' },
    ],
  },
]
