/**
 * FrontDeskPage.jsx — Visitors
 * Odoo 19.0 model: hr.visitor
 * Route base: /erp/frontdesk
 * Sub-nav: ['Visitors', 'Hosts', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'planned':{label:'Planned',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'checked_in':{label:'Checked In',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'checked_out':{label:'Checked Out',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancelled':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'partner_name',label:'Visitor',width:'22%'},
  {key:'contact_id',label:'Host',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'arrival',label:'Arrival',width:'18%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'departure',label:'Departure',width:'18%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'planned',label:'Planned'},
  {value:'checked_in',label:'Checked In'},
  {value:'checked_out',label:'Checked Out'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function FrontDeskPage() {
  return (
    <GenericList
      model="hr.visitor"
      title="Visitors"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/frontdesk/new"
      formPath="/erp/frontdesk/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🏢"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function FrontDeskForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.visitor" id={id}
      defaults={DEFAULTS}
      title="Visitor"
      backPath="/erp/frontdesk" backLabel="Visitors"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Visitor Name'><input className='o-input' value={record?.partner_name||''} onChange={e=>setField('partner_name',e.target.value)}/></FieldRow>
          <FieldRow label='Host'><input className='o-input' value={record?.contact_id||''} onChange={e=>setField('contact_id',e.target.value)}/></FieldRow>
          <FieldRow label='Expected Arrival'><input type='datetime-local' className='o-input' value={(record?.arrival||'').slice(0,16)} onChange={e=>setField('arrival',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Expected Departure'><input type='datetime-local' className='o-input' value={(record?.departure||'').slice(0,16)} onChange={e=>setField('departure',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default FrontDeskPage
