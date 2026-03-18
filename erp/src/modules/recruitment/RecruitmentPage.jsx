/**
 * RecruitmentPage.jsx — Job Applications
 * Odoo 19.0 model: hr.applicant
 * Route base: /erp/recruitment
 * Sub-nav: ['Applications', 'All Applications', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'new':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'initial_qualification':{label:'Qualification',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'first_interview':{label:'1st Interview',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'second_interview':{label:'2nd Interview',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'contract_signed':{label:'Contract Signed',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'refuse':{label:'Refused',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'partner_name',label:'Applicant',width:'20%'},
  {key:'job_id',label:'Job Position',width:'18%'},
  {key:'date_open',label:'Applied',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'medium_id',label:'Source',width:'13%'},
  {key:'stage_id',label:'Stage',width:'14%'},
  {key:'priority',label:'Stars',width:'8%',render:(v) => <PriorityStars value={v}/>},
]

const STAGES = [
  {value:'new',label:'New'},
  {value:'initial_qualification',label:'Qualification'},
  {value:'first_interview',label:'1st Interview'},
  {value:'second_interview',label:'2nd Interview'},
  {value:'contract_signed',label:'Contract Signed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function RecruitmentPage() {
  return (
    <GenericList
      model="hr.applicant"
      title="Job Applications"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/recruitment/new"
      formPath="/erp/recruitment/:id"
      searchFields={['name','subject','title']}
      emptyIcon="👔"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function RecruitmentForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.applicant" id={id}
      defaults={DEFAULTS}
      title="Job Application"
      backPath="/erp/recruitment" backLabel="Job Applications"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Applicant Name'><input className='o-input' value={record?.partner_name||''} onChange={e=>setField('partner_name',e.target.value)}/></FieldRow>
          <FieldRow label='Job Position'><input className='o-input' value={record?.job_id||''} onChange={e=>setField('job_id',e.target.value)}/></FieldRow>
          <FieldRow label='Email'><input className='o-input' value={record?.email_from||''} onChange={e=>setField('email_from',e.target.value)}/></FieldRow>
          <FieldRow label='Phone'><input className='o-input' value={record?.partner_phone||''} onChange={e=>setField('partner_phone',e.target.value)}/></FieldRow>
          <FieldRow label='Appreciation'><div style={{display:'flex',gap:4}}>{[0,1,2,3].map(p=>(<span key={p} onClick={()=>setField('priority',String(p))} style={{fontSize:18,cursor:'pointer',color:parseInt(record?.priority||'0')>=p?'#f0ad4e':'var(--border2)'}}>★</span>))}</div></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default RecruitmentPage
