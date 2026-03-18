/**
 * PurchasePage.jsx — Purchase Orders
 * Odoo 19.0 model: purchase.order
 * Route base: /erp/purchase/orders
 * Sub-nav: ['Requests for Quotation', 'Purchase Orders', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'RFQ',color:'var(--text3)',bg:'var(--surface3)'},
  'sent':{label:'RFQ Sent',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'to approve':{label:'To Approve',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'purchase':{label:'Purchase Order',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'done':{label:'Locked',color:'var(--text2)',bg:'var(--surface3)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'16%'},
  {key:'partner_id',label:'Vendor',width:'20%',render:(v) => <PartnerCell id={v}/>},
  {key:'date_order',label:'Order Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'amount_total',label:'Total',width:'12%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'invoice_status',label:'Billing',width:'12%'},
  {key:'state',label:'Status',width:'13%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'RFQ'},
  {value:'sent',label:'RFQ Sent'},
  {value:'purchase',label:'Purchase Order'},
  {value:'done',label:'Locked'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function PurchasePage() {
  return (
    <GenericList
      model="purchase.order"
      title="Purchase Orders"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/purchase/orders/new"
      formPath="/erp/purchase/orders/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🛍️"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function PurchaseForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="purchase.order" id={id}
      defaults={DEFAULTS}
      title="Purchase Order"
      backPath="/erp/purchase/orders" backLabel="Purchase Orders"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Vendor'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Order Date'><input type='datetime-local' className='o-input' value={(record?.date_order||'').slice(0,16)} onChange={e=>setField('date_order',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Currency'><input className='o-input' value={record?.currency_id||''} onChange={e=>setField('currency_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default PurchasePage
