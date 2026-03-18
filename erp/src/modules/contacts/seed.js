/**
 * Contacts seed data — 25 records (companies + individuals)
 */
export default [
  // ── Companies ─────────────────────────────────────────────────
  { id:'partner-acme',     name:'Acme Corp',           partner_type:'company',    email:'contact@acme.com',       phone:'+1 212 555 0101', website:'https://acme.com',       country_id:'US', city:'New York',      street:'350 5th Ave',          active:true, image:null },
  { id:'partner-delta',    name:'Delta Technologies',  partner_type:'company',    email:'info@delta-tech.com',    phone:'+1 415 555 0102', website:'https://delta-tech.com', country_id:'US', city:'San Francisco', street:'1 Market St',          active:true, image:null },
  { id:'partner-global',   name:'Global Imports LLC',  partner_type:'company',    email:'sales@globalimports.com',phone:'+44 20 5555 0103',website:'https://globalimports.com',country_id:'GB',city:'London',       street:'10 Downing St',        active:true, image:null },
  { id:'partner-nexus',    name:'Nexus Solutions',     partner_type:'company',    email:'hello@nexus.io',         phone:'+1 310 555 0104', website:'https://nexus.io',       country_id:'US', city:'Los Angeles',   street:'8484 Wilshire Blvd',   active:true, image:null },
  { id:'partner-horizon',  name:'Horizon Ventures',    partner_type:'company',    email:'info@horizonv.com',      phone:'+49 30 5555 0105',website:'https://horizonv.com',   country_id:'DE', city:'Berlin',        street:'Unter den Linden 5',   active:true, image:null },
  { id:'partner-solar',    name:'Solar Energy Co',     partner_type:'company',    email:'contact@solar.com',      phone:'+1 602 555 0106', website:'https://solar.com',      country_id:'US', city:'Phoenix',       street:'2020 E University Dr', active:true, image:null },
  { id:'partner-apex',     name:'Apex Industries',     partner_type:'company',    email:'info@apex.com',          phone:'+1 713 555 0107', website:'https://apex.com',       country_id:'US', city:'Houston',       street:'1400 Smith St',        active:true, image:null },
  { id:'partner-nordic',   name:'Nordic Supplies AB',  partner_type:'company',    email:'order@nordic.se',        phone:'+46 8 5555 0108', website:'https://nordic.se',      country_id:'SE', city:'Stockholm',     street:'Drottninggatan 10',    active:true, image:null },

  // ── Individuals (linked to companies) ─────────────────────────
  { id:'partner-john',     name:'John Miller',         partner_type:'person',     email:'john.miller@acme.com',   phone:'+1 212 555 0201', parent_id:'partner-acme',     job_position:'Sales Manager',   country_id:'US', active:true },
  { id:'partner-sarah',    name:'Sarah Chen',          partner_type:'person',     email:'s.chen@delta-tech.com',  phone:'+1 415 555 0202', parent_id:'partner-delta',    job_position:'CTO',             country_id:'US', active:true },
  { id:'partner-james',    name:'James Wilson',        partner_type:'person',     email:'j.wilson@globalimports.com',phone:'+44 20 5555 0203',parent_id:'partner-global', job_position:'Procurement Head',country_id:'GB', active:true },
  { id:'partner-emily',    name:'Emily Turner',        partner_type:'person',     email:'emily@nexus.io',         phone:'+1 310 555 0204', parent_id:'partner-nexus',    job_position:'CEO',             country_id:'US', active:true },
  { id:'partner-marco',    name:'Marco Rossi',         partner_type:'person',     email:'marco@horizonv.com',     phone:'+49 30 5555 0205',parent_id:'partner-horizon',  job_position:'Director',        country_id:'DE', active:true },
  { id:'partner-anna',     name:'Anna Petrov',         partner_type:'person',     email:'a.petrov@solar.com',     phone:'+1 602 555 0206', parent_id:'partner-solar',    job_position:'Engineer',        country_id:'US', active:true },
  { id:'partner-carlos',   name:'Carlos Mendez',       partner_type:'person',     email:'c.mendez@apex.com',      phone:'+1 713 555 0207', parent_id:'partner-apex',     job_position:'Project Manager', country_id:'US', active:true },

  // ── Standalone individuals ────────────────────────────────────
  { id:'partner-lisa',     name:'Lisa Park',           partner_type:'person',     email:'lisa.park@gmail.com',    phone:'+1 650 555 0301', country_id:'US', city:'Palo Alto',  active:true },
  { id:'partner-david',    name:'David Kim',           partner_type:'person',     email:'david.kim@outlook.com',  phone:'+1 617 555 0302', country_id:'US', city:'Boston',     active:true },
  { id:'partner-fatima',   name:'Fatima Al-Hassan',    partner_type:'person',     email:'fatima@email.jo',        phone:'+962 6 555 0303', country_id:'JO', city:'Amman',      active:true },
  { id:'partner-yuki',     name:'Yuki Tanaka',         partner_type:'person',     email:'yuki.tanaka@mail.jp',    phone:'+81 3 5555 0304', country_id:'JP', city:'Tokyo',      active:true },
  { id:'partner-omar',     name:'Omar Al-Farsi',       partner_type:'person',     email:'omar.alfarsi@email.ae',  phone:'+971 4 555 0305', country_id:'AE', city:'Dubai',      active:true },
  { id:'partner-nina',     name:'Nina Kowalski',       partner_type:'person',     email:'nina.k@wp.pl',           phone:'+48 22 555 0306', country_id:'PL', city:'Warsaw',     active:true },
  { id:'partner-raj',      name:'Raj Patel',           partner_type:'person',     email:'raj.patel@company.in',   phone:'+91 22 5555 0307',country_id:'IN', city:'Mumbai',     active:true },
  { id:'partner-alice',    name:'Alice Fontaine',      partner_type:'person',     email:'alice@fontaine.fr',      phone:'+33 1 5555 0308', country_id:'FR', city:'Paris',      active:true },
  { id:'partner-tom',      name:'Tom Bradley',         partner_type:'person',     email:'tom.bradley@hotmail.com',phone:'+1 312 555 0309', country_id:'US', city:'Chicago',    active:true },
  { id:'partner-priya',    name:'Priya Nair',          partner_type:'person',     email:'priya.nair@infosys.com', phone:'+91 80 5555 0310',country_id:'IN', city:'Bangalore',  active:true },
]
