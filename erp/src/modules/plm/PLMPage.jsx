/**
 * PLMPage.jsx — Engineering Changes
 * Odoo 19.0 model: mrp.eco
 * Route base: /erp/plm
 * Sub-nav: ['Engineering Changes', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'confirmed':{label:'In Progress',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'rebase':{label:'Rebased',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'18%'},
  {key:'product_tmpl_id',label:'Product',width:'20%'},
  {key:'type_id',label:'ECO Type',width:'15%'},
  {key:'user_id',label:'Responsible',width:'15%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'New'},
  {value:'confirmed',label:'In Progress'},
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
export function PLMPage() {
  return (
    <GenericList
      model="mrp.eco"
      title="Engineering Changes"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/plm/new"
      formPath="/erp/plm/:id"
      searchFields={['name','subject','title']}
      emptyIcon="⚙️"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function PLMForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="mrp.eco" id={id}
      defaults={DEFAULTS}
      title="Engineering Change"
      backPath="/erp/plm" backLabel="Engineering Changes"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Reference'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Product'><input className='o-input' value={record?.product_tmpl_id||''} onChange={e=>setField('product_tmpl_id',e.target.value)}/></FieldRow>
          <FieldRow label='ECO Type'><input className='o-input' value={record?.type_id||''} onChange={e=>setField('type_id',e.target.value)}/></FieldRow>
          <FieldRow label='Description'><textarea className='o-input' rows={3} value={record?.description||''} onChange={e=>setField('description',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default PLMPage
