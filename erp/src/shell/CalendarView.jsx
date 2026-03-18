/**
 * CalendarView.jsx
 * Month / Week / Day calendar matching Odoo dark calendar screenshots.
 *
 * Props:
 *  events      — [{ id, title, start, end, color }]
 *  onEventClick
 *  onDateClick
 *  onNewEvent
 */
import { useState, useMemo } from 'react'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CalendarView({ events=[], onEventClick, onDateClick, onNewEvent }) {
  const today = new Date()
  const [view, setView]       = useState('week') // 'month'|'week'|'day'
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()))

  const title = useMemo(() => {
    if (view==='month') return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    if (view==='week') {
      const start = getWeekStart(current)
      const end   = new Date(start); end.setDate(end.getDate()+6)
      return `${MONTHS[start.getMonth()]} ${start.getFullYear()} Week ${getWeekNumber(current)}`
    }
    return `${MONTHS[current.getMonth()]} ${current.getDate()}, ${current.getFullYear()}`
  }, [view, current])

  const prev = () => {
    const d = new Date(current)
    if (view==='month') d.setMonth(d.getMonth()-1)
    else if (view==='week') d.setDate(d.getDate()-7)
    else d.setDate(d.getDate()-1)
    setCurrent(d)
  }
  const next = () => {
    const d = new Date(current)
    if (view==='month') d.setMonth(d.getMonth()+1)
    else if (view==='week') d.setDate(d.getDate()+7)
    else d.setDate(d.getDate()+1)
    setCurrent(d)
  }
  const goToday = () => setCurrent(new Date(today.getFullYear(), today.getMonth(), today.getDate()))

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>

      {/* ── Calendar nav bar ─────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', padding:'8px 16px', gap:8, borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <button className="btn btn-secondary btn-sm btn-icon" onClick={prev}>‹</button>
        <button className="btn btn-secondary btn-sm btn-icon" onClick={next}>›</button>

        <div style={{ display:'flex', gap:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:4, overflow:'hidden' }}>
          {['month','week','day'].map(v=>(
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding:'3px 10px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12,
                background: view===v ? 'var(--teal)' : 'none',
                color: view===v ? '#fff' : 'var(--text2)',
                transition:'background var(--t)',
              }}
            >{v.charAt(0).toUpperCase()+v.slice(1)}</button>
          ))}
        </div>

        <button className="btn btn-secondary btn-sm" onClick={goToday}>Today</button>

        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginLeft:4 }}>{title}</span>
      </div>

      {/* ── View content ─────────────────────────────────── */}
      <div style={{ flex:1, overflow:'auto' }}>
        {view==='month' && <MonthView current={current} today={today} events={events} onDateClick={onDateClick} onEventClick={onEventClick} />}
        {view==='week'  && <WeekView  current={current} today={today} events={events} onEventClick={onEventClick} />}
        {view==='day'   && <DayView   current={current} today={today} events={events} onEventClick={onEventClick} />}
      </div>
    </div>
  )
}

/* ── Month View ─────────────────────────────────────────────────── */
function MonthView({ current, today, events, onDateClick, onEventClick }) {
  const year  = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()

  const cells = []
  for (let i=0; i<firstDay; i++) cells.push(null)
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d))

  const getEvents = (date) => {
    if (!date) return []
    return events.filter(e => {
      const es = new Date(e.start)
      return es.getFullYear()===date.getFullYear() && es.getMonth()===date.getMonth() && es.getDate()===date.getDate()
    })
  }

  return (
    <div style={{ padding:'0 12px 12px' }}>
      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:4 }}>
        {DAYS.map(d=>(
          <div key={d} style={{ padding:'8px 4px', fontSize:11, fontWeight:700, color:'var(--text3)', textAlign:'center', textTransform:'uppercase' }}>{d}</div>
        ))}
      </div>
      {/* Calendar grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const isToday = date.toDateString()===today.toDateString()
          const dayEvents = getEvents(date)
          return (
            <div
              key={i}
              onClick={() => onDateClick?.(date)}
              style={{
                minHeight:80, padding:'4px 6px', borderRadius:4,
                background:'var(--surface)', border:'1px solid var(--border)',
                cursor:'pointer', transition:'background var(--t)',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--surface)'}
            >
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:24, height:24, borderRadius:'50%', marginBottom:4,
                background: isToday ? 'var(--danger)' : 'transparent',
                color: isToday ? '#fff' : 'var(--text2)',
                fontSize:12, fontWeight: isToday ? 700 : 400,
              }}>{date.getDate()}</div>
              {dayEvents.slice(0,3).map((ev,ei)=>(
                <div key={ei} onClick={e=>{e.stopPropagation();onEventClick?.(ev)}}
                  style={{
                    fontSize:11, padding:'1px 4px', borderRadius:2, marginBottom:1,
                    background: ev.color ?? 'var(--purple)', color:'#fff',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>
                  {ev.title}
                </div>
              ))}
              {dayEvents.length>3 && <div style={{fontSize:10,color:'var(--text3)'}}>+{dayEvents.length-3} more</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Week View ─────────────────────────────────────────────────── */
function WeekView({ current, today, events, onEventClick }) {
  const weekStart = getWeekStart(current)
  const days = Array.from({length:7}, (_,i) => { const d=new Date(weekStart); d.setDate(d.getDate()+i); return d })
  const hours = Array.from({length:16}, (_,i) => i+6) // 6am–9pm

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'50px repeat(7,1fr)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
        <div />
        {days.map((d,i)=>{
          const isToday = d.toDateString()===today.toDateString()
          return (
            <div key={i} style={{ padding:'8px 4px', textAlign:'center', borderLeft:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, color:'var(--text3)', textTransform:'uppercase' }}>{DAYS[d.getDay()]}</div>
              <div style={{
                width:28, height:28, borderRadius:'50%', margin:'2px auto 0',
                background: isToday ? 'var(--danger)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, fontWeight:600, color: isToday ? '#fff' : 'var(--text)',
              }}>{d.getDate()}</div>
            </div>
          )
        })}
      </div>
      {/* Time grid */}
      {hours.map(h => (
        <div key={h} style={{ display:'grid', gridTemplateColumns:'50px repeat(7,1fr)', minHeight:44, borderBottom:'1px solid var(--border)' }}>
          <div style={{ padding:'4px 8px 0 0', fontSize:11, color:'var(--text3)', textAlign:'right', lineHeight:1 }}>{h===12?'12pm':h>12?`${h-12}pm`:`${h}am`}</div>
          {days.map((d,di)=>{
            const dayEvs = events.filter(ev=>{
              const es=new Date(ev.start); return es.getFullYear()===d.getFullYear()&&es.getMonth()===d.getMonth()&&es.getDate()===d.getDate()&&es.getHours()===h
            })
            return (
              <div key={di} style={{ borderLeft:'1px solid var(--border)', padding:2, position:'relative' }}>
                {dayEvs.map((ev,ei)=>(
                  <div key={ei} onClick={()=>onEventClick?.(ev)}
                    style={{ fontSize:11, padding:'2px 4px', borderRadius:3, background:ev.color??'var(--purple)', color:'#fff', marginBottom:2, cursor:'pointer', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {ev.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ── Day View ──────────────────────────────────────────────────── */
function DayView({ current, today, events, onEventClick }) {
  const hours = Array.from({length:16},(_,i)=>i+6)
  const dayEvs = (h) => events.filter(ev=>{
    const es=new Date(ev.start)
    return es.getFullYear()===current.getFullYear()&&es.getMonth()===current.getMonth()&&es.getDate()===current.getDate()&&es.getHours()===h
  })
  return (
    <div>
      {hours.map(h=>(
        <div key={h} style={{ display:'grid', gridTemplateColumns:'60px 1fr', minHeight:44, borderBottom:'1px solid var(--border)' }}>
          <div style={{ padding:'4px 8px 0 12px', fontSize:11, color:'var(--text3)', textAlign:'right' }}>
            {h===12?'12pm':h>12?`${h-12}pm`:`${h}am`}
          </div>
          <div style={{ borderLeft:'1px solid var(--border)', padding:4 }}>
            {dayEvs(h).map((ev,i)=>(
              <div key={i} onClick={()=>onEventClick?.(ev)}
                style={{ fontSize:12, padding:'3px 8px', borderRadius:4, background:ev.color??'var(--purple)', color:'#fff', marginBottom:2, cursor:'pointer' }}>
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────────── */
function getWeekStart(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return d
}
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}
