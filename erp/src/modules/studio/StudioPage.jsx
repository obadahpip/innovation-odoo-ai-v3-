/**
 * StudioPage.jsx — Odoo Studio module
 * Lessons 18 (Models), 20 (Views), 21 (Automated Actions), 23 (Approval Rules)
 * All route through website_builder screen target.
 *
 * Selectors needed:
 *   L18: kanban-card, create-button, field-name, save-button
 *   L20: list-row, create-button, field-name, field-type, field-description
 *   L21: new-button, create-button, field-name, field-type, field-description, save-button
 *   L23: new-button, create-button, field-name, field-description, kanban-card
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

/* ── Seed studio data ─────────────────────────────────────────── */
async function seedStudio() {
  const { listRecords } = await import('@data/db.js')

  const [models, views, actions, rules] = await Promise.all([
    listRecords('studio.model'),
    listRecords('studio.view'),
    listRecords('studio.action'),
    listRecords('studio.approval'),
  ])

  if (models.length === 0) {
    for (const m of [
      { name: 'Sale Order',    model: 'sale.order',    icon: '🛒', description: 'Sales orders' },
      { name: 'Contact',       model: 'res.partner',   icon: '👤', description: 'Contacts & companies' },
      { name: 'Project Task',  model: 'project.task',  icon: '📋', description: 'Project tasks' },
      { name: 'Employee',      model: 'hr.employee',   icon: '👥', description: 'Employees' },
      { name: 'Product',       model: 'product.template', icon: '📦', description: 'Products' },
      { name: 'Invoice',       model: 'account.move',  icon: '💰', description: 'Invoices' },
    ]) await createRecord('studio.model', m)
  }

  if (views.length === 0) {
    for (const v of [
      { name: 'Sale Order — List',     model: 'sale.order',  view_type: 'list',   active: true },
      { name: 'Sale Order — Form',     model: 'sale.order',  view_type: 'form',   active: true },
      { name: 'Contact — Kanban',      model: 'res.partner', view_type: 'kanban', active: true },
      { name: 'Task — Kanban',         model: 'project.task',view_type: 'kanban', active: true },
      { name: 'Employee — Form',       model: 'hr.employee', view_type: 'form',   active: true },
    ]) await createRecord('studio.view', v)
  }

  if (actions.length === 0) {
    for (const a of [
      { name: 'Send confirmation email', model_id: 'sale.order',   trigger: 'on_write',  active: true },
      { name: 'Assign to salesperson',   model_id: 'crm.lead',     trigger: 'on_create', active: true },
      { name: 'Auto-archive old leads',  model_id: 'crm.lead',     trigger: 'based_on_timed_condition', active: false },
    ]) await createRecord('studio.action', a)
  }

  if (rules.length === 0) {
    for (const r of [
      { name: 'Sale Order approval',    model_id: 'sale.order',   group_ids: 'Sales Manager', active: true },
      { name: 'Large purchase approval',model_id: 'purchase.order',group_ids: 'Purchase Manager', active: true },
    ]) await createRecord('studio.approval', r)
  }
}

/* ── Studio Shell — replaces WebsiteShell for Studio context ──── */
function StudioShell({ children, activeSection }) {
  const navigate = useNavigate()
  const SECTIONS = [
    { id: 'models',  label: 'Models',            icon: '🗄',  path: '/erp/studio' },
    { id: 'views',   label: 'Views',             icon: '🖼',  path: '/erp/studio/views' },
    { id: 'actions', label: 'Automated Actions', icon: '⚡', path: '/erp/studio/actions' },
    { id: 'reports', label: 'PDF Reports',       icon: '📄', path: '/erp/studio/reports' },
    { id: 'rules',   label: 'Approval Rules',    icon: '✅', path: '/erp/studio/rules' },
  ]

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Studio sidebar */}
      <div style={{ width: 200, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>
          Studio
        </div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => navigate(s.path)}
            style={{
              width: '100%', padding: '8px 14px',
              background: activeSection === s.id ? 'var(--surface3)' : 'transparent',
              border: 'none',
              borderLeft: activeSection === s.id ? '3px solid var(--teal)' : '3px solid transparent',
              textAlign: 'left', fontSize: 13,
              color: activeSection === s.id ? 'var(--teal)' : 'var(--text2)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.background = 'var(--surface2)' }}
            onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <button onClick={() => navigate('/erp/website')}
          style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 12, color: 'var(--text3)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
          ← Back to Website
        </button>
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Studio: Models Kanban (L18) ─────────────────────────────── */
export function StudioModelsPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('studio.model', { sortKey: 'name' })
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => { seedStudio().then(reload) }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createRecord('studio.model', {
      name: newName, model: newName.toLowerCase().replace(/\s+/g, '.'),
      icon: '📦', description: '',
    })
    setNewName(''); setShowNew(false); reload()
  }

  return (
    <StudioShell activeSection="models">
      <PageHeader
        title="Models"
        onNew={() => setShowNew(true)}
        newLabel="New Model"
      />

      {/* New model dialog */}
      {showNew && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            autoFocus
            data-erp="field-name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Model name (e.g. Training Session)"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            style={{ flex: 1, padding: '7px 12px', background: 'var(--bg)', border: '1px solid var(--teal)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          />
          <button data-erp="create-button" className="btn btn-primary btn-sm" onClick={handleCreate}>Create</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowNew(false)}>Cancel</button>
        </div>
      )}

      {/* Models kanban grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {records.map(m => (
            <div
              key={m.id}
              data-erp="kanban-card"
              onClick={() => navigate(`/erp/studio/model/${m.id}`)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8, padding: '16px',
                cursor: 'pointer',
                transition: 'all var(--t)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--teal)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon || '📦'}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>{m.model}</div>
              {m.description && (
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>{m.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </StudioShell>
  )
}

/* ── Studio: Views List (L20) ────────────────────────────────── */
export function StudioViewsPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('studio.view', { sortKey: 'name' })

  useEffect(() => { seedStudio().then(reload) }, [])

  const columns = [
    { key: 'name',      label: 'View Name',  style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'model',     label: 'Model',      style: { color: 'var(--text2)', fontFamily: 'monospace', fontSize: 12 } },
    { key: 'view_type', label: 'Type',       render: v => <StatusBadge label={v} color="var(--info,#17a2b8)" /> },
    { key: 'active',    label: 'Active',     render: v => <StatusBadge label={v ? 'Active' : 'Inactive'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <StudioShell activeSection="views">
      <PageHeader title="Views" onNew={() => navigate('/erp/studio/views/new')} />
      <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/studio/views/${r.id}`)} />
    </StudioShell>
  )
}

export function StudioViewForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', model: '', view_type: 'list', arch: '' })

  useEffect(() => {
    if (!isNew) getRecord('studio.view', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('studio.view', vals)
    else       await updateRecord('studio.view', id, vals)
    navigate('/erp/studio/views')
  }

  const fields = [
    { key: 'name',      label: 'View Name',  required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'model',     label: 'Model',      placeholder: 'e.g. sale.order', dataErp: 'field-description' },
    { key: 'view_type', label: 'View Type',  type: 'select', options: ['list','form','kanban','calendar','pivot','graph'], dataErp: 'field-type' },
    { key: 'arch',      label: 'Architecture (XML)', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <StudioShell activeSection="views">
      <GenericForm fields={fields} values={vals} onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))} onSave={handleSave} onDiscard={() => navigate('/erp/studio/views')} />
    </StudioShell>
  )
}

/* ── Studio: Automated Actions (L21) ────────────────────────── */
export function StudioActionsPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('studio.action', { sortKey: 'name' })

  useEffect(() => { seedStudio().then(reload) }, [])

  const columns = [
    { key: 'name',      label: 'Action Name', style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'model_id',  label: 'Model',       style: { color: 'var(--text2)' } },
    { key: 'trigger',   label: 'Trigger',     render: v => <StatusBadge label={v || '—'} color="var(--info,#17a2b8)" /> },
    { key: 'active',    label: 'Active',      render: v => <StatusBadge label={v ? 'Active' : 'Inactive'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <StudioShell activeSection="actions">
      <PageHeader title="Automated Actions" onNew={() => navigate('/erp/studio/actions/new')} />
      <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/studio/actions/${r.id}`)} />
    </StudioShell>
  )
}

export function StudioActionForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', model_id: '', trigger: 'on_create',
    action_server_ids: '', active: true,
  })

  useEffect(() => {
    if (!isNew) getRecord('studio.action', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('studio.action', vals)
    else       await updateRecord('studio.action', id, vals)
    navigate('/erp/studio/actions')
  }

  const fields = [
    { key: 'name',              label: 'Action Name',   required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'model_id',          label: 'Model',         placeholder: 'e.g. sale.order', dataErp: 'field-description' },
    { key: 'trigger',           label: 'When to Run',   type: 'select', dataErp: 'field-type', options: [
        { value: 'on_create',                    label: 'On record creation' },
        { value: 'on_write',                     label: 'On record update' },
        { value: 'on_create_or_write',           label: 'On creation & update' },
        { value: 'on_unlink',                    label: 'On deletion' },
        { value: 'based_on_timed_condition',     label: 'Based on time condition' },
    ]},
    { key: 'action_server_ids',  label: 'Actions to Do', type: 'textarea', dataErp: 'field-description', fullWidth: true, placeholder: 'Describe what this automation should do...' },
    { key: 'active',             label: 'Active',        type: 'toggle', onLabel: 'Active', offLabel: 'Inactive' },
  ]

  return (
    <StudioShell activeSection="actions">
      <GenericForm fields={fields} values={vals} onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))} onSave={handleSave} onDiscard={() => navigate('/erp/studio/actions')} />
    </StudioShell>
  )
}

/* ── Studio: Approval Rules (L23) ───────────────────────────── */
export function StudioRulesPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('studio.approval', { sortKey: 'name' })

  useEffect(() => { seedStudio().then(reload) }, [])

  return (
    <StudioShell activeSection="rules">
      <PageHeader title="Approval Rules" onNew={() => navigate('/erp/studio/rules/new')} />

      {/* Kanban view for approval rules (L23 needs kanban-card) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {records.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 13 }}>
              No approval rules yet. Click New to create one.
            </div>
          )}
          {records.map(r => (
            <div
              key={r.id}
              data-erp="kanban-card"
              onClick={() => navigate(`/erp/studio/rules/${r.id}`)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '14px 16px', cursor: 'pointer',
                transition: 'all var(--t)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.name}</span>
                <StatusBadge label={r.active ? 'Active' : 'Inactive'} color={r.active ? 'var(--success)' : 'var(--text3)'} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{r.model_id}</div>
              {r.group_ids && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>Approvers: {r.group_ids}</div>}
            </div>
          ))}
        </div>
      </div>
    </StudioShell>
  )
}

export function StudioRuleForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', model_id: '', group_ids: '', domain: '', active: true })

  useEffect(() => {
    if (!isNew) getRecord('studio.approval', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('studio.approval', vals)
    else       await updateRecord('studio.approval', id, vals)
    navigate('/erp/studio/rules')
  }

  const fields = [
    { key: 'name',      label: 'Rule Name',    required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'model_id',  label: 'Model',        placeholder: 'e.g. sale.order' },
    { key: 'group_ids', label: 'Approvers',    placeholder: 'e.g. Sales Manager', dataErp: 'field-description' },
    { key: 'domain',    label: 'Conditions',   placeholder: '[("amount_total", ">", 1000)]', dataErp: 'field-description' },
    { key: 'active',    label: 'Active',       type: 'toggle', onLabel: 'Active', offLabel: 'Inactive' },
  ]

  return (
    <StudioShell activeSection="rules">
      <GenericForm fields={fields} values={vals} onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))} onSave={handleSave} onDiscard={() => navigate('/erp/studio/rules')} />
    </StudioShell>
  )
}
