/**
 * EventsPage.jsx — Events
 * Odoo 19.0 model: event.event
 * Route base: /erp/events
 * Sub-nav: ['Events', 'Registrations', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Unconfirmed',color:'var(--text3)',bg:'var(--surface3)'},
  'confirm':{label:'Confirmed',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'done':{label:'Ended',color:'var(--text2)',bg:'var(--surface3)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Event',width:'26%'},
  {key:'date_begin',label:'Start',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'date_end',label:'End',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'seats_taken',label:'Registrations',width:'12%'},
  {key:'seats_available',label:'Available',width:'12%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Unconfirmed'},
  {value:'confirm',label:'Confirmed'},
  {value:'done',label:'Ended'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function EventsPage() {
  return (
    <GenericList
      model="event.event"
      title="Events"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/events/new"
      formPath="/erp/events/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📅"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function EventsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="event.event" id={id}
      defaults={DEFAULTS}
      title="Event"
      backPath="/erp/events" backLabel="Events"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Event Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Start Date'><input type='datetime-local' className='o-input' value={(record?.date_begin||'').slice(0,16)} onChange={e=>setField('date_begin',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='End Date'><input type='datetime-local' className='o-input' value={(record?.date_end||'').slice(0,16)} onChange={e=>setField('date_end',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Attendees Limit'><input type='number' className='o-input' value={record?.seats_max||0} onChange={e=>setField('seats_max',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default EventsPage
