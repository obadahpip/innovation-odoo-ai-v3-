/**
 * RentalPage.jsx — Rental Orders
 * Odoo 19.0 model: rental.order
 * Route base: /erp/rental
 * Sub-nav: ['Orders', 'Products', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Quotation',color:'var(--text3)',bg:'var(--surface3)'},
  'confirmed':{label:'Confirmed',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'pickup':{label:'Picked Up',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'return':{label:'Returned',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'16%'},
  {key:'partner_id',label:'Customer',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'rental_start_date',label:'Pickup',width:'14%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'rental_return_date',label:'Return',width:'14%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'amount_total',label:'Total',width:'12%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Quotation'},
  {value:'confirmed',label:'Confirmed'},
  {value:'pickup',label:'Picked Up'},
  {value:'return',label:'Returned'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function RentalPage() {
  return (
    <GenericList
      model="rental.order"
      title="Rental Orders"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/rental/new"
      formPath="/erp/rental/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🚗"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function RentalForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="rental.order" id={id}
      defaults={DEFAULTS}
      title="Rental Order"
      backPath="/erp/rental" backLabel="Rental Orders"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Rental Ref'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Pickup Date'><input type='date' className='o-input' value={(record?.rental_start_date||'').slice(0,10)} onChange={e=>setField('rental_start_date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Return Date'><input type='date' className='o-input' value={(record?.rental_return_date||'').slice(0,10)} onChange={e=>setField('rental_return_date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Total'><input type='number' className='o-input' value={record?.amount_total||0} onChange={e=>setField('amount_total',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default RentalPage
