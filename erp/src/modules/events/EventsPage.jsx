/**
 * EventsPage.jsx — Events module
 * Lesson 61: Events
 * Selectors: field-name, field-type, kanban-card, new-button, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }
const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

function EventsSidebar({ children }) {
  const navigate = useNavigate()
  const ITEMS = [
    { label: 'Events',        path: '/erp/events',         icon: '📅' },
    { label: 'Configuration', path: '/erp/events/config',  icon: '⚙' },
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 180, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 0' }}>
          <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>EVENTS</div>
          {ITEMS.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

async function seedEvents() {
  const existing = await listRecords('event.event')
  if (existing.length > 0) return
  for (const e of [
    { name: 'Odoo Experience 2025',    stage_id: 'New',         event_type_id: 'Conference',  date_begin: '2025-09-10', date_end: '2025-09-12', attendees_count: 0,  seats_available: 500 },
    { name: 'Product Launch Webinar',  stage_id: 'Confirmed',   event_type_id: 'Webinar',     date_begin: '2025-04-20', date_end: '2025-04-20', attendees_count: 148, seats_available: 200 },
    { name: 'Team Building Day',       stage_id: 'Confirmed',   event_type_id: 'Internal',    date_begin: '2025-05-15', date_end: '2025-05-15', attendees_count: 24,  seats_available: 30  },
    { name: 'Annual Gala Dinner',      stage_id: 'Cancelled',   event_type_id: 'Social',      date_begin: '2025-06-28', date_end: '2025-06-28', attendees_count: 0,  seats_available: 100 },
  ]) await createRecord('event.event', e)
}

/* ── Events List ────────────────────────────────────────────────── */
export function EventsPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('kanban')
  const { records, reload } = useRecordList('event.event', { sortKey: 'date_begin' })
  useEffect(() => { seedEvents().then(reload) }, [])

  const STAGE_COLOR = { New: 'var(--text3)', Confirmed: 'var(--success)', Cancelled: 'var(--danger)', Done: 'var(--teal)' }
  const stages = ['New', 'Confirmed', 'Done', 'Cancelled']

  return (
    <EventsSidebar>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Events</span>
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)', borderRadius: 5, border: '1px solid var(--border)', padding: 2 }}>
            {[['kanban','⊞'],['list','☰']].map(([v,icon]) => (
              <button key={v} onClick={() => setView(v)} style={{ width: 30, height: 26, background: view === v ? 'var(--surface3)' : 'none', border: 'none', cursor: 'pointer', color: view === v ? 'var(--teal)' : 'var(--text3)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
            ))}
          </div>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/events/new')}>+ New</button>
        </div>

        {/* Kanban */}
        {view === 'kanban' && (
          <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
            {stages.map(stage => {
              const stageRecords = records.filter(r => r.stage_id === stage)
              return (
                <div key={stage} style={{ width: 260, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                    <span style={{ fontSize: 11, color: 'var(--text2)' }}>{stageRecords.length}</span>
                  </div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {stageRecords.map(ev => (
                      <div key={ev.id} data-erp="kanban-card"
                        onClick={() => navigate(`/erp/events/${ev.id}`)}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', transition: 'all var(--t)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{ev.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>📅 {ev.date_begin}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Badge label={ev.event_type_id || 'Event'} color="#17a2b8" />
                          {ev.attendees_count > 0 && <span style={{ fontSize: 11, color: 'var(--text3)' }}>👥 {ev.attendees_count}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List */}
        {view === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                {['Event','Type','Date','Attendees','Stage'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {records.map(ev => (
                  <tr key={ev.id} data-erp="list-row" onClick={() => navigate(`/erp/events/${ev.id}`)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{ev.name}</td>
                    <td style={TD}>{ev.event_type_id ? <Badge label={ev.event_type_id} color="#17a2b8" /> : '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{ev.date_begin}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{ev.attendees_count || 0} / {ev.seats_available}</td>
                    <td style={TD}><Badge label={ev.stage_id || 'New'} color={STAGE_COLOR[ev.stage_id] || 'var(--text3)'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EventsSidebar>
  )
}

/* ── Event Form ─────────────────────────────────────────────────── */
export function EventsForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', event_type_id: '', stage_id: 'New', date_begin: '', date_end: '', seats_available: '', description: '' })

  useEffect(() => {
    if (!isNew) getRecord('event.event', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('event.event', vals)
    else       await updateRecord('event.event', id, vals)
    navigate('/erp/events')
  }

  const fields = [
    { key: 'name',            label: 'Event Name',    required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'event_type_id',   label: 'Event Type',    type: 'select', dataErp: 'field-type',
      options: ['Conference', 'Webinar', 'Internal', 'Social', 'Training', 'Other'] },
    { key: 'stage_id',        label: 'Stage',         type: 'select', dataErp: 'field-type',
      options: ['New', 'Confirmed', 'Done', 'Cancelled'] },
    { key: 'date_begin',      label: 'Start Date',    placeholder: 'YYYY-MM-DD' },
    { key: 'date_end',        label: 'End Date',      placeholder: 'YYYY-MM-DD' },
    { key: 'seats_available', label: 'Capacity',      placeholder: '100' },
    { key: 'description',     label: 'Description',   type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <EventsSidebar>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/events')}>Discard</button>
        </div>
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {fields.map(f => {
              const full = f.fullWidth || f.type === 'textarea'
              return (
                <div key={f.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.label}{f.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea rows={4} data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : f.type === 'select' ? (
                    <select data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">— Select —</option>
                      {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" data-erp={f.dataErp || (f.key === 'name' ? 'field-name' : `field-${f.key}`)}
                      value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder || ''} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </EventsSidebar>
  )
}
