/**
 * RepairsPage.jsx — Repair Orders
 * Odoo 19.0 model: repair.order
 * Route base: /erp/repairs
 * Sub-nav: ['Repair Orders', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Quotation',color:'var(--text3)',bg:'var(--surface3)'},
  'confirmed':{label:'Confirmed',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'under_repair':{label:'Under Repair',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Repaired',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  '2binvoiced':{label:'To Invoice',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'16%'},
  {key:'product_id',label:'Product',width:'18%'},
  {key:'partner_id',label:'Customer',width:'16%',render:(v) => <PartnerCell id={v}/>},
  {key:'date',label:'Scheduled',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'amount_total',label:'Total',width:'12%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Quotation'},
  {value:'confirmed',label:'Confirmed'},
  {value:'under_repair',label:'Under Repair'},
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
export function RepairsPage() {
  return (
    <GenericList
      model="repair.order"
      title="Repair Orders"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/repairs/new"
      formPath="/erp/repairs/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🔨"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function RepairsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="repair.order" id={id}
      defaults={DEFAULTS}
      title="Repair Order"
      backPath="/erp/repairs" backLabel="Repair Orders"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Reference'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Product to Repair'><input className='o-input' value={record?.product_id||''} onChange={e=>setField('product_id',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Warranty Expiration'><input type='date' className='o-input' value={(record?.guarantee_limit||'').slice(0,10)} onChange={e=>setField('guarantee_limit',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default RepairsPage
