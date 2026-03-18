/**
 * odoo19_fields.js
 * 
 * Canonical field names extracted from Odoo 19.0 GitHub source.
 * Use this as the reference when building seed data and form components.
 * 
 * Sources:
 *   github.com/odoo/odoo/blob/19.0/addons/crm/models/crm_lead.py
 *   github.com/odoo/odoo/blob/19.0/addons/sale/models/sale_order.py
 *   github.com/odoo/odoo/blob/19.0/addons/account/models/account_move.py
 *   github.com/odoo/odoo/blob/19.0/addons/hr/models/hr_employee.py
 *   github.com/odoo/odoo/blob/19.0/addons/project/models/project.py
 *   github.com/odoo/odoo/blob/19.0/addons/product/models/product_template.py
 *   github.com/odoo/odoo/blob/19.0/addons/hr_holidays/models/hr_leave.py
 *   github.com/odoo/odoo/blob/19.0/addons/base/models/res_partner.py
 *   github.com/odoo/odoo/blob/19.0/addons/base/models/res_users.py
 */

// ── crm.lead ─────────────────────────────────────────────────────
export const CRM_LEAD = {
  model:  'crm.lead',
  fields: {
    name:             'Char   — Opportunity / Lead Name',
    partner_id:       'Many2one(res.partner) — Customer/Contact',
    partner_name:     'Char   — Company Name (if no partner_id)',
    contact_name:     'Char   — Contact Person Name',
    email_from:       'Char   — Email',
    phone:            'Char   — Phone',
    mobile:           'Char   — Mobile',
    stage_id:         'Many2one(crm.stage) — Pipeline Stage',
    user_id:          'Many2one(res.users) — Salesperson',
    team_id:          'Many2one(crm.team) — Sales Team',
    type:             "Selection [('lead','Lead'),('opportunity','Opportunity')]",
    priority:         "Selection [('0','Normal'),('1','Low'),('2','High'),('3','Very High')] — Stars",
    probability:      'Float — Win Probability 0-100',
    expected_revenue: 'Monetary — Expected Revenue',
    prorated_revenue: 'Monetary — Prorated Revenue (computed)',
    tag_ids:          'Many2many(crm.lead.tag) — Tags',
    date_deadline:    'Date — Expected Closing',
    date_closed:      'Datetime — Closed Date (readonly)',
    date_open:        'Datetime — Assigned (readonly)',
    active:           'Boolean — default True',
    lost_reason_id:   'Many2one(crm.lost.reason)',
    kanban_state:     "Selection [('normal','On Track'),('done','Ready'),('blocked','Blocked')]",
    description:      'Html — Notes',
    company_id:       'Many2one(res.company)',
  },
  // Kanban stages (crm.stage records)
  default_stages: [
    { id:'crm-stage-new',         name:'New',          sequence:1,  probability:10, fold:false },
    { id:'crm-stage-qualified',   name:'Qualified',    sequence:2,  probability:25, fold:false },
    { id:'crm-stage-proposition', name:'Proposition',  sequence:3,  probability:50, fold:false },
    { id:'crm-stage-won',         name:'Won',          sequence:4,  probability:100, fold:true  },
  ],
}

// ── sale.order ───────────────────────────────────────────────────
export const SALE_ORDER = {
  model:  'sale.order',
  fields: {
    name:             'Char  — Order Reference (e.g. S00001)',
    state:            "Selection [('draft','Quotation'),('sent','Quotation Sent'),('sale','Sales Order'),('done','Locked'),('cancel','Cancelled')]",
    partner_id:       'Many2one(res.partner) — Customer',
    partner_invoice_id:  'Many2one(res.partner)',
    partner_shipping_id: 'Many2one(res.partner)',
    date_order:       'Datetime — Order Date',
    validity_date:    'Date — Expiration',
    pricelist_id:     'Many2one(product.pricelist)',
    payment_term_id:  'Many2one(account.payment.term)',
    order_line:       'One2many(sale.order.line,order_id) — Order Lines',
    user_id:          'Many2one(res.users) — Salesperson',
    team_id:          'Many2one(crm.team)',
    note:             'Html — Terms and Conditions',
    amount_untaxed:   'Monetary (computed)',
    amount_tax:       'Monetary (computed)',
    amount_total:     'Monetary (computed)',
    currency_id:      'Many2one(res.currency)',
    company_id:       'Many2one(res.company)',
    client_order_ref: 'Char — Customer Reference',
    origin:           'Char — Source Document',
  },
}

// ── sale.order.line ──────────────────────────────────────────────
export const SALE_ORDER_LINE = {
  model: 'sale.order.line',
  fields: {
    order_id:        'Many2one(sale.order)',
    name:            'Text — Description',
    product_id:      'Many2one(product.product)',
    product_uom_qty: 'Float — Ordered Qty',
    product_uom:     'Many2one(uom.uom)',
    price_unit:      'Float — Unit Price',
    discount:        'Float — Discount %',
    tax_id:          'Many2many(account.tax)',
    price_subtotal:  'Monetary (computed)',
    price_total:     'Monetary (computed)',
    display_type:    "Selection [('line_section','Section'),('line_note','Note')] — for section/note lines",
    sequence:        'Integer',
  },
}

// ── res.partner (Contacts) ───────────────────────────────────────
export const RES_PARTNER = {
  model:  'res.partner',
  fields: {
    name:            'Char — Full Name',
    is_company:      'Boolean',
    company_type:    "Selection [('person','Individual'),('company','Company')]",
    parent_id:       'Many2one(res.partner) — Company',
    company_name:    'Char — Company Name (if individual)',
    email:           'Char',
    phone:           'Char',
    mobile:          'Char',
    website:         'Char',
    street:          'Char',
    street2:         'Char',
    city:            'Char',
    state_id:        'Many2one(res.country.state)',
    zip:             'Char',
    country_id:      'Many2one(res.country)',
    vat:             'Char — Tax ID',
    function:        'Char — Job Position',
    title:           'Many2one(res.partner.title)',
    lang:            'Char — Language code (e.g. en_US)',
    user_id:         'Many2one(res.users) — Salesperson',
    tag_ids:         'Many2many(res.partner.category) — Tags',
    customer_rank:   'Integer — Is Customer if > 0',
    supplier_rank:   'Integer — Is Vendor if > 0',
    child_ids:       'One2many(res.partner,parent_id) — Contacts',
    image_1920:      'Binary — Photo',
    active:          'Boolean',
    comment:         'Html — Notes',
  },
}

// ── hr.employee ──────────────────────────────────────────────────
export const HR_EMPLOYEE = {
  model:  'hr.employee',
  fields: {
    name:                'Char — Employee Name',
    job_id:              'Many2one(hr.job) — Job Position',
    job_title:           'Char — Job Title',
    department_id:       'Many2one(hr.department)',
    parent_id:           'Many2one(hr.employee) — Manager',
    coach_id:            'Many2one(hr.employee) — Coach',
    work_email:          'Char',
    work_phone:          'Char',
    mobile_phone:        'Char',
    work_location_id:    'Many2one(hr.work.location)',
    resource_calendar_id:'Many2one(resource.calendar) — Working Hours',
    user_id:             'Many2one(res.users) — Related User',
    company_id:          'Many2one(res.company)',
    active:              'Boolean',
    category_ids:        'Many2many(hr.employee.category) — Tags',
    image_1920:          'Binary — Photo',
    gender:              "Selection [('male','Male'),('female','Female'),('other','Other')]",
    birthday:            'Date',
    private_email:       'Char',
    country_id:          'Many2one(res.country) — Nationality',
    identification_id:   'Char — ID Card Number',
    passport_id:         'Char — Passport Number',
    emergency_contact:   'Char',
    emergency_phone:     'Char',
    study_field:         'Char — Field of Study',
    study_school:        'Char — School',
    children:            'Integer — Number of Dependent Children',
    marital:             "Selection [('single','Single'),('married','Married'),('cohabitant','Legal Cohabitant'),('widower','Widower'),('divorced','Divorced')]",
    bank_account_id:     'Many2one(res.partner.bank)',
  },
}

// ── hr.department ────────────────────────────────────────────────
export const HR_DEPARTMENT = {
  model:  'hr.department',
  fields: {
    name:        'Char',
    manager_id:  'Many2one(hr.employee)',
    parent_id:   'Many2one(hr.department)',
    child_ids:   'One2many(hr.department,parent_id)',
    company_id:  'Many2one(res.company)',
    note:        'Text',
    jobs_ids:    'One2many(hr.job,department_id)',
    active:      'Boolean',
  },
}

// ── account.move ─────────────────────────────────────────────────
export const ACCOUNT_MOVE = {
  model:  'account.move',
  fields: {
    name:                    'Char — Invoice/Bill Number (e.g. INV/2026/00001)',
    move_type:               "Selection [('entry','Journal Entry'),('out_invoice','Customer Invoice'),('out_refund','Customer Credit Note'),('in_invoice','Vendor Bill'),('in_refund','Vendor Credit Note'),('out_receipt','Sales Receipt'),('in_receipt','Purchase Receipt')]",
    state:                   "Selection [('draft','Draft'),('posted','Posted'),('cancel','Cancelled')]",
    payment_state:           "Selection [('not_paid','Not Paid'),('in_payment','In Payment'),('paid','Paid'),('partial','Partial'),('reversed','Reversed')]",
    partner_id:              'Many2one(res.partner) — Customer/Vendor',
    invoice_date:            'Date — Invoice Date',
    invoice_date_due:        'Date — Due Date',
    invoice_payment_term_id: 'Many2one(account.payment.term)',
    invoice_line_ids:        'One2many(account.move.line,move_id) — Invoice Lines (product lines only)',
    line_ids:                'One2many(account.move.line,move_id) — All Journal Items',
    journal_id:              'Many2one(account.journal)',
    currency_id:             'Many2one(res.currency)',
    amount_untaxed:          'Monetary (computed)',
    amount_tax:              'Monetary (computed)',
    amount_total:            'Monetary (computed)',
    amount_residual:         'Monetary — Amount Due (computed)',
    invoice_origin:          'Char — Source Document',
    narration:               'Html — Terms and Conditions',
    ref:                     'Char — Payment Reference',
    invoice_user_id:         'Many2one(res.users) — Salesperson',
    invoice_sent:            'Boolean',
    company_id:              'Many2one(res.company)',
  },
}

// ── account.move.line ────────────────────────────────────────────
export const ACCOUNT_MOVE_LINE = {
  model:  'account.move.line',
  fields: {
    move_id:       'Many2one(account.move)',
    name:          'Char — Label/Description',
    account_id:    'Many2one(account.account)',
    partner_id:    'Many2one(res.partner)',
    product_id:    'Many2one(product.product)',
    product_uom_id:'Many2one(uom.uom)',
    quantity:      'Float',
    price_unit:    'Float',
    discount:      'Float — Discount %',
    tax_ids:       'Many2many(account.tax)',
    price_subtotal:'Monetary (computed)',
    price_total:   'Monetary (computed)',
    balance:       'Monetary',
    display_type:  "Selection [('product','Product'),('line_section','Section'),('line_note','Note'),('payment_term','Payment Term')]",
    sequence:      'Integer',
    date:          'Date (from move)',
    currency_id:   'Many2one(res.currency)',
  },
}

// ── project.project ──────────────────────────────────────────────
export const PROJECT_PROJECT = {
  model:  'project.project',
  fields: {
    name:                'Char',
    user_id:             'Many2one(res.users) — Project Manager',
    partner_id:          'Many2one(res.partner) — Customer',
    date:                'Date — Deadline',
    date_start:          'Date — Start Date',
    description:         'Html',
    active:              'Boolean',
    sequence:            'Integer',
    color:               'Integer — Kanban Color (0-11)',
    alias_name:          'Char — Email Alias',
    privacy_visibility:  "Selection [('followers','Invited internal users'),('employees','All internal users'),('portal','Portal users and all internal users')]",
    last_update_status:  "Selection [('on_track','On Track'),('at_risk','At Risk'),('off_track','Off Track'),('on_hold','On Hold'),('done','Done')]",
    last_update_id:      'Many2one(project.update)',
    task_count:          'Integer (computed)',
    tag_ids:             'Many2many(project.tags)',
    company_id:          'Many2one(res.company)',
    analytic_account_id: 'Many2one(account.analytic.account)',
    rating_active:       'Boolean',
    allow_timesheets:    'Boolean',
    billable_type:       "Selection [('no','Not Billable'),('task_rate','Task Rate'),('project_rate','Project Rate')]",
  },
}

// ── project.task ─────────────────────────────────────────────────
export const PROJECT_TASK = {
  model:  'project.task',
  fields: {
    name:           'Char — Task Title',
    description:    'Html',
    project_id:     'Many2one(project.project)',
    stage_id:       'Many2one(project.task.type) — Stage',
    user_ids:       'Many2many(res.users) — Assignees',
    date_deadline:  'Datetime — Deadline',
    date_assign:    'Datetime — Assignment Date (readonly)',
    date_end:       'Datetime — Date Closed (readonly)',
    priority:       "Selection [('0','Normal'),('1','High')] — default '0'",
    kanban_state:   "Selection [('normal','In Progress'),('done','Ready for Next Stage'),('blocked','Blocked')]",
    tag_ids:        'Many2many(project.tags)',
    child_ids:      'One2many(project.task,parent_id) — Sub-tasks',
    parent_id:      'Many2one(project.task)',
    depend_on_ids:  'Many2many(project.task) — Blocked by',
    active:         'Boolean',
    company_id:     'Many2one(res.company)',
    sequence:       'Integer',
    partner_id:     'Many2one(res.partner) — Customer',
    email_from:     'Char',
    timesheet_ids:  'One2many(account.analytic.line,task_id)',
    planned_hours:  'Float — Initially Planned Hours',
    effective_hours:'Float (computed)',
  },
}

// ── project.task.type (Stage) ────────────────────────────────────
export const PROJECT_TASK_TYPE = {
  model:  'project.task.type',
  fields: {
    name:            'Char',
    description:     'Text',
    sequence:        'Integer',
    fold:            'Boolean — Folded in Kanban',
    project_ids:     'Many2many(project.project) — Projects',
    mail_template_id:'Many2one(mail.template)',
    rating_template_id: 'Many2one(mail.template)',
    auto_validation_kanban_state: 'Boolean',
  },
}

// ── product.template ─────────────────────────────────────────────
export const PRODUCT_TEMPLATE = {
  model:  'product.template',
  fields: {
    name:            'Char',
    description:     'Text',
    description_sale:'Text — Sales Description',
    description_purchase: 'Text — Purchase Description',
    type:            "Selection [('consu','Consumable'),('service','Service'),('product','Storable')] — Product Type",
    categ_id:        'Many2one(product.category) — Internal Category',
    list_price:      'Float — Sales Price',
    standard_price:  'Float — Cost (property, per company)',
    uom_id:          'Many2one(uom.uom) — Unit of Measure',
    uom_po_id:       'Many2one(uom.uom) — Purchase UoM',
    taxes_id:        'Many2many(account.tax) — Customer Taxes',
    supplier_taxes_id: 'Many2many(account.tax) — Vendor Taxes',
    active:          'Boolean',
    sale_ok:         'Boolean — Can be Sold',
    purchase_ok:     'Boolean — Can be Purchased',
    image_1920:      'Binary — Photo',
    barcode:         'Char',
    default_code:    'Char — Internal Reference',
    weight:          'Float',
    volume:          'Float',
    company_id:      'Many2one(res.company)',
    tracking:        "Selection [('none','No Tracking'),('lot','By Lot'),('serial','By SN')]",
    route_ids:       'Many2many(stock.route)',
    qty_available:   'Float (computed) — On Hand',
    virtual_available: 'Float (computed) — Forecasted',
    invoice_policy:  "Selection [('order','Ordered Quantities'),('delivery','Delivered Quantities')]",
    purchase_method: "Selection [('purchase','Based on PO'),('receive','Based on Receipts')]",
    responsible_id:  'Many2one(res.users)',
  },
}

// ── hr.leave (Time Off Request) ──────────────────────────────────
export const HR_LEAVE = {
  model:  'hr.leave',
  fields: {
    name:             'Char — Description',
    employee_id:      'Many2one(hr.employee)',
    holiday_status_id:'Many2one(hr.leave.type) — Time Off Type',
    date_from:        'Datetime — Start Date',
    date_to:          'Datetime — End Date',
    number_of_days:   'Float (computed)',
    state:            "Selection [('draft','To Submit'),('confirm','To Approve'),('refuse','Refused'),('validate1','Second Approval'),('validate','Approved'),('cancel','Cancelled')]",
    active:           'Boolean',
    holiday_type:     "Selection [('employee','By Employee'),('company','By Company'),('department','By Department'),('category','By Employee Tag')]",
    department_id:    'Many2one(hr.department)',
    notes:            'Text',
    payslip_state:    "Selection [('normal','To Do'),('done','Done')]",
    private_name:     'Char',
  },
}

// ── hr.leave.type ────────────────────────────────────────────────
export const HR_LEAVE_TYPE = {
  model: 'hr.leave.type',
  fields: {
    name:             'Char',
    time_type:        "Selection [('leave','Time Off'),('other','Other')]",
    allocation_type:  "Selection [('no','No Limit'),('fixed_by_hr','Fixed by HR'),('fixed','Fixed by HR and Employee')]",
    leave_validation_type: "Selection [('no_validation','No validation'),('hr','Time Off Officer'),('manager','Employee's Approver'),('both','Time Off Officer and Employee's Approver')]",
    company_id:       'Many2one(res.company)',
    color_name:       "Selection [('red','Red'),...]",
    max_leaves:       'Float (computed)',
    leaves_taken:     'Float (computed)',
    remaining_leaves: 'Float (computed)',
    request_type:     "Selection [('both','By Employee and by Company'), ...]",
  },
}

// ── res.users ────────────────────────────────────────────────────
export const RES_USERS = {
  model: 'res.users',
  fields: {
    name:        'Char',
    login:       'Char — Username',
    email:       'Char (from partner_id)',
    partner_id:  'Many2one(res.partner)',
    company_id:  'Many2one(res.company)',
    company_ids: 'Many2many(res.company)',
    groups_id:   'Many2many(res.groups)',
    active:      'Boolean',
    lang:        'Char — Language',
    tz:          'Char — Timezone (e.g. Asia/Amman)',
    image_1920:  'Binary',
    share:       'Boolean (computed) — True if portal/public',
    signature:   'Html',
  },
}

export default {
  CRM_LEAD, SALE_ORDER, SALE_ORDER_LINE,
  RES_PARTNER, HR_EMPLOYEE, HR_DEPARTMENT,
  ACCOUNT_MOVE, ACCOUNT_MOVE_LINE,
  PROJECT_PROJECT, PROJECT_TASK, PROJECT_TASK_TYPE,
  PRODUCT_TEMPLATE, HR_LEAVE, HR_LEAVE_TYPE, RES_USERS,
}
