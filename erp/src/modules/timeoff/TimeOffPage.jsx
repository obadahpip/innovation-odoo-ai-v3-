/**
 * TimeOffPage.jsx — Time Off module (full)
 * Lesson 50: Time Off
 * Selectors: app-leaves, field-name, field-type, list-row, new-button, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HRShell, PageHeader, GenericList, GenericForm, StatusBadge, StatusBarField, ConfirmButton, RefuseButton } from '../expenses/hrHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'MY TIME OFF', items: [
    { label: 'My Time Off',          path: '/erp/time-off',                icon: '🏖' },
    { label: 'My Allocation Requests', path: '/erp/time-off/allocations',  icon: '📋' },
  ]},
  { label: 'MANAGERS', items: [
    { label: 'All Time Off',         path: '/erp/time-off/all',            icon: '📊' },
    { label: 'All Allocations',      path: '/erp/time-off/all-allocations',icon: '📁' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'By Employee',          path: '/erp/time-off/reporting',      icon: '📈' },
    { label: 'Analysis',             path: '/erp/time-off/analysis',       icon: '📉' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Leave Types',          path: '/erp/time-off/types',          icon: '⚙' },
    { label: 'Settings',             path: '/erp/time-off/config',         icon: '⚙' },
  ]},
]

async function seedTimeOff() {
  const { listRecords } = await import('@data/db.js')
  const [leaves, types] = await Promise.all([
    listRecords('hr.leave'),
    listRecords('hr.leave.type'),
  ])
  if (types.length === 0) {
    for (const t of [
      { name: 'Annual Leave',      leave_validation_type: 'manager', allocation_type: 'fixed', max_leaves: 20 },
      { name: 'Sick Leave',        leave_validation_type: 'no_validation', allocation_type: 'fixed', max_leaves: 10 },
      { name: 'Unpaid Leave',      leave_validation_type: 'hr', allocation_type: 'no', max_leaves: 0 },
      { name: 'Compensatory Off',  leave_validation_type: 'manager', allocation_type: 'fixed', max_leaves: 5 },
    ]) await createRecord('hr.leave.type', t)
  }
  if (leaves.length === 0) {
    for (const l of [
      { name: 'Annual Leave',      employee_id: 'Mitchell Admin',  date_from: '2025-03-10', date_to: '2025-03-14', state: 'validate', number_of_days: 5 },
      { name: 'Sick Leave',        employee_id: 'Marc Demo',       date_from: '2025-03-03', date_to: '2025-03-04', state: 'validate', number_of_days: 2 },
      { name: 'Annual Leave',      employee_id: 'Brandon Freeman', date_from: '2025-04-01', date_to: '2025-04-05', state: 'confirm',  number_of_days: 5 },
      { name: 'Compensatory Off',  employee_id: 'Abigail Peterson',date_from: '2025-03-21', date_to: '2025-03-21', state: 'draft',    number_of_days: 1 },
    ]) await createRecord('hr.leave', l)
  }
}

/* ── Time Off List ──────────────────────────────────────────────── */
export function TimeOffPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('hr.leave', { sortKey: 'date_from' })
  useEffect(() => { seedTimeOff().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', confirm: 'var(--warning)', validate: 'var(--success)', refuse: 'var(--danger)' }
  const STATE_LABEL = { draft: 'To Submit', confirm: 'To Approve', validate: 'Approved', refuse: 'Refused' }

  const columns = [
    { key: 'name',           label: 'Leave Type',  style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'employee_id',    label: 'Employee',    style: { color: 'var(--text2)' } },
    { key: 'date_from',      label: 'From',        style: { color: 'var(--text2)' } },
    { key: 'date_to',        label: 'To',          style: { color: 'var(--text2)' } },
    { key: 'number_of_days', label: 'Days',        style: { color: 'var(--text2)' } },
    { key: 'state',          label: 'Status',      render: v => <StatusBadge label={STATE_LABEL[v] || v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Time Off"
          onNew={() => navigate('/erp/time-off/new')}
          extra={
            <button data-erp="app-leaves"
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🏖 Overview
            </button>
          }
        />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/time-off/${r.id}`)} />
      </div>
    </HRShell>
  )
}

/* ── Time Off Form ──────────────────────────────────────────────── */
export function TimeOffForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: 'Annual Leave', employee_id: 'Mitchell Admin', date_from: '', date_to: '', description: '' })
  const [status, setStatus] = useState('To Submit')
  const [types, setTypes]   = useState([])

  useEffect(() => {
    import('@data/db.js').then(db => db.listRecords('hr.leave.type').then(setTypes))
    if (!isNew) getRecord('hr.leave', id).then(r => {
      if (r) {
        setVals(r)
        const map = { draft: 'To Submit', confirm: 'To Approve', validate: 'Approved', refuse: 'Refused' }
        setStatus(map[r.state] || 'To Submit')
      }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'To Submit': 'draft', 'To Approve': 'confirm', 'Approved': 'validate', 'Refused': 'refuse' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('hr.leave', data)
    else       await updateRecord('hr.leave', id, data)
    navigate('/erp/time-off')
  }

  const handleApprove = async () => { setStatus('Approved'); await handleSave() }
  const handleRefuse  = async () => { setStatus('Refused');  await handleSave() }

  const fields = [
    { key: 'name',        label: 'Leave Type',    type: 'select', dataErp: 'field-type',
      options: types.map(t => t.name) },
    { key: 'employee_id', label: 'Employee',      dataErp: 'field-name' },
    { key: 'date_from',   label: 'From',          type: 'date', dataErp: 'field-date' },
    { key: 'date_to',     label: 'To',            type: 'date', dataErp: 'field-date' },
    { key: 'description', label: 'Reason',        type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <StatusBarField stages={['To Submit', 'To Approve', 'Approved']} current={status} onChange={setStatus} />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/time-off')}
        extra={
          <div style={{ display: 'flex', gap: 6 }}>
            {status === 'To Submit' && <ConfirmButton label="Confirm" onClick={() => setStatus('To Approve')} />}
            {status === 'To Approve' && <ConfirmButton label="Approve" onClick={handleApprove} />}
            {status === 'To Approve' && <RefuseButton label="Refuse" onClick={handleRefuse} />}
          </div>
        }
      />
    </HRShell>
  )
}
