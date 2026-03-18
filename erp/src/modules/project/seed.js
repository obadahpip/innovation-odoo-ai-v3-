/**
 * Project seed data — 2 projects, 12 tasks, task stages
 */
const D = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString()

export const TASK_STAGES = [
  { id:'tstage-todo',        name:'To Do',       sequence:1, fold:false },
  { id:'tstage-inprogress',  name:'In Progress', sequence:2, fold:false },
  { id:'tstage-review',      name:'In Review',   sequence:3, fold:false },
  { id:'tstage-done',        name:'Done',        sequence:4, fold:true  },
  { id:'tstage-cancelled',   name:'Cancelled',   sequence:5, fold:true  },
]

export const PROJECTS = [
  {
    id:'proj-001', name:'Innovation ERP Implementation', display_name:'Innovation ERP Implementation',
    user_id:'user-admin', partner_id:'partner-acme',
    date_start: D(60), date: D(-90),
    description:'Full ERP implementation for Acme Corp.',
    last_update_status:'on_track', priority:'1',
    privacy_visibility:'employees', active:true,
    color:0, task_count:8,
  },
  {
    id:'proj-002', name:'Website Redesign 2025', display_name:'Website Redesign 2025',
    user_id:'user-admin', partner_id:'partner-delta',
    date_start: D(30), date: D(-30),
    description:'Complete overhaul of the corporate website.',
    last_update_status:'at_risk', priority:'0',
    privacy_visibility:'employees', active:true,
    color:2, task_count:4,
  },
]

export const TASKS = [
  // ── Project 1 tasks ──────────────────────────────────────
  {
    id:'task-001', name:'Requirements gathering & stakeholder interviews',
    project_id:'proj-001', stage_id:'tstage-done',
    user_id:'user-admin', assigned_to:'emp-001',
    priority:'1', date_deadline: D(50),
    description:'Interview all department heads and document requirements.',
    tag_ids:['tag-analysis'], active:true,
  },
  {
    id:'task-002', name:'Database schema design',
    project_id:'proj-001', stage_id:'tstage-done',
    user_id:'user-admin', assigned_to:'emp-003',
    priority:'2', date_deadline: D(42),
    description:'Design all models and relationships.',
    tag_ids:['tag-backend'], active:true,
  },
  {
    id:'task-003', name:'ERP shell & navigation components',
    project_id:'proj-001', stage_id:'tstage-done',
    user_id:'user-admin', assigned_to:'emp-003',
    priority:'2', date_deadline: D(35),
    description:'TopNavbar, Sidebar, ActionBar, Chatter.',
    tag_ids:['tag-frontend'], active:true,
  },
  {
    id:'task-004', name:'Core module development — CRM & Sales',
    project_id:'proj-001', stage_id:'tstage-inprogress',
    user_id:'user-admin', assigned_to:'emp-003',
    priority:'3', date_deadline: D(14),
    description:'Full CRM pipeline and Sales quotation flow.',
    tag_ids:['tag-backend','tag-frontend'], active:true,
  },
  {
    id:'task-005', name:'HR module — Employees & Payroll',
    project_id:'proj-001', stage_id:'tstage-inprogress',
    user_id:'user-admin', assigned_to:'emp-004',
    priority:'2', date_deadline: D(10),
    description:'Employee directory, org chart, payroll calculation.',
    tag_ids:['tag-backend'], active:true,
  },
  {
    id:'task-006', name:'User acceptance testing — Phase 1',
    project_id:'proj-001', stage_id:'tstage-todo',
    user_id:'user-admin', assigned_to:'emp-005',
    priority:'2', date_deadline: D(0),
    description:'Test all Phase 1 deliverables with the client.',
    tag_ids:['tag-qa'], active:true,
  },
  {
    id:'task-007', name:'Performance optimisation — virtual scrolling',
    project_id:'proj-001', stage_id:'tstage-todo',
    user_id:'user-admin', assigned_to:'emp-007',
    priority:'1', date_deadline: D(-7),
    description:'Implement virtual scrolling for lists > 100 rows.',
    tag_ids:['tag-performance'], active:true,
  },
  {
    id:'task-008', name:'Go-live preparation & data migration',
    project_id:'proj-001', stage_id:'tstage-todo',
    user_id:'user-admin', assigned_to:'emp-001',
    priority:'3', date_deadline: D(-20),
    description:'Migrate production data and deploy to server.',
    tag_ids:['tag-deployment'], active:true,
  },

  // ── Project 2 tasks ──────────────────────────────────────
  {
    id:'task-009', name:'Wireframes & design mockups',
    project_id:'proj-002', stage_id:'tstage-done',
    user_id:'user-admin', assigned_to:'emp-006',
    priority:'1', date_deadline: D(20),
    description:'Figma wireframes for all main pages.',
    tag_ids:['tag-design'], active:true,
  },
  {
    id:'task-010', name:'Homepage & hero section development',
    project_id:'proj-002', stage_id:'tstage-inprogress',
    user_id:'user-admin', assigned_to:'emp-004',
    priority:'2', date_deadline: D(5),
    description:'Implement the new homepage design.',
    tag_ids:['tag-frontend'], active:true,
  },
  {
    id:'task-011', name:'SEO audit and meta tag optimisation',
    project_id:'proj-002', stage_id:'tstage-review',
    user_id:'user-admin', assigned_to:'emp-006',
    priority:'1', date_deadline: D(2),
    description:'Review all pages for SEO compliance.',
    tag_ids:['tag-seo'], active:true,
  },
  {
    id:'task-012', name:'Launch & post-launch monitoring',
    project_id:'proj-002', stage_id:'tstage-todo',
    user_id:'user-admin', assigned_to:'emp-005',
    priority:'2', date_deadline: D(-15),
    description:'Deploy to production and monitor analytics.',
    tag_ids:['tag-deployment'], active:true,
  },
]
