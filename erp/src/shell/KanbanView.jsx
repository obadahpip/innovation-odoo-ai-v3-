/**
 * KanbanView.jsx
 * Generic kanban board used by CRM, Project, Recruitment, etc.
 * Matches Odoo dark kanban: column headers with count+sum, draggable cards, color dots.
 *
 * Props:
 *  columns    — [{ id, name, color }] (the stages)
 *  records    — array of records (each has a stage_id field)
 *  stageField — string, default 'stage_id'
 *  onCardClick    — (record) => void
 *  onStageChange  — (recordId, newStageId) => void
 *  renderCard     — (record) => JSX  (optional custom card)
 *  loading        — bool
 *  onNewInStage   — (stageId) => void
 *  sumField       — string (optional monetary field to sum per column)
 *  emptyState     — { icon, title, sub }
 */
import { useState } from 'react'

export default function KanbanView({
  columns = [],
  records = [],
  stageField = 'stage_id',
  onCardClick,
  onStageChange,
  renderCard,
  loading = false,
  onNewInStage,
  sumField,
  emptyState,
}) {
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
        <div className="spinner" />
      </div>
    )
  }

  const getColumnRecords = (colId) =>
    records.filter(r => {
      const sv = r[stageField]
      return sv === colId || sv?.id === colId || sv?.name === columns.find(c=>c.id===colId)?.name
    })

  const handleDrop = (targetColId) => {
    if (dragId && targetColId !== dragOver) {
      onStageChange?.(dragId, targetColId)
    }
    setDragId(null)
    setDragOver(null)
  }

  const totalRecords = records.length

  // Show empty state overlay if no records
  const showEmpty = totalRecords === 0

  return (
    <div style={{ position:'relative', flex:1 }}>
      {/* Empty state overlay */}
      {showEmpty && (
        <div style={{
          position:'absolute', inset:0, zIndex:5,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(26,27,46,0.7)', backdropFilter:'blur(2px)',
        }}>
          <div className="empty-state">
            <div style={{ fontSize:52 }}>😊</div>
            <h3>{emptyState?.title ?? 'No records found'}</h3>
            <p>{emptyState?.sub ?? 'Create a new record to get started.'}</p>
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div style={{
        display:'flex', gap:8, padding:'12px 16px',
        overflowX:'auto', height:'100%', alignItems:'flex-start',
        minHeight:400,
      }}>
        {columns.map(col => {
          const colRecords = getColumnRecords(col.id)
          const sum = sumField ? colRecords.reduce((acc, r) => acc + (Number(r[sumField]) || 0), 0) : null

          return (
            <KanbanColumn
              key={col.id}
              col={col}
              records={colRecords}
              sum={sum}
              sumField={sumField}
              dragOver={dragOver === col.id}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDrop={() => handleDrop(col.id)}
              onDragLeave={() => setDragOver(null)}
              onCardClick={onCardClick}
              onDragStart={id => setDragId(id)}
              renderCard={renderCard}
              onNew={() => onNewInStage?.(col.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── Column ─────────────────────────────────────────────────────── */
function KanbanColumn({ col, records, sum, sumField, dragOver, onDragOver, onDrop, onDragLeave, onCardClick, onDragStart, renderCard, onNew }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      style={{
        minWidth:230, width:230, flexShrink:0,
        display:'flex', flexDirection:'column', gap:6,
        background: dragOver ? 'rgba(0,181,181,0.06)' : 'var(--surface)',
        border: `1px solid ${dragOver ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius:8, padding:'10px 8px',
        transition:'border-color var(--t), background var(--t)',
        maxHeight:'calc(100vh - 140px)', overflowY:'auto',
      }}
    >
      {/* Column header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2px', marginBottom:4, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {col.color && (
            <div style={{ width:10, height:10, borderRadius:'50%', background:col.color, flexShrink:0 }} />
          )}
          <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{col.name}</span>
          <span style={{ fontSize:11, color:'var(--text3)', background:'var(--surface3)', padding:'0 5px', borderRadius:8 }}>
            {records.length}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          {sum != null && (
            <span style={{ fontSize:11, color:'var(--text2)' }}>
              ${sum.toLocaleString('en-US',{maximumFractionDigits:0})}
            </span>
          )}
          <button
            onClick={onNew}
            style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:18, lineHeight:1, padding:'0 2px' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--teal)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}
          >+</button>
        </div>
      </div>

      {/* Cards */}
      {records.map(record => (
        <KanbanCard
          key={record.id}
          record={record}
          onClick={() => onCardClick?.(record)}
          onDragStart={() => onDragStart(record.id)}
          renderCard={renderCard}
        />
      ))}
    </div>
  )
}

/* ── Card ───────────────────────────────────────────────────────── */
function KanbanCard({ record, onClick, onDragStart, renderCard }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface3)' : 'var(--surface2)',
        border:'1px solid var(--border)',
        borderRadius:6, padding:'10px 10px',
        cursor:'pointer', flexShrink:0,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition:'background var(--t), box-shadow var(--t)',
      }}
    >
      {renderCard ? renderCard(record) : <DefaultCard record={record} />}
    </div>
  )
}

function DefaultCard({ record }) {
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {record.name ?? record.display_name ?? record.id}
      </div>
      {record.partner_name && (
        <div style={{ fontSize:12, color:'var(--text2)' }}>{record.partner_name}</div>
      )}
      {record.expected_revenue != null && (
        <div style={{ fontSize:12, color:'var(--teal)', marginTop:4 }}>
          ${Number(record.expected_revenue).toLocaleString()}
        </div>
      )}
    </div>
  )
}
