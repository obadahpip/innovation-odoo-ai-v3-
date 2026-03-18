/**
 * MaintenancePage.jsx — Maintenance module
 * Lesson 45: Maintenance
 * Selectors: confirm-button, create-button, field-name, field-type, list-row, save-button
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

function MaintShell({ children }) {
  const navigate = useNavigate()
  const SECTIONS = [
    { label: 'MAINTENANCE', items: [
      { label: 'Maintenance Requests', path: '/erp/maintenance',          icon: '🔧' },
      { label: 'Equipment',            path: '/erp/maintenance/equipment',icon: '⚙' },
    ]},
    { label: 'REPORTING', items: [
      { label: 'Analysis',             path: '/erp/maintenance/reporting',icon: '📊' },
    ]},
    { label: 'CONFIGURATION', items: [
      { label: 'Stages',               path: '/erp/maintenance/stages',   icon: '📌' },
      { label: 'Teams',                path: '/erp/maintenance/teams',    icon: '👥' },
    ]},
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 210, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        {SECTIONS.map(s => (
          <div key={s.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            {s.items.map(item => (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'all var(--t)' }}
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

async function seedMaintenance() {
  const [reqs, stages] = await Promise.all([
    listRecords('maintenance.request'),
    listRecords('maintenance.stage'),
  ])
  if (stages.length === 0) {
    for (const s of [
      { name: 'New',         sequence: 1, done: false },
      { name: 'In Progress', sequence: 2, done: false },
      { name: 'Repaired',    sequence: 3, done: true  },
      { name: 'Scrap',       sequence: 4, done: true  },
    ]) await createRecord('maintenance.stage', s)
  }
  if (reqs.length === 0) {
    for (const r of [
      { name: 'CNC Machine — Bearing replacement', stage_id: 'New',         maintenance_type: 'corrective',  priority: '1', equipment_id: 'CNC Machine #1',    user_id: 'Mitchell Admin' },
      { name: 'Conveyor belt lubrication',         stage_id: 'In Progress', maintenance_type: 'preventive',  priority: '0', equipment_id: 'Conveyor Belt A',   user_id: 'Marc Demo' },
      { name: 'Forklift — Annual inspection',      stage_id: 'Repaired',    maintenance_type: 'preventive',  priority: '2', equipment_id: 'Forklift #2',       user_id: 'Mitchell Admin' },
      { name: 'Air compressor leak',               stage_id: 'New',         maintenance_type: 'corrective',  priority: '3', equipment_id: 'Air Compressor',    user_id: 'Marc Demo' },
    ]) await createRecord('maintenance.request', r)
  }
}

/* ── Requests List ──────────────────────────────────────────────── */
export function MaintenancePage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('maintenance.request', { sortKey: 'name' })
  useEffect(() => { seedMaintenance().then(reload) }, [])

  const PRIO_COLOR = { '0': 'var(--text3)', '1': '#17a2b8', '2': 'var(--warning)', '3': 'var(--danger)' }
  const PRIO_LABEL = { '0': 'Normal', '1': 'Important', '2': 'Very Urgent', '3': 'Critical' }
  const STAGE_COLOR = { New: 'var(--text3)', 'In Progress': 'var(--teal)', Repaired: 'var(--success)', Scrap: 'var(--danger)' }

  const columns = [
    { key: 'name',             label: 'Request',       style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'equipment_id',     label: 'Equipment',     style: { color: 'var(--text2)' } },
    { key: 'maintenance_type', label: 'Type',          render: v => <Badge label={v || 'corrective'} color="#17a2b8" /> },
    { key: 'priority',         label: 'Priority',      render: v => <Badge label={PRIO_LABEL[v] || 'Normal'} color={PRIO_COLOR[v] || 'var(--text3)'} /> },
    { key: 'user_id',          label: 'Technician',    style: { color: 'var(--text2)' } },
    { key: 'stage_id',         label: 'Stage',         render: v => <Badge label={v || 'New'} color={STAGE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <MaintShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Maintenance Requests</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/maintenance/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={TH}><input type="checkbox" /></th>
              {columns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
            </tr></thead>
            <tbody>
              {records.map(row => (
                <tr key={row.id} data-erp="list-row" onClick={() => navigate(`/erp/maintenance/${row.id}`)}
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
    </MaintShell>
  )
}

/* ── Maintenance Request Form ───────────────────────────────────── */
export function MaintenanceForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', equipment_id: '', maintenance_type: 'corrective', priority: '0', stage_id: 'New', user_id: 'Mitchell Admin', description: '' })
  const [stages, setStages] = useState([])

  useEffect(() => {
    seedMaintenance()
    listRecords('maintenance.stage').then(s => setStages(s.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))))
    if (!isNew) getRecord('maintenance.request', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('maintenance.request', vals)
    else       await updateRecord('maintenance.request', id, vals)
    navigate('/erp/maintenance')
  }

  const handleConfirm = async () => {
    setVals(p => ({ ...p, stage_id: 'In Progress' }))
    await handleSave()
  }

  const fields = [
    { key: 'name',             label: 'Request Name',    required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'equipment_id',     label: 'Equipment',       placeholder: 'e.g. CNC Machine #1' },
    { key: 'maintenance_type', label: 'Maintenance Type', type: 'select', dataErp: 'field-type',
      options: ['corrective', 'preventive'] },
    { key: 'priority',         label: 'Priority',         type: 'select', dataErp: 'field-type',
      options: [{ value: '0', label: 'Normal' }, { value: '1', label: 'Important' }, { value: '2', label: 'Very Urgent' }, { value: '3', label: 'Critical' }] },
    { key: 'stage_id',         label: 'Stage',            type: 'select', dataErp: 'field-type',
      options: stages.map(s => s.name) },
    { key: 'user_id',          label: 'Responsible',      placeholder: 'Technician name' },
    { key: 'description',      label: 'Description',      type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <MaintShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/maintenance')}>Discard</button>
          <span style={{ flex: 1 }} />
          {vals.stage_id === 'New' && (
            <button data-erp="confirm-button" className="btn btn-primary btn-sm"
              style={{ background: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleConfirm}>
              Confirm
            </button>
          )}
          <button data-erp="create-button" className="btn btn-secondary btn-sm" onClick={() => {}}>
            + Schedule Activity
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
                      {(f.options || []).map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
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
    </MaintShell>
  )
}
