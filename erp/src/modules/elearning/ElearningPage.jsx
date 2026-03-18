/**
 * ElearningPage.jsx — eLearning module
 * Lesson 37: eLearning
 * Selectors: create-button, field-description, field-name, list-row, new-button, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge, PublishToggle } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

async function seedCourses() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('slide.channel')
  if (existing.length > 0) return
  const courses = [
    { name: 'Odoo 19 Basics',          website_published: true,  members_count: 12, slides_count: 8,  enroll: 'public',     description: 'Introduction to Odoo for new users.' },
    { name: 'Advanced Accounting',     website_published: true,  members_count: 5,  slides_count: 14, enroll: 'payment',    description: 'Deep dive into Odoo Accounting module.' },
    { name: 'Website & eCommerce',     website_published: false, members_count: 0,  slides_count: 6,  enroll: 'public',     description: 'Build and manage your online store.' },
    { name: 'HR Management',           website_published: true,  members_count: 8,  slides_count: 10, enroll: 'invite',     description: 'Manage employees, leaves and payroll.' },
  ]
  for (const c of courses) await createRecord('slide.channel', c)
}

export function ElearningPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('slide.channel', { sortKey: 'name' })

  useEffect(() => { seedCourses().then(reload) }, [])

  const columns = [
    { key: 'name',              label: 'Course',     style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'slides_count',      label: 'Contents',   style: { color: 'var(--text2)' } },
    { key: 'members_count',     label: 'Attendees',  style: { color: 'var(--text2)' } },
    { key: 'enroll',            label: 'Enroll',     render: v => <StatusBadge label={v || 'public'} color="var(--info,#17a2b8)" /> },
    { key: 'website_published', label: 'Published',  render: v => <StatusBadge label={v ? 'Published' : 'Unpublished'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Courses" onNew={() => navigate('/erp/elearning/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/elearning/${r.id}`)} />
      </div>
    </WebsiteShell>
  )
}

export function ElearningForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', description: '', enroll: 'public',
    website_published: false, tag_ids: '',
  })
  const [published, setPublished] = useState(false)
  const [tab, setTab] = useState('Course')

  useEffect(() => {
    if (!isNew) getRecord('slide.channel', id).then(r => {
      if (r) { setVals(r); setPublished(r.website_published) }
    })
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, website_published: published }
    if (isNew) await createRecord('slide.channel', data)
    else       await updateRecord('slide.channel', id, data)
    navigate('/erp/elearning')
  }

  const courseFields = [
    { key: 'name',        label: 'Course Title',   required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'tag_ids',     label: 'Tags',           placeholder: 'e.g. Beginner, Finance', dataErp: 'field-description' },
    { key: 'enroll',      label: 'Enroll Policy',  type: 'select', options: ['public','invite','payment'], dataErp: 'field-type' },
    { key: 'description', label: 'Description',    type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]
  const optionsFields = [
    { key: 'website_published', label: 'Show course to', type: 'toggle', onLabel: 'All users', offLabel: 'Enrolled users', dataErp: 'field-type' },
  ]

  /* Fake "Add Section" button for task engine */
  const AddSectionBtn = () => (
    <button
      data-erp="create-button"
      style={{
        margin: '12px 24px',
        padding: '8px 16px',
        background: 'transparent',
        border: `1px dashed var(--border2)`,
        borderRadius: 5,
        color: 'var(--text2)',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
      onClick={() => {}}
    >
      + Add Section
    </button>
  )

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          fields={tab === 'Course' ? courseFields : tab === 'Options' ? optionsFields : []}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/elearning')}
          tabs={['Course', 'Content', 'Options']}
          activeTab={tab}
          onTabChange={setTab}
          extra={<PublishToggle published={published} onToggle={() => setPublished(p => !p)} />}
        />
        {tab === 'Content' && <AddSectionBtn />}
      </div>
    </WebsiteShell>
  )
}
