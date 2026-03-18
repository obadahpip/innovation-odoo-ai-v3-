/**
 * seed_extension.js
 * Seed data for all 47 new Phase 4 modules.
 * Extends the base seed.js with real Odoo 19.0 field names.
 * Called from seed.js after base data is loaded.
 */
import { batchCreate } from './db.js'

export async function runExtendedSeed() {

  // ── Expenses (hr.expense.sheet + hr.expense) ─────────────────
  await batchCreate('hr.expense.sheet', [
    { id:'sheet-001', name:'Q1 Travel Expenses',    employee_id:'emp-emma',    date:'2026-03-15', total_amount:450,  payment_mode:'own_account',  state:'submit',  currency_id:'JOD' },
    { id:'sheet-002', name:'Marketing Conference',  employee_id:'emp-michael', date:'2026-03-01', total_amount:1200, payment_mode:'company_account', state:'approve', currency_id:'JOD' },
    { id:'sheet-003', name:'Office Supplies Q1',    employee_id:'emp-simon',   date:'2026-03-10', total_amount:85,   payment_mode:'own_account',  state:'draft',   currency_id:'JOD' },
  ])

  // ── POS Orders (pos.order) ────────────────────────────────────
  await batchCreate('pos.order', [
    { id:'pos-001', name:'Order 00001', session_id:'Session 1', partner_id:'partner-emma',    date_order:'2026-03-18T10:00:00', amount_total:50,   state:'paid',     currency_id:'JOD' },
    { id:'pos-002', name:'Order 00002', session_id:'Session 1', partner_id:null,              date_order:'2026-03-18T10:15:00', amount_total:120,  state:'paid',     currency_id:'JOD' },
    { id:'pos-003', name:'Order 00003', session_id:'Session 1', partner_id:'partner-michael', date_order:'2026-03-18T11:00:00', amount_total:75.5, state:'invoiced', currency_id:'JOD' },
  ])

  // ── Subscriptions (sale.subscription) ────────────────────────
  await batchCreate('sale.subscription', [
    { id:'sub-001', name:'SUB/2026/00001', partner_id:'partner-emma',       date_start:'2026-01-01', recurring_monthly:99,  next_invoice_date:'2026-04-01', stage_id:'In Progress', state:'in_progress' },
    { id:'sub-002', name:'SUB/2026/00002', partner_id:'partner-globalfood', date_start:'2026-02-01', recurring_monthly:499, next_invoice_date:'2026-04-01', stage_id:'In Progress', state:'in_progress' },
    { id:'sub-003', name:'SUB/2026/00003', partner_id:'partner-eurotrade',  date_start:'2025-06-01', recurring_monthly:99,  next_invoice_date:'2025-10-01', stage_id:'Closed',      state:'closed' },
  ])

  // ── Rental Orders (rental.order) ─────────────────────────────
  await batchCreate('rental.order', [
    { id:'rent-001', name:'RENT/2026/00001', partner_id:'partner-emma',    rental_start_date:'2026-04-01', rental_return_date:'2026-04-07', amount_total:350, state:'confirmed' },
    { id:'rent-002', name:'RENT/2026/00002', partner_id:'partner-michael', rental_start_date:'2026-03-20', rental_return_date:'2026-03-25', amount_total:180, state:'draft' },
  ])

  // ── Purchase Orders (purchase.order) ─────────────────────────
  await batchCreate('purchase.order', [
    { id:'po-001', name:'P00001', partner_id:'partner-techcorp',   date_order:'2026-03-10T09:00:00', state:'purchase',  amount_total:3400, currency_id:'JOD', order_line:[] },
    { id:'po-002', name:'P00002', partner_id:'partner-globalfood', date_order:'2026-03-15T11:00:00', state:'draft',     amount_total:850,  currency_id:'JOD', order_line:[] },
    { id:'po-003', name:'P00003', partner_id:'partner-eurotrade',  date_order:'2026-03-17T14:00:00', state:'sent',      amount_total:1200, currency_id:'JOD', order_line:[] },
    { id:'po-004', name:'P00004', partner_id:'partner-techcorp',   date_order:'2026-03-05T08:00:00', state:'done',      amount_total:2100, currency_id:'JOD', order_line:[] },
  ])

  // ── Manufacturing Orders (mrp.production) ─────────────────────
  await batchCreate('mrp.production', [
    { id:'mo-001', name:'WH/MO/00001', product_id:'prod-laptop',       product_qty:5,  product_uom_id:'Units', date_planned_start:'2026-04-01T08:00:00', state:'confirmed' },
    { id:'mo-002', name:'WH/MO/00002', product_id:'prod-server',       product_qty:2,  product_uom_id:'Units', date_planned_start:'2026-04-15T08:00:00', state:'progress' },
    { id:'mo-003', name:'WH/MO/00003', product_id:'prod-office-chair', product_qty:10, product_uom_id:'Units', date_planned_start:'2026-05-01T08:00:00', state:'draft' },
  ])

  // ── Maintenance Requests (maintenance.request) ────────────────
  await batchCreate('maintenance.request', [
    { id:'maint-001', name:'Fix HVAC Unit 2',       equipment_id:'HVAC System',     maintenance_type:'corrective', user_id:'user-admin',   stage_id:'Confirmed',    state:'confirmed' },
    { id:'maint-002', name:'Quarterly Server Check', equipment_id:'Main Server',     maintenance_type:'preventive', user_id:'user-manager', stage_id:'In Progress',  state:'confirmed' },
    { id:'maint-003', name:'Forklift Oil Change',   equipment_id:'Forklift #1',     maintenance_type:'preventive', user_id:'user-admin',   stage_id:'New',          state:'draft' },
  ])

  // ── Repair Orders (repair.order) ──────────────────────────────
  await batchCreate('repair.order', [
    { id:'repair-001', name:'WH/REP/00001', product_id:'prod-laptop', partner_id:'partner-emma',    date:'2026-03-18', amount_total:150, state:'confirmed' },
    { id:'repair-002', name:'WH/REP/00002', product_id:'prod-server', partner_id:'partner-techcorp', date:'2026-03-17', amount_total:400, state:'under_repair' },
  ])

  // ── Payslips (hr.payslip) ─────────────────────────────────────
  await batchCreate('hr.payslip', [
    { id:'slip-001', name:'Payslip - Emma Granger - March 2026',    employee_id:'emp-emma',    date_from:'2026-03-01', date_to:'2026-03-31', net_wage:1800, state:'draft' },
    { id:'slip-002', name:'Payslip - Michael Williams - March 2026',employee_id:'emp-michael', date_from:'2026-03-01', date_to:'2026-03-31', net_wage:4500, state:'done' },
    { id:'slip-003', name:'Payslip - Simon Jones - March 2026',     employee_id:'emp-simon',   date_from:'2026-03-01', date_to:'2026-03-31', net_wage:2200, state:'done' },
  ])

  // ── Job Applications (hr.applicant) ──────────────────────────
  await batchCreate('hr.applicant', [
    { id:'app-001', partner_name:'Alice Johnson',  job_id:'Software Engineer', email_from:'alice@example.com',  partner_phone:'(555)-111-1111', date_open:'2026-03-01', stage_id:'first_interview',  priority:'2', state:'first_interview' },
    { id:'app-002', partner_name:'Bob Smith',      job_id:'Product Manager',   email_from:'bob@example.com',    partner_phone:'(555)-222-2222', date_open:'2026-03-05', stage_id:'initial_qualification', priority:'1', state:'initial_qualification' },
    { id:'app-003', partner_name:'Carol Williams', job_id:'Sales Representative',email_from:'carol@example.com',partner_phone:'(555)-333-3333', date_open:'2026-03-10', stage_id:'new',              priority:'0', state:'new' },
    { id:'app-004', partner_name:'David Brown',    job_id:'Software Engineer', email_from:'david@example.com',  partner_phone:'(555)-444-4444', date_open:'2026-02-15', stage_id:'contract_signed', priority:'3', state:'contract_signed' },
  ])

  // ── Appraisals (hr.appraisal) ─────────────────────────────────
  await batchCreate('hr.appraisal', [
    { id:'appr-001', employee_id:'emp-emma',    manager_ids:['emp-michael'], date_close:'2026-03-31', rating:'good',      state:'done' },
    { id:'appr-002', employee_id:'emp-simon',   manager_ids:['emp-michael'], date_close:'2026-04-15', rating:'very_good', state:'pending' },
    { id:'appr-003', employee_id:'emp-michael', manager_ids:[],              date_close:'2026-05-01', rating:null,        state:'new' },
  ])

  // ── Attendances (hr.attendance) ───────────────────────────────
  const now = new Date()
  const today = now.toISOString().slice(0,10)
  await batchCreate('hr.attendance', [
    { id:'att-001', employee_id:'emp-emma',    check_in:`${today}T08:30:00`, check_out:`${today}T17:15:00`, worked_hours:8.75 },
    { id:'att-002', employee_id:'emp-michael', check_in:`${today}T09:00:00`, check_out:`${today}T18:00:00`, worked_hours:9.0 },
    { id:'att-003', employee_id:'emp-simon',   check_in:`${today}T08:00:00`, check_out:null,                worked_hours:null },
  ])

  // ── Fleet Vehicles (fleet.vehicle) ────────────────────────────
  await batchCreate('fleet.vehicle', [
    { id:'fleet-001', name:'Toyota Camry - ABC 1234',  driver_id:'emp-michael', model_id:'Toyota Camry',  license_plate:'ABC 1234', acquisition_date:'2023-01-15', km_last_counter:45000, state_id:'Active',   active:true },
    { id:'fleet-002', name:'Ford Transit - XYZ 5678', driver_id:'emp-emma',    model_id:'Ford Transit',  license_plate:'XYZ 5678', acquisition_date:'2022-06-01', km_last_counter:62000, state_id:'Active',   active:true },
    { id:'fleet-003', name:'Honda Civic - DEF 9012',  driver_id:'emp-simon',   model_id:'Honda Civic',   license_plate:'DEF 9012', acquisition_date:'2024-03-01', km_last_counter:12000, state_id:'Active',   active:true },
  ])

  // ── Visitors (hr.visitor / Front Desk) ───────────────────────
  await batchCreate('hr.visitor', [
    { id:'vis-001', partner_name:'John Doe',   contact_id:'emp-michael', arrival:'2026-03-18T10:00:00', departure:'2026-03-18T11:30:00', state:'checked_out' },
    { id:'vis-002', partner_name:'Sarah Lee',  contact_id:'emp-emma',    arrival:'2026-03-18T14:00:00', departure:null,                  state:'checked_in' },
    { id:'vis-003', partner_name:'Tom Harris', contact_id:'emp-simon',   arrival:'2026-03-19T09:00:00', departure:null,                  state:'planned' },
  ])

  // ── Email Campaigns (mailing.mailing) ─────────────────────────
  await batchCreate('mailing.mailing', [
    { id:'mail-001', subject:'Product Launch Newsletter',    email_from:'admin@mta.com', sent_date:'2026-03-01', sent:524, opened:201, replied:43, state:'done',   mailing_type:'mail' },
    { id:'mail-002', subject:'Q1 Customer Satisfaction Survey',email_from:'admin@mta.com', sent_date:'2026-03-10', sent:312, opened:178, replied:89, state:'done', mailing_type:'mail' },
    { id:'mail-003', subject:'Spring Promotion 2026',        email_from:'admin@mta.com', sent_date:null,          sent:0,   opened:0,   replied:0,  state:'draft', mailing_type:'mail' },
    { id:'mail-004', subject:'System Maintenance Notice',    email_from:'admin@mta.com', sent_date:null,          sent:0,   opened:0,   replied:0,  state:'in_queue', mailing_type:'sms' },
  ])

  // ── Events (event.event) ──────────────────────────────────────
  await batchCreate('event.event', [
    { id:'evt-001', name:'Odoo 19 Launch Webinar', date_begin:'2026-04-10T14:00:00', date_end:'2026-04-10T16:00:00', seats_taken:120, seats_available:80,  state:'confirm' },
    { id:'evt-002', name:'ERP Training Day',       date_begin:'2026-05-01T09:00:00', date_end:'2026-05-01T17:00:00', seats_taken:25,  seats_available:75,  state:'draft' },
    { id:'evt-003', name:'Annual Tech Conference', date_begin:'2026-06-15T09:00:00', date_end:'2026-06-17T17:00:00', seats_taken:450, seats_available:550, state:'confirm' },
  ])

  // ── Surveys (survey.survey) ───────────────────────────────────
  await batchCreate('survey.survey', [
    { id:'surv-001', title:'Employee Satisfaction Survey 2026', question_count:15, user_input_count:45, avg_score:7.8, state:'closed' },
    { id:'surv-002', title:'Product Feedback Form',             question_count:8,  user_input_count:23, avg_score:8.2, state:'open' },
    { id:'surv-003', title:'Training Effectiveness Assessment', question_count:12, user_input_count:0,  avg_score:0,   state:'draft' },
  ])

  // ── Helpdesk Tickets (helpdesk.ticket) ───────────────────────
  await batchCreate('helpdesk.ticket', [
    { id:'hd-001', name:'Cannot login to ERP system',  team_id:'Support',     user_id:'user-admin',   partner_id:'partner-emma',    priority:'2', stage_id:'in_progress', state:'in_progress' },
    { id:'hd-002', name:'Invoice not sending via email',team_id:'Accounting', user_id:'user-manager', partner_id:'partner-michael', priority:'3', stage_id:'new',          state:'new' },
    { id:'hd-003', name:'Report generation is slow',   team_id:'IT',          user_id:'user-admin',   partner_id:'partner-simon',   priority:'1', stage_id:'done',         state:'done' },
    { id:'hd-004', name:'New employee onboarding help',team_id:'HR',          user_id:'user-manager', partner_id:null,              priority:'0', stage_id:'new',          state:'new' },
  ])

  // ── Timesheets (account.analytic.line) ────────────────────────
  await batchCreate('account.analytic.line', [
    { id:'ts-001', employee_id:'emp-emma',    project_id:'proj-erp-impl', task_id:'task-002', date:'2026-03-18', name:'User training session', unit_amount:3.5 },
    { id:'ts-002', employee_id:'emp-simon',   project_id:'proj-erp-impl', task_id:'task-003', date:'2026-03-18', name:'Sales module config',   unit_amount:4.0 },
    { id:'ts-003', employee_id:'emp-michael', project_id:'proj-website',  task_id:'task-006', date:'2026-03-17', name:'Homepage review',        unit_amount:2.0 },
    { id:'ts-004', employee_id:'emp-emma',    project_id:'proj-erp-impl', task_id:'task-004', date:'2026-03-17', name:'Invoice workflow docs',  unit_amount:3.0 },
  ])

  // ── Planning Slots (planning.slot) ────────────────────────────
  await batchCreate('planning.slot', [
    { id:'plan-001', resource_id:'emp-emma',    role_id:'Developer', start_datetime:'2026-03-25T09:00:00', end_datetime:'2026-03-25T17:00:00', allocated_hours:8, state:'published' },
    { id:'plan-002', resource_id:'emp-simon',   role_id:'Developer', start_datetime:'2026-03-25T09:00:00', end_datetime:'2026-03-25T17:00:00', allocated_hours:8, state:'published' },
    { id:'plan-003', resource_id:'emp-michael', role_id:'Manager',   start_datetime:'2026-03-26T10:00:00', end_datetime:'2026-03-26T12:00:00', allocated_hours:2, state:'draft' },
  ])

  // ── Calendar Events (calendar.event) ─────────────────────────
  await batchCreate('calendar.event', [
    { id:'cal-001', name:'Team Sync',           start:'2026-03-19T10:00:00', stop:'2026-03-19T11:00:00', location:'Conference Room A', allday:false },
    { id:'cal-002', name:'ERP Demo Presentation',start:'2026-03-20T14:00:00',stop:'2026-03-20T15:30:00', location:'Online - Zoom',    allday:false },
    { id:'cal-003', name:'Company Holiday',      start:'2026-04-01T00:00:00', stop:'2026-04-01T23:59:00', location:'',               allday:true },
    { id:'cal-004', name:'Q1 Review',            start:'2026-03-31T09:00:00', stop:'2026-03-31T12:00:00', location:'Board Room',      allday:false },
  ])

  // ── Sign Requests (sign.request) ──────────────────────────────
  await batchCreate('sign.request', [
    { id:'sign-001', reference:'NDA - TechCorp Solutions', template_id:'Non-Disclosure Agreement', create_date:'2026-03-15', state:'sent' },
    { id:'sign-002', reference:'Employment Contract - E. Granger', template_id:'Employment Contract', create_date:'2026-03-10', state:'signed' },
    { id:'sign-003', reference:'Service Agreement - EuroTrade', template_id:'Service Agreement', create_date:'2026-03-18', state:'sent' },
  ])

  // ── Knowledge Articles (knowledge.article) ───────────────────
  await batchCreate('knowledge.article', [
    { id:'art-001', name:'ERP Getting Started Guide',  parent_id:null, is_published:true,  last_edition_date:'2026-03-10', body:'Welcome to Innovation ERP...' },
    { id:'art-002', name:'How to Create a Sales Order', parent_id:null, is_published:true, last_edition_date:'2026-03-12', body:'Step 1: Navigate to Sales...' },
    { id:'art-003', name:'Invoice Management',          parent_id:null, is_published:true, last_edition_date:'2026-03-14', body:'Learn how to manage invoices...' },
    { id:'art-004', name:'HR Policies 2026',            parent_id:null, is_published:false, last_edition_date:'2026-03-18', body:'Draft HR policies...' },
  ])

  // ── Social Posts (social.post) ────────────────────────────────
  await batchCreate('social.post', [
    { id:'soc-001', message:'🚀 Exciting news! Our new ERP system is now live!', account_ids:['LinkedIn','Twitter'], scheduled_date:'2026-03-15T10:00:00', state:'posted' },
    { id:'soc-002', message:'Join us for our upcoming webinar on Odoo 19 features.', account_ids:['LinkedIn','Facebook'], scheduled_date:'2026-04-05T14:00:00', state:'scheduled' },
    { id:'soc-003', message:'Spring promotion — 20% off all services!', account_ids:['Instagram','Twitter'], scheduled_date:null, state:'draft' },
  ])

  // ── Marketing Campaigns (marketing.campaign) ──────────────────
  await batchCreate('marketing.campaign', [
    { id:'mcmp-001', name:'Lead Nurture Campaign',    model_id:'crm.lead',     total_participant_count:45, state:'running' },
    { id:'mcmp-002', name:'Onboarding Email Sequence', model_id:'res.partner', total_participant_count:12, state:'running' },
    { id:'mcmp-003', name:'Win-Back Campaign',         model_id:'sale.subscription', total_participant_count:0, state:'draft' },
  ])

  // ── Lunch Orders (lunch.order) ────────────────────────────────
  await batchCreate('lunch.order', [
    { id:'lunch-001', user_id:'emp-emma',    product_id:'Cheese Burger',  supplier_id:'Office Cafe', date:'2026-03-18', price:8.5,  state:'confirmed' },
    { id:'lunch-002', user_id:'emp-simon',   product_id:'Caesar Salad',   supplier_id:'Office Cafe', date:'2026-03-18', price:6.0,  state:'ordered' },
    { id:'lunch-003', user_id:'emp-michael', product_id:'Chicken Wrap',   supplier_id:'Office Cafe', date:'2026-03-18', price:7.5,  state:'new' },
  ])

  console.info('[Seed] Extended seed complete — 47 modules loaded')
}
