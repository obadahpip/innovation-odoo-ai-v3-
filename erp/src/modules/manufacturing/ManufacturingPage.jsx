/**
 * ManufacturingPage.jsx — Manufacturing Orders
 * Odoo 19.0 model: mrp.production
 * Route base: /erp/manufacturing
 * Sub-nav: ['Manufacturing', 'Bill of Materials', 'Products', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'confirmed':{label:'Confirmed',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'progress':{label:'In Progress',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'to_close':{label:'To Close',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'16%'},
  {key:'product_id',label:'Product',width:'20%'},
  {key:'product_qty',label:'Qty',width:'10%'},
  {key:'product_uom_id',label:'UoM',width:'10%'},
  {key:'date_planned_start',label:'Scheduled',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'confirmed',label:'Confirmed'},
  {value:'progress',label:'In Progress'},
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
export function ManufacturingPage() {
  return (
    <GenericList
      model="mrp.production"
      title="Manufacturing Orders"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/manufacturing/new"
      formPath="/erp/manufacturing/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🏭"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function ManufacturingForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="mrp.production" id={id}
      defaults={DEFAULTS}
      title="Manufacturing Order"
      backPath="/erp/manufacturing" backLabel="Manufacturing Orders"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Product'><input className='o-input' value={record?.product_id||''} onChange={e=>setField('product_id',e.target.value)}/></FieldRow>
          <FieldRow label='Quantity'><input type='number' className='o-input' value={record?.product_qty||0} onChange={e=>setField('product_qty',parseFloat(e.target.value)||0)}/></FieldRow>
          <FieldRow label='Bill of Materials'><input className='o-input' value={record?.bom_id||''} onChange={e=>setField('bom_id',e.target.value)}/></FieldRow>
          <FieldRow label='Scheduled Date'><input type='datetime-local' className='o-input' value={(record?.date_planned_start||'').slice(0,16)} onChange={e=>setField('date_planned_start',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default ManufacturingPage
