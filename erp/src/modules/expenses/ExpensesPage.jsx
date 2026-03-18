/**
 * ExpensesPage.jsx — Expenses module
 * Lesson 25: Expenses
 * Selectors: create-button, field-amount, field-date, field-name,
 *            field-type, save-button, status-bar, submit-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HRShell, PageHeader, GenericList, GenericForm, StatusBadge, StatusBarField, SubmitButton } from './hrHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'MY EXPENSES', items: [
    { label: 'My Expenses',         path: '/erp/expenses',          icon: '🧾' },
    { label: 'My Expense Reports',  path: '/erp/expenses/reports',  icon: '📋' },
  ]},
  { label: 'MANAGERS', items: [
    { label: 'All Expenses',        path: '/erp/expenses/all',      icon: '📊' },
    { label: 'Expense Reports',     path: '/erp/expenses/all-reports', icon: '📁' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Analysis',            path: '/erp/expenses/analysis', icon: '📈' },
  ]},
]

async function seedExpenses() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('hr.expense')
  if (existing.length > 0) return
  for (const e of [
    { name: 'Hotel — Paris Conference',   expense_type: 'accommodation', total_amount: 320.00, date: '2025-02-20', state: 'draft',    employee_id: 'Mitchell Admin' },
    { name: 'Flight to London',           expense_type: 'travel',        total_amount: 215.00, date: '2025-02-18', state: 'reported', employee_id: 'Mitchell Admin' },
    { name: 'Team Lunch',                 expense_type: 'meals',         total_amount: 87.50,  date: '2025-03-01', state: 'approved', employee_id: 'Marc Demo' },
    { name: 'Office Supplies',            expense_type: 'supplies',      total_amount: 45.00,  date: '2025-03-05', state: 'draft',    employee_id: 'Mitchell Admin' },
    { name: 'Client Entertainment',       expense_type: 'entertainment', total_amount: 190.00, date: '2025-03-08', state: 'done',     employee_id: 'Marc Demo' },
  ]) await createRecord('hr.expense', e)
}

/* ── Expenses List ──────────────────────────────────────────────── */
export function ExpensesPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('hr.expense', { sortKey: 'date' })
  useEffect(() => { seedExpenses().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', reported: 'var(--warning)', approved: 'var(--teal)', done: 'var(--success)', refused: 'var(--danger)' }

  const columns = [
    { key: 'name',         label: 'Expense',      style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'expense_type', label: 'Category',     render: v => <StatusBadge label={v || '—'} color="#17a2b8" /> },
    { key: 'date',         label: 'Date',         style: { color: 'var(--text2)' } },
    { key: 'employee_id',  label: 'Employee',     style: { color: 'var(--text2)' } },
    { key: 'total_amount', label: 'Total',        render: v => v ? `$${Number(v).toFixed(2)}` : '—' },
    { key: 'state',        label: 'Status',       render: v => <StatusBadge label={v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="My Expenses" onNew={() => navigate('/erp/expenses/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/expenses/${r.id}`)} />
      </div>
    </HRShell>
  )
}

/* ── Expense Form ───────────────────────────────────────────────── */
export function ExpensesForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', expense_type: '', total_amount: '', date: new Date().toISOString().split('T')[0], employee_id: 'Mitchell Admin', description: '' })
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('hr.expense', id).then(r => {
      if (r) {
        setVals(r)
        const map = { draft: 'Draft', reported: 'Submitted', approved: 'Approved', done: 'Posted', refused: 'Refused' }
        setStatus(map[r.state] || 'Draft')
      }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'Submitted': 'reported', 'Approved': 'approved', 'Posted': 'done', 'Refused': 'refused' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('hr.expense', data)
    else       await updateRecord('hr.expense', id, data)
    navigate('/erp/expenses')
  }

  const handleSubmit = async () => { setStatus('Submitted'); await handleSave() }

  const fields = [
    { key: 'name',         label: 'Expense Name',  required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'expense_type', label: 'Category',      type: 'select', dataErp: 'field-type',
      options: ['travel','accommodation','meals','entertainment','supplies','communication','other'] },
    { key: 'total_amount', label: 'Total Amount',  type: 'number', dataErp: 'field-amount' },
    { key: 'date',         label: 'Expense Date',  type: 'date',   dataErp: 'field-date' },
    { key: 'employee_id',  label: 'Employee',      placeholder: 'Employee name' },
    { key: 'description',  label: 'Notes',         type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <StatusBarField stages={['Draft', 'Submitted', 'Approved', 'Posted']} current={status} onChange={setStatus} />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/expenses')}
        extra={status === 'Draft' && <SubmitButton label="Submit to Manager" onClick={handleSubmit} />}
      />
    </HRShell>
  )
}
