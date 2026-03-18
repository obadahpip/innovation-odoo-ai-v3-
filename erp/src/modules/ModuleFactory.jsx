/**
 * ModuleFactory.jsx
 * Shared base components used by all 47 new modules.
 * Each module imports these and layers their specific UI on top.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList, useRecord } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'
import Chatter from '@shell/Chatter.jsx'

// ── Generic List View ─────────────────────────────────────────────
export function GenericList({
  model, title, columns, filter, sortKey = '__createdAt', sortDir = 'desc',
  onNew, newPath, formPath,
  searchFields = ['name'],
  badge, emptyIcon = '📋', emptyText,
  views = ['list'], extraBtns,
}) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const pageSize = 80

  const { records, total, loading } = useRecordList(model, {
    filter, sortKey, sortDir,
    search, searchFields,
    page, pageSize,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={onNew || (() => navigate(newPath || '#'))}
        title={title} showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={page} totalCount={total} pageSize={pageSize}
        onPrev={() => setPage(p => Math.max(1, p-1))}
        onNext={() => setPage(p => p+1)}
        views={views} activeView="list"
      />
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></th>
              {columns.map(c => (
                <th key={c.key} style={{ padding:'8px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', textAlign: c.align || 'left', width: c.width, borderBottom:'1px solid var(--border)' }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}
                style={{ borderBottom:'1px solid var(--border)', cursor: formPath ? 'pointer' : 'default' }}
                onClick={() => formPath && navigate(formPath.replace(':id', r.id))}
                onMouseEnter={e => { if(formPath) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding:'0 12px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/>
                </td>
                {columns.map(c => (
                  <td key={c.key} style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', textAlign: c.align || 'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.render ? c.render(r[c.key], r) : (r[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="empty-state">
            <div style={{ fontSize:40, opacity:0.2 }}>{emptyIcon}</div>
            <h3>{emptyText || `No ${title?.toLowerCase()} found`}</h3>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Status badge renderer ─────────────────────────────────────────
export function StateBadge({ value, map }) {
  const cfg = map[value] || { label: value || '—', color:'var(--text3)', bg:'var(--surface3)' }
  return (
    <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:cfg.bg, color:cfg.color }}>
      {cfg.label}
    </span>
  )
}

// ── Priority stars ────────────────────────────────────────────────
export function PriorityStars({ value = '0', max = 3 }) {
  const n = parseInt(value || '0')
  return (
    <div style={{ display:'flex', gap:1 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ fontSize:12, color: i < n ? '#f0ad4e' : 'var(--border2)' }}>★</span>
      ))}
    </div>
  )
}

// ── Generic Form ──────────────────────────────────────────────────
export function GenericForm({
  model, id, defaults, title, backPath, backLabel,
  stages, stateField = 'state', stageMap,
  children, extraActions,
}) {
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, setFields, save } = useRecord(model, !id||id==='new'?null:id, defaults)
  const [messages, setMessages] = useState([
    { id:1, author:'obadah abuodah', body:'Creating a new record...', date:new Date().toISOString(), type:'note' }
  ])

  const handleSave = async () => {
    const s = await save()
    if (!id || id === 'new') navigate(`${backPath}/${s.id}`, { replace:true })
  }

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner"/></div>

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer', padding:0 }} onClick={() => navigate(backPath)}>{backLabel}</button>
        <span style={{ color:'var(--text3)' }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || record?.number || title || 'New'}</span>
        {isDirty && <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save</button>}
        {extraActions}

        {/* Stage pills */}
        {stages && (
          <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
            {stages.map((s, i) => {
              const isActive = record?.[stateField] === s.value || (!record?.[stateField] && i===0)
              const isPast   = stages.findIndex(x => x.value === record?.[stateField]) > i
              return (
                <button key={s.value} onClick={() => setField(stateField, s.value)} style={{
                  padding:'3px 12px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:'inherit',
                  border:`1px solid ${isActive ? 'var(--teal)' : 'var(--border2)'}`,
                  background: isActive ? 'var(--surface3)' : isPast ? 'rgba(0,181,181,0.1)' : 'transparent',
                  color: isActive ? 'var(--teal)' : isPast ? 'var(--text2)' : 'var(--text3)',
                  fontWeight: isActive ? 600 : 400,
                }}>{s.label}</button>
              )
            })}
          </div>
        )}

        <div style={{ display:'flex', gap:4, marginLeft: stages ? 12 : 'auto' }}>
          {['Send message','Log note','Activity'].map(t => (
            <button key={t} className="btn btn-secondary btn-sm" style={{ fontSize:11, padding:'2px 8px' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {children({ record, setField, setFields, isDirty })}
        </div>
        <div style={{ width:320, borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName={model} recordId={record?.id} messages={messages} onSend={msg => setMessages(m => [...m, msg])} />
        </div>
      </div>
    </div>
  )
}

// ── Field row ─────────────────────────────────────────────────────
export function FieldRow({ label, children, cols = '140px 1fr' }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:cols, alignItems:'center', gap:8, marginBottom:10 }}>
      <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────
export function SectionLabel({ children, style }) {
  return <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10, ...style }}>{children}</div>
}

// ── Kanban Board ──────────────────────────────────────────────────
export function KanbanBoard({ model, stageModel, stageFilter, cardRenderer, onCardClick, filter }) {
  const navigate = useNavigate()
  const { records: stages } = useRecordList(stageModel || 'project.task.type', { sortKey:'sequence', filter: stageFilter })
  const { records, reload } = useRecordList(model, { filter })

  const handleStageChange = async (recordId, newStageId) => {
    const db = await import('@data/db.js')
    await db.updateRecord(model, recordId, { stage_id: newStageId })
  }

  return (
    <div style={{ flex:1, display:'flex', gap:8, padding:'12px 16px', overflowX:'auto', overflowY:'hidden', alignItems:'flex-start' }}>
      {stages.map(stage => {
        const stageRecords = records.filter(r => r.stage_id === stage.id)
        return (
          <div key={stage.id} style={{ minWidth:230, width:230, flexShrink:0, display:'flex', flexDirection:'column', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden', maxHeight:'calc(100vh - 130px)' }}>
            <div style={{ padding:'10px 10px 6px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{stage.name}</span>
              <span style={{ fontSize:11, color:'var(--text2)' }}>{stageRecords.length}</span>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'8px' }}>
              {stageRecords.map(r => cardRenderer(r, () => onCardClick && onCardClick(r)))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow, SectionLabel, KanbanBoard }
