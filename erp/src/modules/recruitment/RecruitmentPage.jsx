/**
 * RecruitmentPage.jsx — Recruitment module (full)
 * Lesson 51: Recruitment
 * Selectors: create-button, field-name, kanban-card
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HRShell, PageHeader, GenericList, GenericForm, StatusBadge } from '../expenses/hrHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'RECRUITMENT', items: [
    { label: 'All Applications',  path: '/erp/recruitment',           icon: '👔' },
    { label: 'New Applications',  path: '/erp/recruitment/new-apps',  icon: '✨' },
  ]},
  { label: 'JOB POSITIONS', items: [
    { label: 'Job Positions',     path: '/erp/recruitment/positions', icon: '📋' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Recruitment Analysis', path: '/erp/recruitment/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Settings',          path: '/erp/recruitment/config',    icon: '⚙' },
    { label: 'Stages',            path: '/erp/recruitment/stages',    icon: '📌' },
  ]},
]

async function seedRecruitment() {
  const { listRecords } = await import('@data/db.js')
  const [apps, stages, positions] = await Promise.all([
    listRecords('hr.applicant'),
    listRecords('hr.recruitment.stage'),
    listRecords('hr.job'),
  ])
  if (stages.length === 0) {
    for (const s of [
      { name: 'New',          sequence: 1 },
      { name: 'Initial Qualification', sequence: 2 },
      { name: 'First Interview', sequence: 3 },
      { name: 'Second Interview', sequence: 4 },
      { name: 'Contract Proposed', sequence: 5 },
    ]) await createRecord('hr.recruitment.stage', s)
  }
  if (positions.length === 0) {
    for (const j of [
      { name: 'Software Engineer',    no_of_recruitment: 2, department_id: 'IT', state: 'recruit' },
      { name: 'Sales Representative', no_of_recruitment: 3, department_id: 'Sales', state: 'recruit' },
      { name: 'HR Manager',           no_of_recruitment: 1, department_id: 'HR', state: 'open' },
      { name: 'UX Designer',          no_of_recruitment: 1, department_id: 'IT', state: 'recruit' },
    ]) await createRecord('hr.job', j)
  }
  if (apps.length === 0) {
    const stageNames = ['New', 'Initial Qualification', 'First Interview', 'Contract Proposed']
    const jobs = ['Software Engineer', 'Sales Representative', 'UX Designer']
    const names = ['Emma Wilson', 'James Carter', 'Sophia Lee', 'Oliver Brown', 'Mia Davis', 'Liam Johnson']
    for (let i = 0; i < names.length; i++) {
      await createRecord('hr.applicant', {
        partner_name:  names[i],
        job_id:        jobs[i % jobs.length],
        stage_id:      stageNames[i % stageNames.length],
        priority:      String(Math.floor(Math.random() * 3)),
        email_from:    names[i].toLowerCase().replace(' ', '.') + '@example.com',
      })
    }
  }
}

/* ── Applications Kanban (main view) ────────────────────────────── */
export function RecruitmentPage() {
  const navigate = useNavigate()
  const { records: apps,    reload: reloadApps }    = useRecordList('hr.applicant', { sortKey: 'partner_name' })
  const { records: stages,  reload: reloadStages }  = useRecordList('hr.recruitment.stage', { sortKey: 'sequence' })
  const [newName, setNewName] = useState('')
  const [addingStage, setAddingStage] = useState(null)

  useEffect(() => { seedRecruitment().then(() => { reloadApps(); reloadStages() }) }, [])

  const handleQuickAdd = async (stageId) => {
    if (!newName.trim()) return
    await createRecord('hr.applicant', { partner_name: newName, stage_id: stageId, job_id: 'Open Position' })
    setNewName('')
    setAddingStage(null)
    reloadApps()
  }

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Applications" onNew={() => navigate('/erp/recruitment/new')} />

        {/* Kanban columns */}
        <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
          {stages.map(stage => {
            const stageApps = apps.filter(a => a.stage_id === stage.name)
            return (
              <div key={stage.id} style={{
                width: 260, flexShrink: 0,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, overflow: 'hidden',
              }}>
                {/* Column header */}
                <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stage.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text2)' }}>{stageApps.length}</span>
                    <button
                      data-erp="create-button"
                      onClick={() => setAddingStage(stage.name)}
                      style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                    >+</button>
                  </div>
                </div>

                {/* Quick add */}
                {addingStage === stage.name && (
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
                    <input
                      autoFocus
                      data-erp="field-name"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(stage.name); if (e.key === 'Escape') setAddingStage(null) }}
                      placeholder="Applicant name..."
                      style={{ width: '100%', padding: '6px 8px', background: 'var(--bg)', border: '1px solid var(--teal)', borderRadius: 4, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleQuickAdd(stage.name)}>Add</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setAddingStage(null)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Cards */}
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  {stageApps.map(app => (
                    <div key={app.id}
                      data-erp="kanban-card"
                      onClick={() => navigate(`/erp/recruitment/${app.id}`)}
                      style={{
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        borderRadius: 6, padding: '10px 12px', cursor: 'pointer',
                        transition: 'all var(--t)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{app.partner_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{app.job_id || 'Open Position'}</div>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[0,1,2].map(s => (
                          <span key={s} style={{ fontSize: 12, color: s < Number(app.priority || 0) ? '#f0ad4e' : 'var(--border2)' }}>
                            {s < Number(app.priority || 0) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </HRShell>
  )
}

/* ── Applicant Form ─────────────────────────────────────────────── */
export function RecruitmentForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ partner_name: '', job_id: '', email_from: '', partner_phone: '', stage_id: 'New', priority: '0', description: '' })
  const [stages, setStages] = useState([])

  useEffect(() => {
    import('@data/db.js').then(db => db.listRecords('hr.recruitment.stage').then(setStages))
    if (!isNew) getRecord('hr.applicant', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('hr.applicant', vals)
    else       await updateRecord('hr.applicant', id, vals)
    navigate('/erp/recruitment')
  }

  const fields = [
    { key: 'partner_name',  label: 'Applicant Name', required: true, dataErp: 'field-name', fullWidth: false },
    { key: 'job_id',        label: 'Applied Job',    dataErp: 'field-name' },
    { key: 'email_from',    label: 'Email',          placeholder: 'applicant@example.com' },
    { key: 'partner_phone', label: 'Phone' },
    { key: 'stage_id',      label: 'Stage',          type: 'select', dataErp: 'field-type',
      options: stages.map(s => s.name) },
    { key: 'priority',      label: 'Appreciation',   type: 'select', dataErp: 'field-type',
      options: ['0','1','2','3'].map(v => ({ value: v, label: '★'.repeat(Number(v)) || 'Normal' })) },
    { key: 'description',   label: 'Notes',          type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/recruitment')}
      />
    </HRShell>
  )
}

/* ── Job Positions List ─────────────────────────────────────────── */
export function JobPositionsList() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('hr.job', { sortKey: 'name' })
  useEffect(() => { seedRecruitment().then(reload) }, [])

  const columns = [
    { key: 'name',                label: 'Job Position',   style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'department_id',       label: 'Department',     style: { color: 'var(--text2)' } },
    { key: 'no_of_recruitment',   label: 'Expected',       style: { color: 'var(--text2)' } },
    { key: 'state',               label: 'Status',         render: v => <StatusBadge label={v === 'recruit' ? 'Recruiting' : 'Open'} color={v === 'recruit' ? 'var(--teal)' : 'var(--text3)'} /> },
  ]

  return (
    <HRShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Job Positions" onNew={() => navigate('/erp/recruitment/positions/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/recruitment/positions/${r.id}`)} />
      </div>
    </HRShell>
  )
}
