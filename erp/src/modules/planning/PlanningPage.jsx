/**
 * PlanningPage.jsx — Planning module
 * Lesson 68: Planning
 * Selectors: app-employees, field-name, kanban-card, new-button, field-date
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

async function seedPlanning() {
  const existing = await listRecords('planning.slot')
  if (existing.length > 0) return
  const now = new Date()
  const y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, '0')
  for (const s of [
    { name: 'Morning Shift',      employee_id: 'Mitchell Admin',   role_id: 'Manager',     start_datetime: `${y}-${m}-18 08:00`, end_datetime: `${y}-${m}-18 16:00`, state: 'confirmed' },
    { name: 'Afternoon Shift',    employee_id: 'Marc Demo',        role_id: 'Operator',    start_datetime: `${y}-${m}-18 14:00`, end_datetime: `${y}-${m}-18 22:00`, state: 'draft' },
    { name: 'Night Shift',        employee_id: 'Brandon Freeman',  role_id: 'Supervisor',  start_datetime: `${y}-${m}-19 22:00`, end_datetime: `${y}-${m}-20 06:00`, state: 'draft' },
    { name: 'Morning Shift',      employee_id: 'Abigail Peterson', role_id: 'Operator',    start_datetime: `${y}-${m}-19 08:00`, end_datetime: `${y}-${m}-19 16:00`, state: 'confirmed' },
    { name: 'Weekend Coverage',   employee_id: 'Laura Wright',     role_id: 'Operator',    start_datetime: `${y}-${m}-22 10:00`, end_datetime: `${y}-${m}-22 18:00`, state: 'draft' },
  ]) await createRecord('planning.slot', s)
}

/* ── Planning List / Kanban ─────────────────────────────────────── */
export function PlanningPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('kanban')
  const { records, reload } = useRecordList('planning.slot', { sortKey: 'start_datetime' })
  useEffect(() => { seedPlanning().then(reload) }, [])

  const ROLE_COLOR = { Manager: 'var(--purple)', Operator: 'var(--teal)', Supervisor: '#f59e0b' }
  const employees = [...new Set(records.map(r => r.employee_id).filter(Boolean))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Planning</span>
        <button
          data-erp="app-employees"
          style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
          onClick={() => navigate('/erp/employees')}
        >
          👥 Employees
        </button>
        <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)', borderRadius: 5, border: '1px solid var(--border)', padding: 2 }}>
          {[['kanban','⊞'],['list','☰']].map(([v,icon]) => (
            <button key={v} onClick={() => setView(v)} style={{ width: 30, height: 26, background: view === v ? 'var(--surface3)' : 'none', border: 'none', cursor: 'pointer', color: view === v ? 'var(--teal)' : 'var(--text3)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
          ))}
        </div>
        <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/planning/new')}>+ New</button>
      </div>

      {/* Kanban — grouped by employee */}
      {view === 'kanban' && (
        <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
          {employees.map(emp => {
            const empShifts = records.filter(r => r.employee_id === emp)
            return (
              <div key={emp} style={{ width: 260, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      {emp[0]}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{emp}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{empShifts.length}</span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {empShifts.map(slot => (
                    <div key={slot.id}
                      data-erp="kanban-card"
                      onClick={() => navigate(`/erp/planning/${slot.id}`)}
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', transition: 'all var(--t)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{slot.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5 }}>
                        {slot.start_datetime} →
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge label={slot.role_id || 'Staff'} color={ROLE_COLOR[slot.role_id] || 'var(--teal)'} />
                        <Badge label={slot.state || 'draft'} color={slot.state === 'confirmed' ? 'var(--success)' : 'var(--text3)'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {employees.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 13, padding: '40px 20px' }}>No shifts scheduled.</div>
          )}
        </div>
      )}

      {/* List */}
      {view === 'list' && (
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              {['Shift','Employee','Role','Start','End','Status'].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {records.map(slot => (
                <tr key={slot.id} data-erp="list-row" onClick={() => navigate(`/erp/planning/${slot.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{slot.name}</td>
                  <td style={{ ...TD, color: 'var(--text2)' }}>{slot.employee_id}</td>
                  <td style={TD}>{slot.role_id ? <Badge label={slot.role_id} color="#17a2b8" /> : '—'}</td>
                  <td style={{ ...TD, color: 'var(--text2)', fontSize: 12 }}>{slot.start_datetime}</td>
                  <td style={{ ...TD, color: 'var(--text2)', fontSize: 12 }}>{slot.end_datetime}</td>
                  <td style={TD}><Badge label={slot.state || 'draft'} color={slot.state === 'confirmed' ? 'var(--success)' : 'var(--text3)'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── Shift Form ─────────────────────────────────────────────────── */
export function PlanningForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: 'Morning Shift', employee_id: '', role_id: '', start_datetime: '', end_datetime: '', state: 'draft' })

  useEffect(() => {
    if (!isNew) getRecord('planning.slot', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('planning.slot', vals)
    else       await updateRecord('planning.slot', id, vals)
    navigate('/erp/planning')
  }

  const fields = [
    { key: 'name',           label: 'Shift Name',     required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'employee_id',    label: 'Employee',       placeholder: 'Employee name' },
    { key: 'role_id',        label: 'Role',           placeholder: 'e.g. Operator' },
    { key: 'start_datetime', label: 'Start',          placeholder: 'YYYY-MM-DD HH:MM', dataErp: 'field-date' },
    { key: 'end_datetime',   label: 'End',            placeholder: 'YYYY-MM-DD HH:MM', dataErp: 'field-date' },
    { key: 'state',          label: 'Status',         type: 'select', options: ['draft', 'confirmed'] },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
        <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/planning')}>Discard</button>
      </div>
      <div style={{ padding: '20px 24px', maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {fields.map(f => {
            const full = f.fullWidth
            return (
              <div key={f.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {f.label}{f.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                </label>
                {f.type === 'select' ? (
                  <select value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text"
                    data-erp={f.dataErp || (f.key === 'name' ? 'field-name' : `field-${f.key}`)}
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
