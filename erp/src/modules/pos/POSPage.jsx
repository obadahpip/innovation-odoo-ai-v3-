/**
 * POSPage.jsx — Point of Sale
 * Odoo 19.0 model: pos.order
 * Route base: /erp/pos
 * Sub-nav: ['Dashboard', 'Orders', 'Sessions', 'Products', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'paid':{label:'Paid',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Posted',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'invoiced':{label:'Invoiced',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Order Ref',width:'16%'},
  {key:'session_id',label:'Session',width:'14%'},
  {key:'partner_id',label:'Customer',width:'16%',render:(v) => <PartnerCell id={v}/>},
  {key:'date_order',label:'Date',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'amount_total',label:'Total',width:'12%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'New'},
  {value:'paid',label:'Paid'},
  {value:'done',label:'Posted'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function POSPage() {
  return (
    <GenericList
      model="pos.order"
      title="Point of Sale"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/pos/new"
      formPath="/erp/pos/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🏪"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function POSForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="pos.order" id={id}
      defaults={DEFAULTS}
      title="Point of Sale"
      backPath="/erp/pos" backLabel="Point of Sale"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Order Ref'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Date'><input type='datetime-local' className='o-input' value={(record?.date_order||'').slice(0,16)} onChange={e=>setField('date_order',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Total'><input type='number' className='o-input' value={record?.amount_total||0} onChange={e=>setField('amount_total',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default POSPage
