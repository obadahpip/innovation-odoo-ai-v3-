/**
 * CalendarPage.jsx — Calendar module
 * Lesson 70: Calendar
 * Selectors: calendar-day, field-description, field-name, save-button, status-bar
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }

async function seedCalendar() {
  const existing = await listRecords('calendar.event')
  if (existing.length > 0) return
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth() + 1
  const pad = n => String(n).padStart(2, '0')
  for (const e of [
    { name: 'Team Standup',          start: `${y}-${pad(m)}-03 09:00`, stop: `${y}-${pad(m)}-03 09:30`, description: 'Daily sync',               categ_ids: 'Meeting',  user_id: 'Mitchell Admin' },
    { name: 'Product Demo',          start: `${y}-${pad(m)}-07 14:00`, stop: `${y}-${pad(m)}-07 15:30`, description: 'Demo for Azure Interior',   categ_ids: 'Call',     user_id: 'Marc Demo' },
    { name: 'Q1 Review',             start: `${y}-${pad(m)}-10 10:00`, stop: `${y}-${pad(m)}-10 12:00`, description: 'Quarterly business review', categ_ids: 'Meeting',  user_id: 'Mitchell Admin' },
    { name: 'Lunch with Agrolait',   start: `${y}-${pad(m)}-12 12:30`, stop: `${y}-${pad(m)}-12 13:30`, description: 'Client lunch',              categ_ids: 'Other',    user_id: 'Mitchell Admin' },
    { name: 'Sprint Planning',       start: `${y}-${pad(m)}-17 09:00`, stop: `${y}-${pad(m)}-17 11:00`, description: '2-week sprint kickoff',     categ_ids: 'Meeting',  user_id: 'Marc Demo' },
    { name: 'One-on-One: Marc',      start: `${y}-${pad(m)}-20 15:00`, stop: `${y}-${pad(m)}-20 16:00`, description: 'Regular 1:1',               categ_ids: 'Meeting',  user_id: 'Mitchell Admin' },
  ]) await createRecord('calendar.event', e)
}

const CATEG_COLOR = {
  Meeting: 'var(--teal)',
  Call:    '#8b5cf6',
  Other:   '#f59e0b',
  Holiday: '#10b981',
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

/* ═══════════════════════════════════════════════════════════════
   CALENDAR VIEW
═══════════════════════════════════════════════════════════════ */
export function CalendarPage() {
  const navigate = useNavigate()
  const now      = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [events, setEvents] = useState([])
  const [view,  setView]  = useState('month')

  useEffect(() => { seedCalendar().then(() => listRecords('calendar.event').then(setEvents)) }, [])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const pad = n => String(n).padStart(2, '0')
  const getEventsForDay = day => {
    if (!day) return []
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    return events.filter(e => e.start?.startsWith(dateStr))
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Toolbar — data-erp="status-bar" so task engine can find the header */}
      <div data-erp="status-bar" style={{
        padding: '8px 20px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/erp/calendar/new')}>+ New</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>‹</button>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', minWidth: 160, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>›</button>
        </div>
        <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }}
          style={{ padding: '4px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          Today
        </button>
        <span style={{ flex: 1 }} />
        {/* View switcher */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)', borderRadius: 5, border: '1px solid var(--border)', padding: 2 }}>
          {[['month','Month'],['week','Week'],['day','Day']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '3px 10px', borderRadius: 4,
              background: view === v ? 'var(--teal)' : 'transparent',
              border: 'none', color: view === v ? '#fff' : 'var(--text2)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          {DAYS.map(d => (
            <div key={d} style={{ padding: '6px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1 }}>
          {cells.map((day, i) => {
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
            const dayEvents = getEventsForDay(day)
            return (
              <div
                key={i}
                data-erp="calendar-day"
                onClick={() => day && navigate(`/erp/calendar/new?date=${year}-${pad(month+1)}-${pad(day)}`)}
                style={{
                  minHeight: 100,
                  border: '1px solid var(--border)',
                  borderTop: 'none', borderLeft: 'none',
                  padding: '6px',
                  background: day ? (isToday ? 'rgba(0,181,181,0.06)' : 'var(--bg)') : 'var(--surface)',
                  cursor: day ? 'pointer' : 'default',
                  transition: 'background var(--t)',
                }}
                onMouseEnter={e => { if (day) e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { if (day) e.currentTarget.style.background = isToday ? 'rgba(0,181,181,0.06)' : 'var(--bg)' }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: 12, fontWeight: isToday ? 700 : 400,
                      color: isToday ? '#fff' : 'var(--text2)',
                      width: 22, height: 22, borderRadius: '50%',
                      background: isToday ? 'var(--teal)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 4,
                    }}>{day}</div>
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id}
                        onClick={e => { e.stopPropagation(); navigate(`/erp/calendar/${ev.id}`) }}
                        style={{
                          fontSize: 11, padding: '2px 6px', borderRadius: 3,
                          background: (CATEG_COLOR[ev.categ_ids] || 'var(--teal)') + '33',
                          borderLeft: `3px solid ${CATEG_COLOR[ev.categ_ids] || 'var(--teal)'}`,
                          color: 'var(--text)', marginBottom: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >{ev.name}</div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div style={{ fontSize: 10, color: 'var(--text3)', paddingLeft: 2 }}>+{dayEvents.length - 3} more</div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EVENT FORM
═══════════════════════════════════════════════════════════════ */
export function CalendarForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', start: '', stop: '', description: '',
    categ_ids: 'Meeting', user_id: 'Mitchell Admin', location: '', privacy: 'public',
  })

  useEffect(() => {
    if (!isNew) getRecord('calendar.event', id).then(r => r && setVals(r))
    else {
      const params = new URLSearchParams(window.location.search)
      const date   = params.get('date')
      if (date) setVals(p => ({ ...p, start: date + ' 09:00', stop: date + ' 10:00' }))
    }
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('calendar.event', vals)
    else       await updateRecord('calendar.event', id, vals)
    navigate('/erp/calendar')
  }

  const fields = [
    { key: 'name',       label: 'Meeting Subject', required: true,  dataErp: 'field-name',        fullWidth: true },
    { key: 'start',      label: 'Start',           placeholder: 'YYYY-MM-DD HH:MM' },
    { key: 'stop',       label: 'Stop',            placeholder: 'YYYY-MM-DD HH:MM' },
    { key: 'categ_ids',  label: 'Tags',            type: 'select',  dataErp: 'field-type',
      options: ['Meeting', 'Call', 'Holiday', 'Other'] },
    { key: 'user_id',    label: 'Organizer' },
    { key: 'location',   label: 'Location' },
    { key: 'description',label: 'Description',     type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Action bar */}
      <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
        <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/calendar')}>Discard</button>
      </div>
      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {fields.map(f => {
            const full = f.fullWidth || f.type === 'textarea'
            return (
              <div key={f.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {f.label}{f.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea rows={4} data-erp={f.dataErp}
                    value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                ) : f.type === 'select' ? (
                  <select data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" data-erp={f.dataErp || (f.key === 'name' ? 'field-name' : `field-${f.key}`)}
                    value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder || ''} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
