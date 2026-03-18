/**
 * AppraisalsPage.jsx — Appraisals
 * Odoo 19.0 model: hr.appraisal
 * Route base: /erp/appraisals
 * Sub-nav: ['Appraisals', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'new':{label:'To Start',color:'var(--text3)',bg:'var(--surface3)'},
  'pending':{label:'Awaiting Feedback',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'employee_id',label:'Employee',width:'22%',render:(v) => <PartnerCell id={v}/>},
  {key:'job_title',label:'Job Position',width:'18%'},
  {key:'date_close',label:'Appraisal Date',width:'15%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'rating',label:'Last Rating',width:'13%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'new',label:'To Start'},
  {value:'pending',label:'Awaiting Feedback'},
  {value:'done',label:'Done'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function AppraisalsPage() {
  return (
    <GenericList
      model="hr.appraisal"
      title="Appraisals"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/appraisals/new"
      formPath="/erp/appraisals/:id"
      searchFields={['name','subject','title']}
      emptyIcon="⭐"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function AppraisalsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.appraisal" id={id}
      defaults={DEFAULTS}
      title="Appraisal"
      backPath="/erp/appraisals" backLabel="Appraisals"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.employee_id||''} onChange={e=>setField('employee_id',e.target.value)}/></FieldRow>
          <FieldRow label='Managers'><input className='o-input' value={record?.manager_ids||''} onChange={e=>setField('manager_ids',e.target.value)}/></FieldRow>
          <FieldRow label='Appraisal Date'><input type='date' className='o-input' value={(record?.date_close||'').slice(0,10)} onChange={e=>setField('date_close',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Rating'><select className='o-input' value={record?.rating||''} onChange={e=>setField('rating',e.target.value)}><option value='good'>Good</option><option value='very_good'>Exceeds Expectations</option><option value='excellent'>Excellent</option></select></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default AppraisalsPage
