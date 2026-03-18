/**
 * BarcodePage.jsx — Barcode Operations
 * Odoo 19.0 model: stock.picking
 * Route base: /erp/barcode
 * Sub-nav: ['Transfers', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'waiting':{label:'Waiting',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'confirmed':{label:'Ready',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'assigned':{label:'Ready',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'18%'},
  {key:'picking_type_id',label:'Operation',width:'18%'},
  {key:'partner_id',label:'Contact',width:'16%',render:(v) => <PartnerCell id={v}/>},
  {key:'scheduled_date',label:'Scheduled',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = null

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function BarcodePage() {
  return (
    <GenericList
      model="stock.picking"
      title="Barcode Operations"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/barcode/new"
      formPath="/erp/barcode/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📊"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function BarcodeForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="stock.picking" id={id}
      defaults={DEFAULTS}
      title="Barcode Operation"
      backPath="/erp/barcode" backLabel="Barcode Operations"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Reference'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Operation Type'><input className='o-input' value={record?.picking_type_id||''} onChange={e=>setField('picking_type_id',e.target.value)}/></FieldRow>
          <FieldRow label='Scheduled Date'><input type='datetime-local' className='o-input' value={(record?.scheduled_date||'').slice(0,16)} onChange={e=>setField('scheduled_date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default BarcodePage
