/**
 * Time Off seed data — leave types + 5 leave requests
 */
const D = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0,10)

export const LEAVE_TYPES = [
  { id:'lt-annual',    name:'Annual Leave',      code:'AL',  allocation_type:'fixed', requires_allocation:'yes', max_days:21, color:0,  active:true },
  { id:'lt-sick',      name:'Sick Leave',         code:'SL',  allocation_type:'fixed', requires_allocation:'no',  max_days:10, color:1,  active:true },
  { id:'lt-unpaid',    name:'Unpaid Leave',        code:'UL',  allocation_type:'no',    requires_allocation:'no',  max_days:0,  color:2,  active:true },
  { id:'lt-emergency', name:'Emergency Leave',     code:'EL',  allocation_type:'fixed', requires_allocation:'no',  max_days:3,  color:4,  active:true },
  { id:'lt-parental',  name:'Parental Leave',      code:'PL',  allocation_type:'fixed', requires_allocation:'yes', max_days:90, color:5,  active:true },
]

export const LEAVES = [
  {
    id:'leave-001', employee_id:'emp-001', holiday_status_id:'lt-annual',
    date_from: D(-15), date_to: D(-11),
    number_of_days:5, state:'validate', description:'Family vacation',
    active:true,
  },
  {
    id:'leave-002', employee_id:'emp-003', holiday_status_id:'lt-sick',
    date_from: D(-5), date_to: D(-4),
    number_of_days:2, state:'validate', description:'Flu',
    active:true,
  },
  {
    id:'leave-003', employee_id:'emp-004', holiday_status_id:'lt-annual',
    date_from: D(7), date_to: D(11),
    number_of_days:5, state:'confirm', description:'Holiday trip',
    active:true,
  },
  {
    id:'leave-004', employee_id:'emp-005', holiday_status_id:'lt-emergency',
    date_from: D(1), date_to: D(2),
    number_of_days:2, state:'draft', description:'Personal emergency',
    active:true,
  },
  {
    id:'leave-005', employee_id:'emp-006', holiday_status_id:'lt-annual',
    date_from: D(-30), date_to: D(-26),
    number_of_days:5, state:'refuse', description:'Personal time', refuse_reason:'Busy period',
    active:true,
  },
]
