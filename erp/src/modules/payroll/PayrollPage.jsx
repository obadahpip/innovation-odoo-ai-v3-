/**
 * PayrollPage.jsx — Payroll module (full)
 * Lesson 49: Payroll
 * Selectors: confirm-button, create-button, field-type, kanban-card, list-row, status-bar
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HRShell, PageHeader, GenericList, GenericForm, StatusBadge, StatusBarField, ConfirmButton } from '../expenses/hrHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'EMPLOYEES', items: [
    { label: 'Payslips',         path: '/erp/payroll',           icon: '💸' },
    { label: 'All Payslips',     path: '/erp/payroll/all',       icon: '📋' },
    { label: 'Payslip Batches',  path: '/erp/payroll/batches',   icon: '📦' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Payroll Analysis', path: '/erp/payroll/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Salary Structures', path: '/erp/payroll/structures', icon: '⚙' },
    { label: 'Rules',             path: '/erp/payroll/rules',      icon: '📝' },
  ]},
]

async function seedPayroll() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('hr.payslip')
  if (existing.length > 0) return
  const employees = ['Mitchell Admin', 'Marc Demo', 'Abigail Peterson', 'Brandon Freeman', 'Laura Wright']
  const month = '03/2025'
  for (const emp of employees) {
    await createRecord('hr.payslip', {
      name:        `Salary Slip of ${emp} for ${month}`,
      employee_id: emp,
      date_from:   '2025-03-01',
      date_to:     '2025-03-31',
      state:       Math.random() > 0.5 ? 'draft' : 'done',
      contract_id: 'Employee Contract',
      wage:        Math.floor(2000 + Math.random() * 3000),
      net_wage:    0,
      struct_id:   'Employee Monthly Pay',
    })
  }
}

/* ── Payslips List ──────────────────────────────────────────────── */
export function PayrollPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('hr.payslip', { sortKey: 'employee_id' })
  useEffect(() => { seedPayroll().then(reload) }, [])

  const columns = [
    { key: 'employee_id', label: 'Employee',    style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'name',        label: 'Description', style: { color: 'var(--text2)', fontSize: 12 } },
    { key: 'date_from',   label: 'Period',      style: { color: 'var(--text2)' } },
    { key: 'struct_id',   label: 'Structure',   style: { color: 'var(--text2)' } },
    { key: 'wage',        label: 'Gross',       render: v => v ? `$${Number(v).toLocaleString()}` : '—' },
    { key: 'state',       label: 'Status',      render: v => <StatusBadge label={v === 'done' ? 'Done' : 'Draft'} color={v === 'done' ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Employee Payslips"
          onNew={() => navigate('/erp/payroll/new')}
          extra={
            <button data-erp="create-button" className="btn btn-secondary btn-sm"
              onClick={() => navigate('/erp/payroll/batches')}>
              Create Batch
            </button>
          }
        />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/payroll/${r.id}`)} />
      </div>
    </HRShell>
  )
}

/* ── Payslip Kanban view ────────────────────────────────────────── */
export function PayrollKanban() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('hr.payslip', { sortKey: 'employee_id' })
  useEffect(() => { seedPayroll().then(reload) }, [])

  const groups = {
    Draft:  records.filter(r => r.state === 'draft'),
    Done:   records.filter(r => r.state === 'done'),
  }

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Payslips" onNew={() => navigate('/erp/payroll/new')} />
        <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
          {Object.entries(groups).map(([stage, slips]) => (
            <div key={stage} style={{ width: 280, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>{slips.length}</span>
              </div>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {slips.map(slip => (
                  <div key={slip.id}
                    data-erp="kanban-card"
                    onClick={() => navigate(`/erp/payroll/${slip.id}`)}
                    style={{
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '10px 12px', cursor: 'pointer',
                      transition: 'all var(--t)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{slip.employee_id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{slip.date_from} → {slip.date_to}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{slip.struct_id}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)' }}>${Number(slip.wage || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRShell>
  )
}

/* ── Payslip Form ───────────────────────────────────────────────── */
export function PayrollForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', employee_id: '', date_from: '2025-03-01', date_to: '2025-03-31', struct_id: 'Employee Monthly Pay', contract_id: '', wage: '' })
  const [status, setStatus] = useState('Draft')
  const [tab, setTab] = useState('Worked Days')

  /* Fake salary lines for display */
  const salaryLines = [
    { code: 'BASIC',    name: 'Basic Salary',       amount: Number(vals.wage) || 0 },
    { code: 'GROSS',    name: 'Gross',               amount: Number(vals.wage) || 0 },
    { code: 'COMP_DEDUC', name: 'Taxable Income',   amount: Math.round((Number(vals.wage) || 0) * 0.85) },
    { code: 'NET',      name: 'Net Salary',          amount: Math.round((Number(vals.wage) || 0) * 0.78) },
  ]

  useEffect(() => {
    if (!isNew) getRecord('hr.payslip', id).then(r => {
      if (r) { setVals(r); setStatus(r.state === 'done' ? 'Done' : 'Draft') }
    })
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, state: status === 'Done' ? 'done' : 'draft' }
    if (isNew) await createRecord('hr.payslip', data)
    else       await updateRecord('hr.payslip', id, data)
    navigate('/erp/payroll')
  }

  const handleCompute = () => alert('Salary computed! Net: $' + Math.round((Number(vals.wage) || 0) * 0.78).toLocaleString())
  const handleConfirm = async () => { setStatus('Done'); await handleSave() }

  const fields = [
    { key: 'employee_id', label: 'Employee',        required: true, dataErp: 'field-name' },
    { key: 'struct_id',   label: 'Salary Structure', type: 'select', dataErp: 'field-type',
      options: ['Employee Monthly Pay', 'Employee Weekly Pay', 'Hourly Employee'] },
    { key: 'contract_id', label: 'Contract',         placeholder: 'Employee Contract' },
    { key: 'date_from',   label: 'From',             type: 'date', dataErp: 'field-date' },
    { key: 'date_to',     label: 'To',               type: 'date', dataErp: 'field-date' },
    { key: 'wage',        label: 'Gross Wage',       type: 'number', dataErp: 'field-amount' },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <StatusBarField stages={['Draft', 'Done']} current={status} onChange={setStatus} />
      <GenericForm
        fields={tab === 'Settings' ? fields : []}
        values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/payroll')}
        tabs={['Worked Days', 'Salary Computation', 'Settings']}
        activeTab={tab}
        onTabChange={setTab}
        extra={
          <div style={{ display: 'flex', gap: 6 }}>
            <button data-erp="create-button" className="btn btn-secondary btn-sm" onClick={handleCompute}>
              Compute Sheet
            </button>
            {status === 'Draft' && <ConfirmButton label="Confirm" onClick={handleConfirm} />}
          </div>
        }
      >
        {tab === 'Salary Computation' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Code', 'Name', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaryLines.map((line, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--text2)', fontSize: 12 }}>{line.code}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text)' }}>{line.name}</td>
                  <td style={{ padding: '8px 12px', color: line.code === 'NET' ? 'var(--teal)' : 'var(--text)', fontWeight: line.code === 'NET' ? 600 : 400 }}>
                    ${line.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'Worked Days' && (
          <div style={{ color: 'var(--text2)', fontSize: 13, padding: '12px 0' }}>
            Standard work schedule: 22 working days this period.
          </div>
        )}
      </GenericForm>
    </HRShell>
  )
}
