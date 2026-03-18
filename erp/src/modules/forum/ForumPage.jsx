/**
 * ForumPage.jsx — Forum module
 * Lesson 38: Forum
 * Selectors: field-amount, field-name, field-type, new-button, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

async function seedForums() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('forum.forum')
  if (existing.length > 0) return
  const forums = [
    { name: 'Help',          website_published: true,  posts_count: 24, forum_type: 'question', default_order: 'activity' },
    { name: 'General',       website_published: true,  posts_count: 12, forum_type: 'discussion', default_order: 'date' },
    { name: 'Announcements', website_published: false, posts_count: 5,  forum_type: 'discussion', default_order: 'date' },
  ]
  for (const f of forums) await createRecord('forum.forum', f)
}

export function ForumPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('forum.forum', { sortKey: 'name' })

  useEffect(() => { seedForums().then(reload) }, [])

  const columns = [
    { key: 'name',              label: 'Forum Name', style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'forum_type',        label: 'Type',       render: v => <StatusBadge label={v || 'question'} color="var(--info,#17a2b8)" /> },
    { key: 'posts_count',       label: 'Posts',      style: { color: 'var(--text2)' } },
    { key: 'website_published', label: 'Published',  render: v => <StatusBadge label={v ? 'Published' : 'Unpublished'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Forums" onNew={() => navigate('/erp/forum/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/forum/${r.id}`)} />
      </div>
    </WebsiteShell>
  )
}

export function ForumForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', forum_type: 'question', default_order: 'activity',
    description: '', karma_ask: 3, karma_answer: 3,
    karma_edit_own: 1, karma_edit_all: 300,
    website_published: false,
  })

  useEffect(() => {
    if (!isNew) getRecord('forum.forum', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('forum.forum', vals)
    else       await updateRecord('forum.forum', id, vals)
    navigate('/erp/forum')
  }

  const fields = [
    { key: 'name',          label: 'Forum Name',     required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'forum_type',    label: 'Type',           type: 'select', options: ['question','discussion'], dataErp: 'field-type' },
    { key: 'default_order', label: 'Default Order',  type: 'select', options: ['activity','date','vote','answered'], dataErp: 'field-type' },
    { key: 'description',   label: 'Description',    type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  const karmaFields = [
    { key: 'karma_ask',      label: 'Ask Question (karma)',       type: 'number', dataErp: 'field-amount' },
    { key: 'karma_answer',   label: 'Answer Question (karma)',    type: 'number', dataErp: 'field-amount' },
    { key: 'karma_edit_own', label: 'Edit own posts (karma)',     type: 'number', dataErp: 'field-amount' },
    { key: 'karma_edit_all', label: 'Edit all posts (karma)',     type: 'number', dataErp: 'field-amount' },
  ]

  const [tab, setTab] = useState('Forum')

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          fields={tab === 'Forum' ? fields : karmaFields}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/forum')}
          tabs={['Forum', 'Karma']}
          activeTab={tab}
          onTabChange={setTab}
        />
      </div>
    </WebsiteShell>
  )
}
