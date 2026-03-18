/**
 * QualityPage.jsx — Quality Checks
 * Odoo 19.0 model: quality.check
 * Route base: /erp/quality
 * Sub-nav: ['Quality Checks', 'Quality Alerts', 'Quality Points', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'none':{label:'To Do',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'pass':{label:'Passed',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'fail':{label:'Failed',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'18%'},
  {key:'product_id',label:'Product',width:'20%'},
  {key:'team_id',label:'Quality Team',width:'15%'},
  {key:'user_id',label:'Responsible',width:'15%'},
  {key:'quality_state',label:'Result',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'none',label:'To Do'},
  {value:'pass',label:'Passed'},
  {value:'fail',label:'Failed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function QualityPage() {
  return (
    <GenericList
      model="quality.check"
      title="Quality Checks"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/quality/new"
      formPath="/erp/quality/:id"
      searchFields={['name','subject','title']}
      emptyIcon="✅"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function QualityForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="quality.check" id={id}
      defaults={DEFAULTS}
      title="Quality Check"
      backPath="/erp/quality" backLabel="Quality Checks"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Product'><input className='o-input' value={record?.product_id||''} onChange={e=>setField('product_id',e.target.value)}/></FieldRow>
          <FieldRow label='Quality Team'><input className='o-input' value={record?.team_id||''} onChange={e=>setField('team_id',e.target.value)}/></FieldRow>
          <FieldRow label='Title'><input className='o-input' value={record?.title||''} onChange={e=>setField('title',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default QualityPage
