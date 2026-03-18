/**
 * HelpdeskPage.jsx — Helpdesk module
 * Lesson 10: Stages — selectors: app-helpdesk, field-amount, field-name, new-button, save-button
 * Lesson 66: Helpdesk — selectors: field-description, field-name, field-type, new-button, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

/* ── Styles ─────────────────────────────────────────────────────── */
const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }
const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

/* ── Sidebar ────────────────────────────────────────────────────── */
const SIDEBAR = [
  { label: 'HELPDESK', items: [
    { label: 'My Tickets',    path: '/erp/helpdesk',          icon: '🎧' },
    { label: 'All Tickets',   path: '/erp/helpdesk/all',      icon: '📋' },
    { label: 'My Teams',      path: '/erp/helpdesk/teams',    icon: '👥' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Ticket Analysis', path: '/erp/helpdesk/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Stages',        path: '/erp/helpdesk/stages',   icon: '📌' },
    { label: 'Teams',         path: '/erp/helpdesk/teams',    icon: '👥' },
    { label: 'Settings',      path: '/erp/helpdesk/config',   icon: '⚙' },
  ]},
]

function HelpdeskShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 210, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        {SIDEBAR.map(section => (
          <div key={section.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  style={{
                    width: '100%', padding: '7px 14px',
                    background: active ? 'var(--surface3)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                    textAlign: 'left', fontSize: 13,
                    color: active ? 'var(--teal)' : 'var(--text2)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all var(--t)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Seed data ──────────────────────────────────────────────────── */
async function seedHelpdesk() {
  const [tickets, stages] = await Promise.all([
    listRecords('helpdesk.ticket'),
    listRecords('helpdesk.stage'),
  ])
  if (stages.length === 0) {
    for (const s of [
      { name: 'New',         sequence: 1, fold: false },
      { name: 'In Progress', sequence: 2, fold: false },
      { name: 'Waiting',     sequence: 3, fold: false },
      { name: 'Done',        sequence: 4, fold: true  },
      { name: 'Cancelled',   sequence: 5, fold: true  },
    ]) await createRecord('helpdesk.stage', s)
  }
  if (tickets.length === 0) {
    for (const t of [
      { name: 'Cannot log into the portal',      stage_id: 'New',         priority: '1', partner_id: 'Azure Interior',  ticket_type_id: 'Technical',  description: 'User reports 403 error on login.' },
      { name: 'Invoice PDF not generating',      stage_id: 'In Progress', priority: '2', partner_id: 'Agrolait',         ticket_type_id: 'Billing',    description: 'PDF export fails for invoices > 10 pages.' },
      { name: 'Product page missing images',     stage_id: 'New',         priority: '0', partner_id: 'Ready Mat',        ticket_type_id: 'Website',    description: 'Images not showing on /shop.' },
      { name: 'Wrong pricing on quotation',      stage_id: 'Waiting',     priority: '3', partner_id: 'Deco Addict',      ticket_type_id: 'Sales',      description: 'Discount not applied correctly.' },
      { name: 'Payslip export error',            stage_id: 'Done',        priority: '1', partner_id: 'Marc Demo',        ticket_type_id: 'HR',         description: 'Resolved: updated report template.' },
    ]) await createRecord('helpdesk.ticket', t)
  }
}

/* ═══════════════════════════════════════════════════════════════
   TICKETS LIST
═══════════════════════════════════════════════════════════════ */
export function HelpdeskPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('helpdesk.ticket', { sortKey: 'name' })
  useEffect(() => { seedHelpdesk().then(reload) }, [])

  const PRIORITY_COLOR = { '0': 'var(--text3)', '1': '#17a2b8', '2': 'var(--warning)', '3': 'var(--danger)' }
  const PRIORITY_LABEL = { '0': 'Low', '1': 'Normal', '2': 'High', '3': 'Urgent' }

  const columns = [
    { key: 'name',           label: 'Ticket',       style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'partner_id',     label: 'Customer',     style: { color: 'var(--text2)' } },
    { key: 'ticket_type_id', label: 'Type',         render: v => v ? <Badge label={v} color="#17a2b8" /> : '—' },
    { key: 'priority',       label: 'Priority',     render: v => <Badge label={PRIORITY_LABEL[v] || 'Normal'} color={PRIORITY_COLOR[v] || 'var(--text3)'} /> },
    { key: 'stage_id',       label: 'Stage',        render: v => v ? <Badge label={v} color={v === 'Done' ? 'var(--success)' : v === 'Cancelled' ? 'var(--danger)' : 'var(--teal)'} /> : '—' },
  ]

  return (
    <HelpdeskShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 20px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Tickets</span>
          <button
            data-erp="app-helpdesk"
            style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => navigate('/erp/helpdesk')}
          >
            🎧 Helpdesk
          </button>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/helpdesk/new')}>
            + New
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={TH}><input type="checkbox" /></th>
                {columns.map(c => <th key={c.key} style={TH}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                  No tickets yet.
                </td></tr>
              )}
              {records.map(row => (
                <tr key={row.id}
                  data-erp="list-row"
                  onClick={() => navigate(`/erp/helpdesk/${row.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={TD} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  {columns.map(c => (
                    <td key={c.key} style={{ ...TD, ...c.style }}>
                      {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HelpdeskShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TICKET FORM (L66)
═══════════════════════════════════════════════════════════════ */
export function HelpdeskForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', partner_id: '', ticket_type_id: '', priority: '0', stage_id: 'New', description: '', tag_ids: '' })
  const [stages, setStages] = useState([])

  useEffect(() => {
    seedHelpdesk()
    listRecords('helpdesk.stage').then(s => setStages(s.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))))
    if (!isNew) getRecord('helpdesk.ticket', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('helpdesk.ticket', vals)
    else       await updateRecord('helpdesk.ticket', id, vals)
    navigate('/erp/helpdesk')
  }

  const fields = [
    { key: 'name',           label: 'Ticket Subject',  required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'partner_id',     label: 'Customer',        placeholder: 'Customer name or email' },
    { key: 'ticket_type_id', label: 'Ticket Type',     type: 'select', dataErp: 'field-type',
      options: ['Technical', 'Billing', 'Website', 'Sales', 'HR', 'General'] },
    { key: 'priority',       label: 'Priority',        type: 'select', dataErp: 'field-type',
      options: [{ value: '0', label: 'Low' }, { value: '1', label: 'Normal' }, { value: '2', label: 'High' }, { value: '3', label: 'Urgent' }] },
    { key: 'stage_id',       label: 'Stage',           type: 'select', dataErp: 'field-type',
      options: stages.map(s => s.name) },
    { key: 'tag_ids',        label: 'Tags',            placeholder: 'e.g. billing, urgent' },
    { key: 'description',    label: 'Description',     type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <HelpdeskShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Action bar */}
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/helpdesk')}>Discard</button>
        </div>
        {/* Fields */}
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {fields.map(field => {
              const full = field.fullWidth || field.type === 'textarea'
              return (
                <div key={field.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {field.label}{field.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea rows={5} data-erp={field.dataErp}
                      value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder || ''} style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : field.type === 'select' ? (
                    <select data-erp={field.dataErp}
                      value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">— Select —</option>
                      {(field.options || []).map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                    </select>
                  ) : (
                    <input type="text" data-erp={field.dataErp || (field.key === 'name' ? 'field-name' : `field-${field.key}`)}
                      value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder || ''} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </HelpdeskShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STAGES CONFIG (L10)
═══════════════════════════════════════════════════════════════ */
export function HelpdeskStagesPage() {
  const navigate = useNavigate()
  const { records: stages, reload } = useRecordList('helpdesk.stage', { sortKey: 'sequence' })
  const [showNew, setShowNew] = useState(false)
  const [newVals, setNewVals] = useState({ name: '', sequence: '', fold: false })

  useEffect(() => { seedHelpdesk().then(reload) }, [])

  const handleCreate = async () => {
    if (!newVals.name.trim()) return
    await createRecord('helpdesk.stage', newVals)
    setNewVals({ name: '', sequence: '', fold: false })
    setShowNew(false)
    reload()
  }

  return (
    <HelpdeskShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Helpdesk Stages</span>
          <button
            data-erp="new-button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowNew(true)}
          >+ New</button>
        </div>

        {/* Inline new stage form */}
        {showNew && (
          <div style={{ padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase' }}>Stage Name</label>
              <input
                autoFocus
                data-erp="field-name"
                value={newVals.name}
                onChange={e => setNewVals(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Under Review"
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase' }}>Sequence</label>
              <input
                type="number"
                data-erp="field-amount"
                value={newVals.sequence}
                onChange={e => setNewVals(p => ({ ...p, sequence: e.target.value }))}
                placeholder="e.g. 3"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button data-erp="save-button" className="btn btn-primary btn-sm" onClick={handleCreate}>Save</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Stages list */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={TH}>Stage Name</th>
                <th style={TH}>Sequence</th>
                <th style={TH}>Folded in Kanban</th>
              </tr>
            </thead>
            <tbody>
              {stages.map(stage => (
                <tr key={stage.id}
                  data-erp="list-row"
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{stage.name}</td>
                  <td style={{ ...TD, color: 'var(--text2)' }}>{stage.sequence}</td>
                  <td style={TD}>
                    <Badge
                      label={stage.fold ? 'Yes' : 'No'}
                      color={stage.fold ? 'var(--text3)' : 'var(--success)'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HelpdeskShell>
  )
}
