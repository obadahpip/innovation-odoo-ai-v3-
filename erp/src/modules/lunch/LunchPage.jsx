/**
 * LunchPage.jsx — Lunch Orders
 * Odoo 19.0 model: lunch.order
 * Route base: /erp/lunch
 * Sub-nav: ['My Lunch', 'Cash Moves', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'new':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'ordered':{label:'Ordered',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'confirmed':{label:'Confirmed',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancelled':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'user_id',label:'Employee',width:'20%'},
  {key:'product_id',label:'Product',width:'22%'},
  {key:'supplier_id',label:'Vendor',width:'18%'},
  {key:'date',label:'Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'price',label:'Price',width:'10%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'new',label:'New'},
  {value:'ordered',label:'Ordered'},
  {value:'confirmed',label:'Confirmed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function LunchPage() {
  return (
    <GenericList
      model="lunch.order"
      title="Lunch Orders"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/lunch/new"
      formPath="/erp/lunch/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🍕"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function LunchForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="lunch.order" id={id}
      defaults={DEFAULTS}
      title="Lunch Order"
      backPath="/erp/lunch" backLabel="Lunch Orders"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.user_id||''} onChange={e=>setField('user_id',e.target.value)}/></FieldRow>
          <FieldRow label='Meal'><input className='o-input' value={record?.product_id||''} onChange={e=>setField('product_id',e.target.value)}/></FieldRow>
          <FieldRow label='Date'><input type='date' className='o-input' value={(record?.date||'').slice(0,10)} onChange={e=>setField('date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Price'><input type='number' className='o-input' value={record?.price||0} onChange={e=>setField('price',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default LunchPage
