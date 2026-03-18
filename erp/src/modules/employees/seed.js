/**
 * Employees seed data
 * 2 departments, 8 employees with full profile fields
 */

const D = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0,10)

export const DEPARTMENTS = [
  { id:'dept-admin', name:'Administration',     manager_id:'emp-001', company_id:'company-1' },
  { id:'dept-rd',    name:'Research & Development', manager_id:'emp-002', company_id:'company-1' },
  { id:'dept-sales', name:'Sales',              manager_id:'emp-003', company_id:'company-1' },
]

export default [
  {
    id:'emp-001', name:'Emma Granger', job_title:'Chief Executive Officer',
    job_id:'job-ceo', department_id:'dept-admin', parent_id:null,
    work_email:'emma.granger@mycompany.example.com', work_phone:'(555)-768-6230', mobile_phone:'+1 555 768 6231',
    gender:'female', birthday: D(365*35), country_id:'US',
    active:true, company_id:'company-1', user_id:'user-admin',
    color:0, coach_id:null,
    private_info:{
      private_email:'emma.granger@personal.com',
      km_home_work:15, emergency_contact:'Tom Granger', emergency_phone:'+1 555 768 6299',
    },
    hr_settings:{ resource_calendar_id:'cal-40h', tz:'America/New_York' },
    category_ids:['tag-consultant', 'tag-demo'],
  },
  {
    id:'emp-002', name:'Michael Williams', job_title:'Chief Executive Officer',
    job_id:'job-ceo', department_id:'dept-admin', parent_id:'emp-001',
    work_email:'michael.williams@mycompany.example.com', work_phone:'(555)-768-6230', mobile_phone:'+1 555 768 6232',
    gender:'male', birthday: D(365*42), country_id:'US',
    active:true, company_id:'company-1', user_id:null,
    color:1, coach_id:'emp-001',
    category_ids:['tag-employee', 'tag-demo'],
  },
  {
    id:'emp-003', name:'Simon Jones', job_title:'Experienced Developer',
    job_id:'job-dev', department_id:'dept-rd', parent_id:'emp-002',
    work_email:'simon.jones@mycompany.example.com', work_phone:'(555)-768-6230', mobile_phone:'+1 555 768 6233',
    gender:'male', birthday: D(365*30), country_id:'US',
    active:true, company_id:'company-1', user_id:null,
    color:2, coach_id:'emp-002',
    category_ids:['tag-employee', 'tag-demo'],
  },
  {
    id:'emp-004', name:'Priya Sharma', job_title:'Senior Developer',
    job_id:'job-dev', department_id:'dept-rd', parent_id:'emp-002',
    work_email:'priya.sharma@mycompany.example.com', work_phone:'(555)-768-6234', mobile_phone:'+1 555 768 6235',
    gender:'female', birthday: D(365*28), country_id:'IN',
    active:true, company_id:'company-1', user_id:null,
    color:3, coach_id:'emp-003',
    category_ids:['tag-employee'],
  },
  {
    id:'emp-005', name:'Lucas Bernard', job_title:'Sales Manager',
    job_id:'job-sales-mgr', department_id:'dept-sales', parent_id:'emp-001',
    work_email:'lucas.bernard@mycompany.example.com', work_phone:'(555)-768-6236', mobile_phone:'+1 555 768 6237',
    gender:'male', birthday: D(365*38), country_id:'FR',
    active:true, company_id:'company-1', user_id:null,
    color:4, coach_id:'emp-001',
    category_ids:['tag-employee'],
  },
  {
    id:'emp-006', name:'Sofia Martinez', job_title:'Account Executive',
    job_id:'job-ae', department_id:'dept-sales', parent_id:'emp-005',
    work_email:'sofia.martinez@mycompany.example.com', work_phone:'(555)-768-6238', mobile_phone:'+1 555 768 6239',
    gender:'female', birthday: D(365*26), country_id:'ES',
    active:true, company_id:'company-1', user_id:null,
    color:5, coach_id:'emp-005',
    category_ids:['tag-employee'],
  },
  {
    id:'emp-007', name:'James O\'Brien', job_title:'DevOps Engineer',
    job_id:'job-devops', department_id:'dept-rd', parent_id:'emp-003',
    work_email:'james.obrien@mycompany.example.com', work_phone:'(555)-768-6240', mobile_phone:'+1 555 768 6241',
    gender:'male', birthday: D(365*32), country_id:'IE',
    active:true, company_id:'company-1', user_id:null,
    color:6, coach_id:'emp-003',
    category_ids:['tag-employee'],
  },
  {
    id:'emp-008', name:'Aisha Okonkwo', job_title:'HR Manager',
    job_id:'job-hr', department_id:'dept-admin', parent_id:'emp-001',
    work_email:'aisha.okonkwo@mycompany.example.com', work_phone:'(555)-768-6242', mobile_phone:'+1 555 768 6243',
    gender:'female', birthday: D(365*34), country_id:'NG',
    active:true, company_id:'company-1', user_id:null,
    color:7, coach_id:'emp-001',
    category_ids:['tag-employee'],
  },
]
