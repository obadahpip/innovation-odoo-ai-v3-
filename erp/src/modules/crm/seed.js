/**
 * CRM seed data — 12 leads spread across 5 pipeline stages
 * 3 won, 2 lost, rest active
 */

const D = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString()

export default [
  // ── New ───────────────────────────────────────────────────────
  {
    id:'lead-001', name:'Cloud Infrastructure Upgrade', stage_id:'stage-new',
    partner_name:'Acme Corp', partner_id:'partner-acme',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:45000, probability:10, priority:'1',
    email_from:'john.miller@acme.com', phone:'+1 212 555 0201',
    description:'Interested in migrating their on-premise servers to cloud.',
    active:true, date_deadline: D(-7), create_date: D(14),
    tag_ids:['tag-cloud','tag-enterprise'],
  },
  {
    id:'lead-002', name:'ERP Implementation', stage_id:'stage-new',
    partner_name:'Delta Technologies', partner_id:'partner-delta',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:120000, probability:15, priority:'2',
    email_from:'s.chen@delta-tech.com', phone:'+1 415 555 0202',
    description:'Full ERP rollout for 200 users.',
    active:true, date_deadline: D(-3), create_date: D(10),
    tag_ids:['tag-enterprise'],
  },

  // ── Qualified ─────────────────────────────────────────────────
  {
    id:'lead-003', name:'Annual Software License', stage_id:'stage-qualified',
    partner_name:'Global Imports LLC', partner_id:'partner-global',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:28000, probability:30, priority:'1',
    email_from:'j.wilson@globalimports.com', phone:'+44 20 5555 0203',
    description:'Renewal and upgrade of their existing license.',
    active:true, date_deadline: D(5), create_date: D(20),
    tag_ids:['tag-renewal'],
  },
  {
    id:'lead-004', name:'Custom Development Project', stage_id:'stage-qualified',
    partner_name:'Nexus Solutions', partner_id:'partner-nexus',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:75000, probability:35, priority:'3',
    email_from:'emily@nexus.io', phone:'+1 310 555 0204',
    description:'Bespoke module development for supply chain automation.',
    active:true, date_deadline: D(12), create_date: D(18),
    tag_ids:['tag-dev','tag-enterprise'],
  },
  {
    id:'lead-005', name:'Security Audit & Compliance', stage_id:'stage-qualified',
    partner_name:'Horizon Ventures', partner_id:'partner-horizon',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:18000, probability:40, priority:'2',
    email_from:'marco@horizonv.com', phone:'+49 30 5555 0205',
    description:'ISO 27001 compliance consulting.',
    active:true, date_deadline: D(8), create_date: D(25),
    tag_ids:['tag-consulting'],
  },

  // ── Proposition ───────────────────────────────────────────────
  {
    id:'lead-006', name:'Data Analytics Platform', stage_id:'stage-proposition',
    partner_name:'Solar Energy Co', partner_id:'partner-solar',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:55000, probability:55, priority:'2',
    email_from:'a.petrov@solar.com', phone:'+1 602 555 0206',
    description:'BI dashboard and real-time monitoring solution.',
    active:true, date_deadline: D(3), create_date: D(30),
    tag_ids:['tag-analytics'],
  },
  {
    id:'lead-007', name:'HR Management System', stage_id:'stage-proposition',
    partner_name:'Apex Industries', partner_id:'partner-apex',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:32000, probability:60, priority:'1',
    email_from:'c.mendez@apex.com', phone:'+1 713 555 0207',
    description:'Full HR module with payroll integration.',
    active:true, date_deadline: D(1), create_date: D(35),
    tag_ids:['tag-hr'],
  },

  // ── Won ───────────────────────────────────────────────────────
  {
    id:'lead-008', name:'Inventory Optimization', stage_id:'stage-won',
    partner_name:'Nordic Supplies AB', partner_id:'partner-nordic',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:41000, probability:100, priority:'2',
    email_from:'order@nordic.se', phone:'+46 8 5555 0108',
    description:'Warehouse management and stock optimization.',
    active:true, date_deadline: D(-10), create_date: D(45),
    tag_ids:['tag-inventory'],
  },
  {
    id:'lead-009', name:'E-Commerce Integration', stage_id:'stage-won',
    partner_name:'Raj Patel', partner_id:'partner-raj',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:22000, probability:100, priority:'1',
    email_from:'raj.patel@company.in', phone:'+91 22 5555 0307',
    description:'Integration with Shopify and WooCommerce.',
    active:true, date_deadline: D(-5), create_date: D(50),
    tag_ids:['tag-ecommerce'],
  },
  {
    id:'lead-010', name:'Training & Support Package', stage_id:'stage-won',
    partner_name:'Alice Fontaine', partner_id:'partner-alice',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:8500, probability:100, priority:'0',
    email_from:'alice@fontaine.fr', phone:'+33 1 5555 0308',
    description:'12-month support and training package.',
    active:true, date_deadline: D(-2), create_date: D(55),
    tag_ids:['tag-support'],
  },

  // ── Lost ──────────────────────────────────────────────────────
  {
    id:'lead-011', name:'Mobile App Development', stage_id:'stage-lost',
    partner_name:'Lisa Park', partner_id:'partner-lisa',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:60000, probability:0, priority:'2',
    email_from:'lisa.park@gmail.com', phone:'+1 650 555 0301',
    description:'iOS and Android app — lost to competitor.',
    active:false, lost_reason:'Price too high', date_deadline: D(-20), create_date: D(60),
    tag_ids:[],
  },
  {
    id:'lead-012', name:'Website Redesign', stage_id:'stage-lost',
    partner_name:'David Kim', partner_id:'partner-david',
    user_id:'user-admin', team_id:'team-sales',
    expected_revenue:15000, probability:0, priority:'1',
    email_from:'david.kim@outlook.com', phone:'+1 617 555 0302',
    description:'Full website overhaul — prospect went in-house.',
    active:false, lost_reason:'No budget', date_deadline: D(-15), create_date: D(65),
    tag_ids:[],
  },
]
