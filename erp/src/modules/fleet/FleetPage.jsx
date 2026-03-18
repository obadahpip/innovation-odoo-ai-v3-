/**
 * FleetPage.jsx — Fleet module
 * Lesson 55: Fleet
 * Selectors: create-button, field-amount, field-date, field-description, field-name, list-row, save-button
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

function FleetShell({ children }) {
  const navigate = useNavigate()
  const SECTIONS = [
    { label: 'FLEET', items: [
      { label: 'Vehicles',       path: '/erp/fleet',            icon: '🚗' },
      { label: 'Contracts',      path: '/erp/fleet/contracts',  icon: '📋' },
    ]},
    { label: 'REPORTING', items: [
      { label: 'Fleet Analysis', path: '/erp/fleet/reporting',  icon: '📊' },
    ]},
    { label: 'CONFIGURATION', items: [
      { label: 'Models',         path: '/erp/fleet/models',     icon: '🏎' },
      { label: 'Settings',       path: '/erp/fleet/config',     icon: '⚙' },
    ]},
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 200, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
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

async function seedFleet() {
  const existing = await listRecords('fleet.vehicle')
  if (existing.length > 0) return
  for (const v of [
    { name: 'Toyota Corolla / TN-453-BC', license_plate: 'TN-453-BC', model_id: 'Toyota Corolla', driver_id: 'Mitchell Admin',   state_id: 'In Progress',  acquisition_date: '2022-03-15', odometer: 34820, fuel_type: 'Diesel' },
    { name: 'VW Golf / GH-789-XY',        license_plate: 'GH-789-XY', model_id: 'VW Golf',        driver_id: 'Marc Demo',        state_id: 'New',          acquisition_date: '2023-07-01', odometer: 12400, fuel_type: 'Gasoline' },
    { name: 'Tesla Model 3 / EV-001-ZZ',  license_plate: 'EV-001-ZZ', model_id: 'Tesla Model 3',  driver_id: 'Abigail Peterson', state_id: 'In Progress',  acquisition_date: '2024-01-10', odometer: 5900,  fuel_type: 'Electric' },
    { name: 'Ford Transit / FT-222-QQ',   license_plate: 'FT-222-QQ', model_id: 'Ford Transit',   driver_id: '',                 state_id: 'Archived',     acquisition_date: '2019-06-20', odometer: 98500, fuel_type: 'Diesel' },
  ]) await createRecord('fleet.vehicle', v)
}

/* ── Vehicles List ──────────────────────────────────────────────── */
export function FleetPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('fleet.vehicle', { sortKey: 'name' })
  useEffect(() => { seedFleet().then(reload) }, [])

  const STATE_COLOR = { New: 'var(--teal)', 'In Progress': 'var(--success)', Archived: 'var(--text3)' }

  const columns = [
    { key: 'name',            label: 'Vehicle',      style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'license_plate',   label: 'License Plate', style: { fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' } },
    { key: 'driver_id',       label: 'Driver',       style: { color: 'var(--text2)' } },
    { key: 'fuel_type',       label: 'Fuel',         render: v => v ? <Badge label={v} color="#17a2b8" /> : '—' },
    { key: 'odometer',        label: 'Odometer',     render: v => v ? `${Number(v).toLocaleString()} km` : '—' },
    { key: 'state_id',        label: 'Status',       render: v => <Badge label={v || 'New'} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <FleetShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Fleet Vehicles</span>
          <button data-erp="create-button" className="btn btn-secondary btn-sm" onClick={() => {}}>+ Add Contract</button>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/fleet/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={TH}><input type="checkbox" /></th>
              {columns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
            </tr></thead>
            <tbody>
              {records.map(row => (
                <tr key={row.id} data-erp="list-row" onClick={() => navigate(`/erp/fleet/${row.id}`)}
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
    </FleetShell>
  )
}

/* ── Vehicle Form ───────────────────────────────────────────────── */
export function FleetForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', license_plate: '', model_id: '', driver_id: '', fuel_type: 'Gasoline', state_id: 'New', acquisition_date: '', odometer: '', description: '' })
  const [tab, setTab] = useState('General')

  useEffect(() => {
    if (!isNew) getRecord('fleet.vehicle', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('fleet.vehicle', vals)
    else       await updateRecord('fleet.vehicle', id, vals)
    navigate('/erp/fleet')
  }

  const generalFields = [
    { key: 'name',             label: 'Vehicle',         required: true, dataErp: 'field-name',        fullWidth: true },
    { key: 'license_plate',    label: 'License Plate' },
    { key: 'model_id',         label: 'Model',           placeholder: 'e.g. Toyota Corolla' },
    { key: 'driver_id',        label: 'Driver',          placeholder: 'Assigned driver' },
    { key: 'fuel_type',        label: 'Fuel Type',       type: 'select', dataErp: 'field-type',
      options: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'] },
    { key: 'state_id',         label: 'Status',          type: 'select', dataErp: 'field-type',
      options: ['New', 'In Progress', 'Archived'] },
    { key: 'acquisition_date', label: 'Acquisition Date', type: 'date',  dataErp: 'field-date' },
    { key: 'odometer',         label: 'Last Odometer (km)', type: 'number', dataErp: 'field-amount' },
  ]
  const infoFields = [
    { key: 'description', label: 'Notes', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <FleetShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/fleet')}>Discard</button>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px', flexShrink: 0 }}>
          {['General', 'Contracts', 'Notes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 16px', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--teal)' : '2px solid transparent', color: tab === t ? 'var(--teal)' : 'var(--text2)', fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {(tab === 'General' ? generalFields : tab === 'Notes' ? infoFields : []).map(f => {
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
                      {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'date' ? (
                    <input type="date" data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
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
    </FleetShell>
  )
}
