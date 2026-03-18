/**
 * AppointmentsPage.jsx — Appointments module
 * Lesson 76: Appointments
 * Selectors: create-button, field-amount, field-description, field-name,
 *            field-type, new-button, save-button
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

function ApptShell({ children }) {
  const navigate = useNavigate()
  const sections = [
    { label: 'APPOINTMENTS', items: [
      { label: 'Appointments',     path: '/erp/appointments',          icon: '📅' },
      { label: 'Appointment Types',path: '/erp/appointments/types',    icon: '⚙' },
    ]},
    { label: 'REPORTING', items: [
      { label: 'Analysis',         path: '/erp/appointments/reporting',icon: '📊' },
    ]},
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 200, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        {sections.map(s => (
          <div key={s.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            {s.items.map(item => (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

async function seedAppointments() {
  const [types, appts] = await Promise.all([
    listRecords('appointment.type'),
    listRecords('appointment.appointment'),
  ])
  if (types.length === 0) {
    for (const t of [
      { name: 'General Consultation',   appointment_duration: 30, min_schedule_hours: 1,  max_schedule_days: 30, assign_method: 'random',     location_id: '', category: 'custom' },
      { name: 'Technical Support Call', appointment_duration: 60, min_schedule_hours: 2,  max_schedule_days: 14, assign_method: 'time_auto',  location_id: '', category: 'custom' },
      { name: 'Product Demo',           appointment_duration: 45, min_schedule_hours: 24, max_schedule_days: 60, assign_method: 'chosen',     location_id: 'Online', category: 'custom' },
    ]) await createRecord('appointment.type', t)
  }
  if (appts.length === 0) {
    for (const a of [
      { name: 'Appointment with Azure Interior',  appointment_type_id: 'General Consultation', partner_id: 'Azure Interior', start: '2025-03-20 10:00', stop: '2025-03-20 10:30', state: 'booked' },
      { name: 'Tech call with Agrolait',          appointment_type_id: 'Technical Support Call', partner_id: 'Agrolait',      start: '2025-03-22 14:00', stop: '2025-03-22 15:00', state: 'booked' },
      { name: 'Product demo — Ready Mat',         appointment_type_id: 'Product Demo',          partner_id: 'Ready Mat',     start: '2025-04-02 11:00', stop: '2025-04-02 11:45', state: 'draft'  },
    ]) await createRecord('appointment.appointment', a)
  }
}

/* ── Appointments List ──────────────────────────────────────────── */
export function AppointmentsPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('appointment.appointment', { sortKey: 'start' })
  useEffect(() => { seedAppointments().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', booked: 'var(--success)', cancel: 'var(--danger)' }

  const columns = [
    { key: 'name',                  label: 'Appointment',   style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'appointment_type_id',   label: 'Type',          render: v => v ? <Badge label={v} color="#17a2b8" /> : '—' },
    { key: 'partner_id',            label: 'Customer',      style: { color: 'var(--text2)' } },
    { key: 'start',                 label: 'Start',         style: { color: 'var(--text2)', fontSize: 12 } },
    { key: 'state',                 label: 'Status',        render: v => <Badge label={v || 'draft'} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <ApptShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Appointments</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/appointments/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={TH}><input type="checkbox" /></th>
              {columns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
            </tr></thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>No appointments yet.</td></tr>
              )}
              {records.map(row => (
                <tr key={row.id} data-erp="list-row" onClick={() => navigate(`/erp/appointments/${row.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={TD} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  {columns.map(c => <td key={c.key} style={{ ...TD, ...c.style }}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ApptShell>
  )
}

/* ── Appointment Types List ─────────────────────────────────────── */
export function AppointmentTypesPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('appointment.type', { sortKey: 'name' })
  useEffect(() => { seedAppointments().then(reload) }, [])

  const columns = [
    { key: 'name',                  label: 'Type Name',       style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'appointment_duration',  label: 'Duration (min)',  style: { color: 'var(--text2)' } },
    { key: 'assign_method',         label: 'Assignment',      render: v => v ? <Badge label={v} color="#17a2b8" /> : '—' },
    { key: 'max_schedule_days',     label: 'Max Days Ahead',  style: { color: 'var(--text2)' } },
  ]

  return (
    <ApptShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Appointment Types</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/appointments/types/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              {columns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
            </tr></thead>
            <tbody>
              {records.map(row => (
                <tr key={row.id} data-erp="list-row" onClick={() => navigate(`/erp/appointments/types/${row.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {columns.map(c => <td key={c.key} style={{ ...TD, ...c.style }}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ApptShell>
  )
}

/* ── Appointment / Type Form ────────────────────────────────────── */
export function AppointmentsForm({ mode = 'appointment' }) {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'
  const isType   = mode === 'type'

  const [vals, setVals] = useState(isType
    ? { name: '', appointment_duration: 30, min_schedule_hours: 1, max_schedule_days: 30, assign_method: 'random', category: 'custom', description: '' }
    : { name: '', appointment_type_id: '', partner_id: '', start: '', stop: '', state: 'draft' }
  )

  useEffect(() => {
    const model = isType ? 'appointment.type' : 'appointment.appointment'
    if (!isNew) getRecord(model, id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    const model = isType ? 'appointment.type' : 'appointment.appointment'
    if (isNew) await createRecord(model, vals)
    else       await updateRecord(model, id, vals)
    navigate(isType ? '/erp/appointments/types' : '/erp/appointments')
  }

  const apptFields = [
    { key: 'name',                label: 'Title',          required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'appointment_type_id', label: 'Appointment Type', type: 'select', dataErp: 'field-type',
      options: ['General Consultation', 'Technical Support Call', 'Product Demo'] },
    { key: 'partner_id',          label: 'Customer',       placeholder: 'Customer name' },
    { key: 'start',               label: 'Start',          placeholder: 'YYYY-MM-DD HH:MM' },
    { key: 'stop',                label: 'End',            placeholder: 'YYYY-MM-DD HH:MM' },
  ]

  const typeFields = [
    { key: 'name',                  label: 'Type Name',       required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'appointment_duration',  label: 'Duration (min)',  type: 'number', dataErp: 'field-amount' },
    { key: 'min_schedule_hours',    label: 'Min Notice (hrs)',type: 'number', dataErp: 'field-amount' },
    { key: 'max_schedule_days',     label: 'Max Days Ahead',  type: 'number', dataErp: 'field-amount' },
    { key: 'assign_method',         label: 'Assignment Method', type: 'select', dataErp: 'field-type',
      options: ['random', 'chosen', 'time_auto'] },
    { key: 'category',              label: 'Category',        type: 'select', dataErp: 'field-type',
      options: ['custom', 'website', 'phone', 'video'] },
    { key: 'description',           label: 'Description',     type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  const fields = isType ? typeFields : apptFields

  return (
    <ApptShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate(isType ? '/erp/appointments/types' : '/erp/appointments')}>Discard</button>
          <span style={{ flex: 1 }} />
          <button data-erp="create-button" className="btn btn-secondary btn-sm" onClick={() => {}}>
            📅 Add Time Slot
          </button>
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
                  ) : f.type === 'number' ? (
                    <input type="number" data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
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
    </ApptShell>
  )
}
