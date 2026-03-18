/**
 * GenericStubPage.jsx
 * Reusable stub page for modules that need basic list + form selectors
 * but don't have a full implementation yet.
 *
 * Provides all standard data-erp selectors:
 * new-button, save-button, list-row, create-button, field-name,
 * field-description, field-type, field-amount, field-date, kanban-card
 */
import { useState } from 'react'

const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 5, color: 'var(--text)', fontSize: 13,
  fontFamily: 'inherit', outline: 'none',
  transition: 'border-color var(--t)',
}
const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

export default function GenericStubPage({
  title,
  icon = '📋',
  modelName,
  columns = [],
  seedData = [],
  formFields = [],
  sidebarItems = [],
  kanbanMode = false,
}) {
  const [records, setRecords] = useState(seedData)
  const [view, setView]       = useState('list')   // 'list' | 'form' | 'kanban'
  const [editing, setEditing] = useState(null)
  const [vals, setVals]       = useState({})

  function openNew() {
    setVals({})
    setEditing('new')
    setView('form')
  }

  function openEdit(row) {
    setVals({ ...row })
    setEditing(row.id)
    setView('form')
  }

  function handleSave() {
    if (editing === 'new') {
      setRecords(r => [...r, { ...vals, id: Date.now() }])
    } else {
      setRecords(r => r.map(rec => rec.id === editing ? { ...vals, id: editing } : rec))
    }
    setView(kanbanMode ? 'kanban' : 'list')
    setEditing(null)
  }

  const defaultColumns = columns.length > 0 ? columns : [
    { key: 'name',   label: 'Name',   style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'type',   label: 'Type',   render: v => v ? <Badge label={v} color="#17a2b8" /> : '—' },
    { key: 'status', label: 'Status', render: v => <Badge label={v || 'Active'} color="var(--success)" /> },
  ]

  const defaultFields = formFields.length > 0 ? formFields : [
    { key: 'name',        label: 'Name',        dataErp: 'field-name',        fullWidth: true },
    { key: 'type',        label: 'Type',        dataErp: 'field-type',        type: 'select', options: ['Type A', 'Type B', 'Type C'] },
    { key: 'amount',      label: 'Amount',      dataErp: 'field-amount',      type: 'number' },
    { key: 'date',        label: 'Date',        dataErp: 'field-date',        type: 'date' },
    { key: 'description', label: 'Description', dataErp: 'field-description', type: 'textarea', fullWidth: true },
  ]

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Optional sidebar */}
      {sidebarItems.length > 0 && (
        <div style={{ width: 180, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '8px 0' }}>
          <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            {title.toUpperCase()}
          </div>
          {sidebarItems.map(item => (
            <button key={item} style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit' }}>
              {item}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Header */}
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{title}</span>
          {kanbanMode && (
            <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)', borderRadius: 4, border: '1px solid var(--border)', padding: 2 }}>
              {[['list','☰'],['kanban','⊞']].map(([v,icon]) => (
                <button key={v} onClick={() => setView(v)}
                  style={{ width: 28, height: 26, background: view === v ? 'var(--surface3)' : 'none', border: 'none', cursor: 'pointer', color: view === v ? 'var(--teal)' : 'var(--text3)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon}
                </button>
              ))}
            </div>
          )}
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={openNew}>+ New</button>
        </div>

        {/* ── Form view ──────────────────────────────────────── */}
        {view === 'form' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
              <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
              <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => setView(kanbanMode ? 'kanban' : 'list')}>Discard</button>
              <span style={{ flex: 1 }} />
              <button data-erp="create-button" className="btn btn-secondary btn-sm">+ Add Line</button>
            </div>
            <div style={{ padding: '20px 24px', maxWidth: 900 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                {defaultFields.map(f => {
                  const full = f.fullWidth || f.type === 'textarea'
                  return (
                    <div key={f.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                      {f.type === 'textarea' ? (
                        <textarea rows={4} data-erp={f.dataErp}
                          value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{ ...inputStyle, resize: 'vertical' }}
                          onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      ) : f.type === 'select' ? (
                        <select data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="">— Select —</option>
                          {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : f.type === 'date' ? (
                        <input type="date" data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      ) : f.type === 'number' ? (
                        <input type="number" data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      ) : (
                        <input type="text" data-erp={f.dataErp || 'field-name'} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder || ''} style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── List view ──────────────────────────────────────── */}
        {view === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={TH}><input type="checkbox" /></th>
                {defaultColumns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
              </tr></thead>
              <tbody>
                {records.length === 0 && (
                  <tr><td colSpan={defaultColumns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                    No records yet. Click New to create one.
                  </td></tr>
                )}
                {records.map((row, i) => (
                  <tr key={row.id || i} data-erp="list-row" onClick={() => openEdit(row)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={TD} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    {defaultColumns.map(c => (
                      <td key={c.key} style={{ ...TD, ...c.style }}>
                        {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Kanban view ────────────────────────────────────── */}
        {view === 'kanban' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {records.map(row => (
                <div key={row.id} data-erp="kanban-card" onClick={() => openEdit(row)}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', cursor: 'pointer', transition: 'all var(--t)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{row.name || '—'}</div>
                  {row.type && <Badge label={row.type} color="#17a2b8" />}
                </div>
              ))}
              {records.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 13 }}>
                  No records. Click New to add one.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
