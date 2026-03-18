/**
 * Users seed data — 3 users with access levels
 */
export default [
  {
    id:'user-admin',
    name:'Admin User',
    login:'admin@innovation-corp.com',
    email:'admin@innovation-corp.com',
    active:true,
    groups_id:['base.group_user','base.group_system','base.group_erp_manager'],
    company_id:'company-1',
    partner_id:'partner-admin',
    tz:'Asia/Amman',
    lang:'en_US',
    action_id:null,
  },
  {
    id:'user-manager',
    name:'Sales Manager',
    login:'manager@innovation-corp.com',
    email:'manager@innovation-corp.com',
    active:true,
    groups_id:['base.group_user','base.group_sale_manager'],
    company_id:'company-1',
    partner_id:'partner-acme',
    tz:'America/New_York',
    lang:'en_US',
  },
  {
    id:'user-employee',
    name:'Regular Employee',
    login:'employee@innovation-corp.com',
    email:'employee@innovation-corp.com',
    active:true,
    groups_id:['base.group_user'],
    company_id:'company-1',
    partner_id:'partner-delta',
    tz:'Europe/London',
    lang:'en_US',
  },
]
