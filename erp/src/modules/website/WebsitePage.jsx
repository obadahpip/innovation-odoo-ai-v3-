/**
 * WebsitePage.jsx — Website Builder module
 * Lesson 34: Website Builder
 * Selectors needed: create-button, field-name, new-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from './WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge, PublishToggle } from './websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

/* ── Seed website pages if none exist ─────────────────────────── */
async function seedWebsitePages() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('website.page')
  if (existing.length > 0) return
  const pages = [
    { name: 'Homepage',       url: '/',            is_published: true,  website_id: 1 },
    { name: 'About Us',       url: '/about',       is_published: true,  website_id: 1 },
    { name: 'Contact',        url: '/contact',     is_published: true,  website_id: 1 },
    { name: 'Privacy Policy', url: '/privacy',     is_published: false, website_id: 1 },
    { name: 'Shop',           url: '/shop',        is_published: true,  website_id: 1 },
    { name: 'Blog',           url: '/blog',        is_published: true,  website_id: 1 },
  ]
  for (const p of pages) await createRecord('website.page', p)
}

/* ── Website Pages List ───────────────────────────────────────── */
export function WebsitePage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('website.page', { sortKey: 'name' })

  useEffect(() => { seedWebsitePages().then(reload) }, [])

  const columns = [
    { key: 'name',         label: 'Page Name', style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'url',          label: 'URL',       style: { color: 'var(--text2)', fontFamily: 'monospace' } },
    { key: 'is_published', label: 'Status',    render: v => <StatusBadge label={v ? 'Published' : 'Unpublished'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Website Pages"
          onNew={() => navigate('/erp/website/new')}
        />
        <GenericList
          columns={columns}
          rows={records}
          onRowClick={row => navigate(`/erp/website/${row.id}`)}
        />
      </div>
    </WebsiteShell>
  )
}

/* ── Website Page Form ────────────────────────────────────────── */
export function WebsiteForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', url: '', is_published: false,
    website_meta_title: '', website_meta_description: '',
  })
  const [published, setPublished] = useState(false)
  const [tab, setTab] = useState('Content')

  useEffect(() => {
    if (!isNew) {
      getRecord('website.page', id).then(r => {
        if (r) { setVals(r); setPublished(r.is_published) }
      })
    }
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, is_published: published }
    if (isNew) await createRecord('website.page', data)
    else       await updateRecord('website.page', id, data)
    navigate('/erp/website')
  }

  const fields = [
    { key: 'name',                     label: 'Page Name',        required: true, dataErp: 'field-name' },
    { key: 'url',                       label: 'URL',              placeholder: '/my-page' },
    { key: 'website_meta_title',        label: 'SEO Title',        fullWidth: false },
    { key: 'website_meta_description',  label: 'SEO Description',  type: 'textarea', dataErp: 'field-description' },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          title={isNew ? 'New Page' : vals.name}
          fields={tab === 'Content' ? fields : []}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/website')}
          tabs={['Content', 'SEO', 'Properties']}
          activeTab={tab}
          onTabChange={setTab}
          extra={
            <PublishToggle
              published={published}
              onToggle={() => setPublished(p => !p)}
            />
          }
        />
      </div>
    </WebsiteShell>
  )
}
