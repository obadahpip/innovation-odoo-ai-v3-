/**
 * One2ManyField.jsx
 * Inline editable table for child record lines.
 * Used in: Sales order lines, invoice lines, BOM lines, etc.
 *
 * Props:
 *  value      — array of row objects
 *  onChange   — (newRows) => void
 *  columns    — [{ key, label, type, options, width }]
 *  readonly   — bool
 *  addLabel   — string for the "Add a line" button
 */
import { useState } from 'react'
import { generateId } from '@data/db.js'

export default function One2ManyField({ value=[], onChange, columns=[], readonly=false, addLabel='Add a line' }) {
  const [editingRow, setEditingRow] = useState(null) // row id being edited

  const addRow = () => {
    const newRow = { id: generateId(), ...Object.fromEntries(columns.map(c => [c.key, c.default ?? ''])) }
    onChange?.([...value, newRow])
    setEditingRow(newRow.id)
  }

  const updateRow = (id, key, val) => {
    onChange?.(value.map(r => r.id === id ? { ...r, [key]: val } : r))
  }

  const deleteRow = (id) => {
    onChange?.(value.filter(r => r.id !== id))
  }

  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:6, overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        display:'grid',
        gridTemplateColumns: `${columns.map(c=>c.width||'1fr').join(' ')} 32px`,
        background:'var(--surface2)',
        borderBottom:'1px solid var(--border)',
      }}>
        {columns.map(col => (
          <div key={col.key} style={{ padding:'7px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px' }}>
            {col.label}
          </div>
        ))}
        <div />
      </div>

      {/* Rows */}
      {value.map(row => (
        <div
          key={row.id}
          style={{
            display:'grid',
            gridTemplateColumns: `${columns.map(c=>c.width||'1fr').join(' ')} 32px`,
            borderBottom:'1px solid var(--border)',
            background: editingRow===row.id ? 'var(--surface2)' : 'transparent',
            transition:'background var(--t)',
          }}
          onClick={() => !readonly && setEditingRow(row.id)}
        >
          {columns.map(col => (
            <div key={col.key} style={{ padding:'5px 10px', display:'flex', alignItems:'center' }}>
              {editingRow===row.id && !readonly ? (
                <RowCell col={col} value={row[col.key]} onChange={v => updateRow(row.id, col.key, v)} />
              ) : (
                <span style={{ fontSize:13, color: row[col.key] ? 'var(--text)' : 'var(--text3)' }}>
                  {col.type==='monetary' && row[col.key] ? `$${Number(row[col.key]).toFixed(2)}` : (row[col.key] ?? '—')}
                </span>
              )}
            </div>
          ))}
          {/* Delete button */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            {!readonly && (
              <button
                onClick={e => { e.stopPropagation(); deleteRow(row.id) }}
                style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:16, lineHeight:1, padding:'2px 6px' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}
              >×</button>
            )}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {value.length === 0 && (
        <div style={{ padding:'14px 10px', fontSize:12, color:'var(--text3)', textAlign:'center' }}>
          No lines added yet
        </div>
      )}

      {/* Add line */}
      {!readonly && (
        <div style={{ padding:'6px 10px', borderTop: value.length>0 ? '1px solid var(--border)' : 'none' }}>
          <button
            onClick={addRow}
            style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer', fontFamily:'inherit', padding:'2px 0' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration='none'}
          >
            + {addLabel}
          </button>
        </div>
      )}
    </div>
  )
}

function RowCell({ col, value, onChange }) {
  if (col.type === 'selection') {
    return (
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:'100%', background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:13, fontFamily:'inherit', cursor:'pointer' }}>
        {(col.options||[]).map(o=>(
          <option key={o.value??o} value={o.value??o}>{o.label??o}</option>
        ))}
      </select>
    )
  }
  return (
    <input
      type={col.type==='monetary'||col.type==='integer'||col.type==='float' ? 'number' : 'text'}
      value={value}
      onChange={e=>onChange(e.target.value)}
      autoFocus={col.autoFocus}
      style={{ width:'100%', background:'none', border:'none', borderBottom:'1px solid var(--teal)', outline:'none', color:'var(--text)', fontSize:13, fontFamily:'inherit', padding:'1px 0' }}
    />
  )
}
