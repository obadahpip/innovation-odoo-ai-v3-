/**
 * seed.js — Master seed v4 (runs base + extended)
 * All field names verified against Odoo 19.0 source.
 */
import { batchCreate, clearAllStores, upsertRecord } from './db.js'
import { runExtendedSeed } from './seed_extension.js'

const SEED_VERSION = 'v4.0-odoo19'

// ── Partners ────────────────────────────────────────────────────
const PARTNERS = [
  { id:'partner-techcorp',   name:'TechCorp Solutions',     is_company:true,  company_type:'company', email:'info@techcorp.com',           phone:'(555)-100-1000', street:'100 Tech Ave',    city:'New York',  zip:'10001', country_id:'US', customer_rank:1, supplier_rank:1, active:true },
  { id:'partner-globalfood', name:'Global Food Industries',  is_company:true,  company_type:'company', email:'info@globalfood.com',         phone:'(555)-200-2000', street:'200 Food Blvd',   city:'Chicago',   zip:'60601', country_id:'US', customer_rank:1, supplier_rank:1, active:true },
  { id:'partner-eurotrade',  name:'EuroTrade GmbH',          is_company:true,  company_type:'company', email:'info@eurotrade.de',           phone:'+49 89 1234567', street:'Bahnhofstr. 10',  city:'Munich',    zip:'80335', country_id:'DE', customer_rank:1, supplier_rank:0, active:true },
  { id:'partner-mta',        name:'mta',                     is_company:true,  company_type:'company', email:'obadahabuodeh@gmail.com',     phone:'',               street:'',                city:'Amman',     zip:'',      country_id:'JO', customer_rank:0, supplier_rank:0, active:true },
  { id:'partner-emma',       name:'Emma Granger',            is_company:false, company_type:'person',  email:'granger@mycompany.example.com', phone:'(555)-768-6230', mobile:'(555)-768-6235', parent_id:'partner-techcorp', function:'Consultant',              customer_rank:1, supplier_rank:0, active:true, lang:'en_US' },
  { id:'partner-michael',    name:'Michael Williams',        is_company:false, company_type:'person',  email:'williams@mycompany.example.com', phone:'(555)-768-6230', parent_id:'partner-techcorp', function:'Chief Executive Officer',   customer_rank:0, supplier_rank:0, active:true, lang:'en_US' },
  { id:'partner-simon',      name:'Simon Jones',             is_company:false, company_type:'person',  email:'jones@mycompany.example.com', phone:'(555)-768-6230', parent_id:'partner-globalfood', function:'Experienced Developer',   customer_rank:0, supplier_rank:0, active:true, lang:'en_US' },
  { id:'partner-obadah',     name:'obadah abuodah',          is_company:false, company_type:'person',  email:'obadahabuodeh@gmail.com',     phone:'',               parent_id:'partner-mta', function:'Administrator',                customer_rank:0, supplier_rank:0, active:true, lang:'en_US' },
]

// ── CRM Stages ───────────────────────────────────────────────────
const CRM_STAGES = [
  { id:'crm-stage-new',         name:'New',         sequence:1, probability:10,  fold:false },
  { id:'crm-stage-qualified',   name:'Qualified',   sequence:2, probability:25,  fold:false },
  { id:'crm-stage-proposition', name:'Proposition', sequence:3, probability:50,  fold:false },
  { id:'crm-stage-won',         name:'Won',         sequence:4, probability:100, fold:true  },
  { id:'crm-stage-lost',        name:'Lost',        sequence:5, probability:0,   fold:true  },
]

// ── CRM Leads ────────────────────────────────────────────────────
const CRM_LEADS = [
  { id:'lead-001', name:"Emma's ERP Project",        type:'opportunity', partner_id:'partner-emma',      partner_name:'TechCorp Solutions',    contact_name:'Emma Granger',     email_from:'granger@mycompany.example.com', phone:'(555)-768-6230', stage_id:'crm-stage-proposition', user_id:'user-admin',   priority:'1', probability:50,  expected_revenue:25000, active:true },
  { id:'lead-002', name:'Global Food Expansion',     type:'opportunity', partner_id:'partner-globalfood', partner_name:'Global Food Industries', contact_name:'Simon Jones',    email_from:'jones@mycompany.example.com',   phone:'(555)-768-6230', stage_id:'crm-stage-qualified',   user_id:'user-admin',   priority:'2', probability:25,  expected_revenue:80000, active:true },
  { id:'lead-003', name:'EuroTrade Partnership',     type:'opportunity', partner_id:'partner-eurotrade',  partner_name:'EuroTrade GmbH',         contact_name:'Hans Mueller', email_from:'mueller@eurotrade.de',           phone:'+49 89 9876543', stage_id:'crm-stage-won',         user_id:'user-admin',   priority:'3', probability:100, expected_revenue:120000, active:true },
  { id:'lead-004', name:'Software License Deal',     type:'opportunity', partner_id:null,                 partner_name:'StartupXYZ',             contact_name:'Jane Doe',     email_from:'jane@startupxyz.com',            phone:'(555)-300-3000', stage_id:'crm-stage-new',         user_id:'user-manager', priority:'0', probability:10,  expected_revenue:5000,  active:true },
  { id:'lead-005', name:'Cloud Migration Proposal',  type:'opportunity', partner_id:'partner-techcorp',   partner_name:'TechCorp Solutions',    contact_name:'Michael Williams',email_from:'williams@mycompany.example.com',phone:'(555)-768-6230', stage_id:'crm-stage-qualified',  user_id:'user-manager', priority:'2', probability:30,  expected_revenue:45000, active:true },
  { id:'lead-006', name:'Website Redesign Lead',     type:'lead',        partner_id:null,                 partner_name:'Fashion Co',             contact_name:'Sarah Connor', email_from:'sarah@fashionco.com',             phone:'(555)-400-4000', stage_id:'crm-stage-new',         user_id:'user-admin',   priority:'0', probability:10,  expected_revenue:8000,  active:true },
]

// ── Products ─────────────────────────────────────────────────────
const PRODUCTS = [
  { id:'prod-erp-impl',     name:'ERP Implementation Services', type:'service',  list_price:2500,  standard_price:1200, uom_id:'hour',  active:true, sale_ok:true, purchase_ok:false, default_code:'SRV-ERP-01', tracking:'none', qty_available:0 },
  { id:'prod-training',     name:'Odoo Training Package',       type:'service',  list_price:800,   standard_price:350,  uom_id:'hour',  active:true, sale_ok:true, purchase_ok:false, default_code:'SRV-TRN-01', tracking:'none', qty_available:0 },
  { id:'prod-laptop',       name:'Business Laptop',             type:'product',  list_price:1200,  standard_price:850,  uom_id:'unit',  active:true, sale_ok:true, purchase_ok:true,  default_code:'HW-LAP-01',  tracking:'serial', qty_available:15 },
  { id:'prod-office-chair', name:'Ergonomic Office Chair',      type:'product',  list_price:450,   standard_price:220,  uom_id:'unit',  active:true, sale_ok:true, purchase_ok:true,  default_code:'FURN-001',   tracking:'none', qty_available:42 },
  { id:'prod-subscription', name:'Software Subscription',       type:'service',  list_price:99,    standard_price:20,   uom_id:'month', active:true, sale_ok:true, purchase_ok:false, default_code:'SRV-SUB-01', tracking:'none', qty_available:0 },
  { id:'prod-cheese-burger',name:'Cheese Burger',               type:'product',  list_price:50,    standard_price:20,   uom_id:'unit',  active:true, sale_ok:true, purchase_ok:true,  default_code:'FOOD-001',   tracking:'none', qty_available:100 },
  { id:'prod-server',       name:'Server Unit',                 type:'product',  list_price:3500,  standard_price:2100, uom_id:'unit',  active:true, sale_ok:true, purchase_ok:true,  default_code:'HW-SRV-01',  tracking:'serial', qty_available:5 },
  { id:'prod-consulting',   name:'Business Consulting',         type:'service',  list_price:150,   standard_price:70,   uom_id:'hour',  active:true, sale_ok:true, purchase_ok:false, default_code:'SRV-CON-01', tracking:'none', qty_available:0 },
]

// ── Sale Orders ──────────────────────────────────────────────────
const SALE_ORDERS = [
  { id:'so-001', name:'S00001', state:'sale',   partner_id:'partner-emma',       date_order:new Date(Date.now()-7*86400000).toISOString(),  amount_untaxed:50,   amount_tax:0, amount_total:50,   currency_id:'JOD', order_line:[{ id:'sol-001-1', product_id:'prod-cheese-burger', name:'Cheese Burger',     product_uom_qty:1, price_unit:50,   tax_id:[], price_subtotal:50 }] },
  { id:'so-002', name:'S00002', state:'draft',  partner_id:'partner-michael',    date_order:new Date(Date.now()-3*86400000).toISOString(),  amount_untaxed:2500, amount_tax:0, amount_total:2500, currency_id:'JOD', order_line:[{ id:'sol-002-1', product_id:'prod-erp-impl',     name:'ERP Implementation', product_uom_qty:1, price_unit:2500, tax_id:[], price_subtotal:2500 }] },
  { id:'so-003', name:'S00003', state:'sent',   partner_id:'partner-emma',       date_order:new Date(Date.now()-5*86400000).toISOString(),  amount_untaxed:3200, amount_tax:0, amount_total:3200, currency_id:'JOD', order_line:[{ id:'sol-003-1', product_id:'prod-training',     name:'Training Package',   product_uom_qty:4, price_unit:800,  tax_id:[], price_subtotal:3200 }] },
  { id:'so-004', name:'S00004', state:'cancel', partner_id:'partner-simon',      date_order:new Date(Date.now()-14*86400000).toISOString(), amount_untaxed:4500, amount_tax:0, amount_total:4500, currency_id:'JOD', order_line:[{ id:'sol-004-1', product_id:'prod-laptop',       name:'Business Laptop',    product_uom_qty:3, price_unit:1500, tax_id:[], price_subtotal:4500 }] },
  { id:'so-005', name:'S00005', state:'sale',   partner_id:'partner-globalfood', date_order:new Date(Date.now()-2*86400000).toISOString(),  amount_untaxed:7200, amount_tax:0, amount_total:7200, currency_id:'JOD', order_line:[{ id:'sol-005-1', product_id:'prod-consulting',   name:'Business Consulting',product_uom_qty:48, price_unit:150, tax_id:[], price_subtotal:7200 }] },
]

// ── HR Departments ───────────────────────────────────────────────
const DEPARTMENTS = [
  { id:'dept-admin', name:'Administration',        manager_id:'emp-michael', parent_id:null, active:true },
  { id:'dept-rd',    name:'Research & Development',manager_id:'emp-simon',   parent_id:null, active:true },
  { id:'dept-sales', name:'Sales',                 manager_id:'emp-michael', parent_id:null, active:true },
  { id:'dept-hr',    name:'Human Resources',       manager_id:'emp-michael', parent_id:null, active:true },
  { id:'dept-ops',   name:'Operations',            manager_id:'emp-michael', parent_id:null, active:true },
]

// ── Employees ────────────────────────────────────────────────────
const EMPLOYEES = [
  { id:'emp-emma',    name:'Emma Granger',    job_title:'Consultant',               department_id:'dept-rd',    parent_id:'emp-michael', coach_id:'emp-michael', work_email:'granger@mycompany.example.com',  work_phone:'(555)-768-6230', mobile_phone:'(555)-768-6235', user_id:null,          company_id:'partner-mta', active:true, category_ids:['Consultant','Demo'], gender:'female', birthday:'1990-03-15', country_id:'US' },
  { id:'emp-michael', name:'Michael Williams',job_title:'Chief Executive Officer',  department_id:'dept-admin', parent_id:null,          coach_id:null,          work_email:'williams@mycompany.example.com', work_phone:'(555)-768-6230', mobile_phone:'(555)-768-6240', user_id:'user-manager', company_id:'partner-mta', active:true, category_ids:['Employee','Demo'],   gender:'male',   birthday:'1975-07-22', country_id:'US' },
  { id:'emp-simon',   name:'Simon Jones',     job_title:'Experienced Developer',    department_id:'dept-rd',    parent_id:'emp-michael', coach_id:'emp-michael', work_email:'jones@mycompany.example.com',    work_phone:'(555)-768-6230', mobile_phone:'(555)-768-6245', user_id:null,          company_id:'partner-mta', active:true, category_ids:['Employee','Demo'],   gender:'male',   birthday:'1988-11-05', country_id:'US' },
]

// ── Invoices ─────────────────────────────────────────────────────
const INVOICES = [
  { id:'inv-001', name:'INV/2026/00001', move_type:'out_invoice', state:'draft',  payment_state:'not_paid', partner_id:'partner-emma',    invoice_date:'2026-03-18', invoice_date_due:'2026-03-18', currency_id:'JOD', amount_untaxed:50,   amount_tax:0, amount_total:50,   amount_residual:50,
    invoice_line_ids:[{ id:'aml-001-1', name:'Cheese Burger',           product_id:'prod-cheese-burger', quantity:1,  price_unit:50,   discount:0, tax_ids:[], price_subtotal:50,   display_type:'product' }] },
  { id:'inv-002', name:'INV/2026/00002', move_type:'out_invoice', state:'posted', payment_state:'paid',     partner_id:'partner-michael', invoice_date:'2026-03-10', invoice_date_due:'2026-04-10', currency_id:'JOD', amount_untaxed:2500, amount_tax:0, amount_total:2500, amount_residual:0,
    invoice_line_ids:[{ id:'aml-002-1', name:'ERP Implementation Services', product_id:'prod-erp-impl', quantity:1, price_unit:2500, discount:0, tax_ids:[], price_subtotal:2500, display_type:'product' }] },
  { id:'inv-003', name:'BILL/2026/00001', move_type:'in_invoice', state:'draft',  payment_state:'not_paid', partner_id:'partner-techcorp', invoice_date:'2026-03-01', invoice_date_due:'2026-03-31', currency_id:'JOD', amount_untaxed:850, amount_tax:0, amount_total:850, amount_residual:850,
    invoice_line_ids:[{ id:'aml-003-1', name:'Business Laptop purchase', product_id:'prod-laptop', quantity:1, price_unit:850, discount:0, tax_ids:[], price_subtotal:850, display_type:'product' }] },
]

// ── Project Stages ───────────────────────────────────────────────
const PROJECT_STAGES = [
  { id:'stage-todo',       name:'To Do',       sequence:1, fold:false },
  { id:'stage-inprogress', name:'In Progress', sequence:2, fold:false },
  { id:'stage-review',     name:'In Review',   sequence:3, fold:false },
  { id:'stage-done',       name:'Done',        sequence:4, fold:true  },
]

// ── Projects ─────────────────────────────────────────────────────
const PROJECTS = [
  { id:'proj-erp-impl', name:'ERP Implementation', user_id:'user-admin',   partner_id:'partner-emma',    date:'2026-06-30', date_start:'2026-01-01', last_update_status:'on_track', task_count:5, active:true, allow_timesheets:true },
  { id:'proj-website',  name:'Website Redesign',   user_id:'user-manager', partner_id:'partner-michael', date:'2026-04-30', date_start:'2026-02-01', last_update_status:'at_risk',  task_count:3, active:true, allow_timesheets:true },
]

// ── Tasks ────────────────────────────────────────────────────────
const TASKS = [
  { id:'task-001', name:'Database setup',        project_id:'proj-erp-impl', stage_id:'stage-done',       user_ids:['user-admin'],   date_deadline:'2026-02-15T00:00:00', priority:'1', kanban_state:'normal', active:true },
  { id:'task-002', name:'User training',          project_id:'proj-erp-impl', stage_id:'stage-inprogress', user_ids:['user-admin'],   date_deadline:'2026-03-30T00:00:00', priority:'0', kanban_state:'normal', active:true },
  { id:'task-003', name:'Sales module config',    project_id:'proj-erp-impl', stage_id:'stage-inprogress', user_ids:['user-manager'], date_deadline:'2026-04-15T00:00:00', priority:'1', kanban_state:'normal', active:true },
  { id:'task-004', name:'Invoice workflow setup', project_id:'proj-erp-impl', stage_id:'stage-todo',       user_ids:['user-manager'], date_deadline:'2026-04-30T00:00:00', priority:'0', kanban_state:'normal', active:true },
  { id:'task-005', name:'UAT Testing',            project_id:'proj-erp-impl', stage_id:'stage-todo',       user_ids:['user-admin'],   date_deadline:'2026-05-31T00:00:00', priority:'1', kanban_state:'blocked', active:true },
  { id:'task-006', name:'Homepage mockup',        project_id:'proj-website',  stage_id:'stage-review',     user_ids:['user-admin'],   date_deadline:'2026-03-20T00:00:00', priority:'1', kanban_state:'normal', active:true },
  { id:'task-007', name:'Product catalog page',   project_id:'proj-website',  stage_id:'stage-inprogress', user_ids:['user-manager'], date_deadline:'2026-04-05T00:00:00', priority:'0', kanban_state:'normal', active:true },
  { id:'task-008', name:'SEO optimization',       project_id:'proj-website',  stage_id:'stage-todo',       user_ids:['user-admin'],   date_deadline:'2026-04-20T00:00:00', priority:'0', kanban_state:'normal', active:true },
]

// ── Leave Types ──────────────────────────────────────────────────
const LEAVE_TYPES = [
  { id:'lt-annual',    name:'Annual Leave',    time_type:'leave', allocation_type:'fixed', leave_validation_type:'manager',        active:true },
  { id:'lt-sick',      name:'Sick Leave',      time_type:'leave', allocation_type:'no',    leave_validation_type:'no_validation',  active:true },
  { id:'lt-maternity', name:'Maternity Leave', time_type:'leave', allocation_type:'fixed', leave_validation_type:'hr',             active:true },
  { id:'lt-unpaid',    name:'Unpaid',          time_type:'leave', allocation_type:'no',    leave_validation_type:'hr',             active:true },
  { id:'lt-study',     name:'Study Leave',     time_type:'other', allocation_type:'fixed', leave_validation_type:'hr',             active:true },
]

// ── Time Off Requests ────────────────────────────────────────────
const LEAVES = [
  { id:'leave-001', name:'Annual vacation',   employee_id:'emp-emma',    holiday_status_id:'lt-annual',   date_from:'2026-04-01T09:00:00', date_to:'2026-04-07T18:00:00', number_of_days:5, state:'validate', holiday_type:'employee', active:true },
  { id:'leave-002', name:'Sick leave',        employee_id:'emp-simon',   holiday_status_id:'lt-sick',     date_from:'2026-03-10T09:00:00', date_to:'2026-03-12T18:00:00', number_of_days:3, state:'validate', holiday_type:'employee', active:true },
  { id:'leave-003', name:'Study for exams',   employee_id:'emp-emma',    holiday_status_id:'lt-study',    date_from:'2026-05-15T09:00:00', date_to:'2026-05-16T18:00:00', number_of_days:2, state:'confirm',  holiday_type:'employee', active:true },
  { id:'leave-004', name:'Personal time off', employee_id:'emp-michael', holiday_status_id:'lt-unpaid',   date_from:'2026-04-20T09:00:00', date_to:'2026-04-20T18:00:00', number_of_days:1, state:'draft',    holiday_type:'employee', active:true },
]

// ── Users ────────────────────────────────────────────────────────
const USERS = [
  { id:'user-admin',    name:'obadah abuodah',  login:'obadah',  email:'obadahabuodeh@gmail.com',            partner_id:'partner-obadah',  company_id:'partner-mta', lang:'en_US', tz:'Asia/Amman',         active:true, groups:['base.group_system'] },
  { id:'user-manager',  name:'Michael Williams',login:'michael', email:'williams@mycompany.example.com',     partner_id:'partner-michael', company_id:'partner-mta', lang:'en_US', tz:'America/New_York',   active:true, groups:['base.group_user','hr.group_hr_manager'] },
  { id:'user-employee', name:'Emma Granger',    login:'emma',    email:'granger@mycompany.example.com',      partner_id:'partner-emma',    company_id:'partner-mta', lang:'en_US', tz:'America/New_York',   active:true, groups:['base.group_user'] },
]

// ── Master runner ────────────────────────────────────────────────
export async function runSeed() {
  try {
    const { getRecord } = await import('./db.js')
    const meta = await getRecord('_seed_meta', 'seed-version')
    if (meta?.version === SEED_VERSION) {
      console.info(`[Seed] Already at ${SEED_VERSION} — skipping.`)
      return
    }

    console.info('[Seed] Starting full v4 seed...')
    await clearAllStores()

    await batchCreate('res.partner', PARTNERS)
    await batchCreate('res.users', USERS)
    await batchCreate('crm.stage', CRM_STAGES)
    await batchCreate('crm.lead', CRM_LEADS)
    await batchCreate('product.template', PRODUCTS)
    await batchCreate('sale.order', SALE_ORDERS)
    await batchCreate('hr.department', DEPARTMENTS)
    await batchCreate('hr.employee', EMPLOYEES)
    await batchCreate('account.move', INVOICES)
    await batchCreate('project.task.type', PROJECT_STAGES)
    await batchCreate('project.project', PROJECTS)
    await batchCreate('project.task', TASKS)
    await batchCreate('hr.leave.type', LEAVE_TYPES)
    await batchCreate('hr.leave', LEAVES)

    // Phase 4 extended seed
    await runExtendedSeed()

    await upsertRecord('_seed_meta', { id:'seed-version', version:SEED_VERSION, seededAt:new Date().toISOString() })
    console.info(`[Seed] ✓ Complete — ${SEED_VERSION}`)
  } catch (err) {
    console.error('[Seed] Failed:', err)
  }
}

export async function resetToDemo() {
  await clearAllStores()
  await runSeed()
  window.location.reload()
}
