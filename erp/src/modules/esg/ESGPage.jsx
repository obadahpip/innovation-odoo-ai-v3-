/**
 * ESGPage.jsx — ESG Reporting
 * Odoo 19.0 model: esg.document
 * Route base: /erp/esg
 * Sub-nav: ['Overview', 'Reporting']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'done':{label:'Validated',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Report',width:'30%'},
  {key:'date',label:'Period',width:'18%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'company_id',label:'Company',width:'22%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
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
export function ESGPage() {
  return (
    <GenericList
      model="esg.document"
      title="ESG Reporting"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/esg/new"
      formPath="/erp/esg/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🌱"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function ESGForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="esg.document" id={id}
      defaults={DEFAULTS}
      title="ESG Reporting"
      backPath="/erp/esg" backLabel="ESG Reporting"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Report Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)} placeholder='e.g. 2026 ESG Report'/></FieldRow>
          <FieldRow label='Period'><input type='date' className='o-input' value={(record?.date||'').slice(0,10)} onChange={e=>setField('date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Company'><input className='o-input' value={record?.company_id||''} onChange={e=>setField('company_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default ESGPage
