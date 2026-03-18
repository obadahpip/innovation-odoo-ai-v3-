/**
 * CalendarPage.jsx — Calendar
 * Odoo 19.0 model: calendar.event
 * Route base: /erp/calendar
 * Sub-nav: ['Calendar', 'Meetings']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Event',width:'26%'},
  {key:'start',label:'Start',width:'18%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'stop',label:'End',width:'18%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'location',label:'Location',width:'16%'},
  {key:'allday',label:'All Day',width:'8%',render:(v) => v ? '✓' : '—'},
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
export function CalendarPage() {
  return (
    <GenericList
      model="calendar.event"
      title="Calendar"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/calendar/new"
      formPath="/erp/calendar/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📅"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function CalendarForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="calendar.event" id={id}
      defaults={DEFAULTS}
      title="Calendar"
      backPath="/erp/calendar" backLabel="Calendar"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Meeting Subject'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Start'><input type='datetime-local' className='o-input' value={(record?.start||'').slice(0,16)} onChange={e=>setField('start',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Stop'><input type='datetime-local' className='o-input' value={(record?.stop||'').slice(0,16)} onChange={e=>setField('stop',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Location'><input className='o-input' value={record?.location||''} onChange={e=>setField('location',e.target.value)}/></FieldRow>
          <FieldRow label='All Day'><input type='checkbox' checked={!!record?.allday} onChange={e=>setField('allday',e.target.checked)} style={{width:16,height:16,accentColor:'var(--teal)'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default CalendarPage
