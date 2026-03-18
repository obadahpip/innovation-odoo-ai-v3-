/**
 * BlogPage.jsx — Blog module
 * Lesson 39: Blog
 * Selectors: app-website, create-button, field-description, field-name, new-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge, PublishToggle } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

async function seedBlogs() {
  const { listRecords } = await import('@data/db.js')
  const [blogs, posts] = await Promise.all([
    listRecords('blog.blog'),
    listRecords('blog.post'),
  ])
  if (blogs.length === 0) {
    const b = [
      { name: 'Company News',  subtitle: 'Latest updates from our team' },
      { name: 'Tech & Tips',   subtitle: 'Technical guides and how-tos' },
    ]
    for (const item of b) await createRecord('blog.blog', item)
  }
  if (posts.length === 0) {
    const p = [
      { name: 'Welcome to our blog!',       website_published: true,  visits: 143, blog_name: 'Company News' },
      { name: 'How to use Odoo inventory',  website_published: true,  visits: 87,  blog_name: 'Tech & Tips' },
      { name: 'Q1 2025 Updates',            website_published: false, visits: 0,   blog_name: 'Company News' },
    ]
    for (const item of p) await createRecord('blog.post', item)
  }
}

export function BlogPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('posts')
  const { records: posts,  reload: reloadPosts }  = useRecordList('blog.post',  { sortKey: 'name' })
  const { records: blogs,  reload: reloadBlogs }  = useRecordList('blog.blog',  { sortKey: 'name' })

  useEffect(() => { seedBlogs().then(() => { reloadPosts(); reloadBlogs() }) }, [])

  const postCols = [
    { key: 'name',              label: 'Title',      style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'blog_name',         label: 'Blog',       style: { color: 'var(--text2)' } },
    { key: 'visits',            label: 'Visits',     style: { color: 'var(--text2)' } },
    { key: 'website_published', label: 'Published',  render: v => <StatusBadge label={v ? 'Published' : 'Unpublished'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]
  const blogCols = [
    { key: 'name',     label: 'Blog Name', style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'subtitle', label: 'Subtitle',  style: { color: 'var(--text2)' } },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Blog"
          onNew={() => navigate(activeTab === 'blogs' ? '/erp/blog/blog/new' : '/erp/blog/new')}
          extra={
            <button
              data-erp="app-website"
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => navigate('/erp/website')}
            >🌐 Go to Website</button>
          }
        />

        {/* Sub-tabs: Posts / Blogs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px', flexShrink: 0 }}>
          {['posts', 'blogs'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '8px 16px', background: 'transparent', border: 'none',
              borderBottom: activeTab === t ? '2px solid var(--teal)' : '2px solid transparent',
              color: activeTab === t ? 'var(--teal)' : 'var(--text2)',
              fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <GenericList columns={postCols} rows={posts} onRowClick={r => navigate(`/erp/blog/${r.id}`)} />
        )}
        {activeTab === 'blogs' && (
          <GenericList columns={blogCols} rows={blogs} onRowClick={r => navigate(`/erp/blog/blog/${r.id}`)} />
        )}
      </div>
    </WebsiteShell>
  )
}

export function BlogForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', blog_name: '', content: '', website_published: false,
    website_meta_title: '', website_meta_description: '',
  })
  const [published, setPublished] = useState(false)

  useEffect(() => {
    if (!isNew) getRecord('blog.post', id).then(r => {
      if (r) { setVals(r); setPublished(r.website_published) }
    })
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, website_published: published }
    if (isNew) await createRecord('blog.post', data)
    else       await updateRecord('blog.post', id, data)
    navigate('/erp/blog')
  }

  const fields = [
    { key: 'name',                    label: 'Post Title',    required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'blog_name',               label: 'Blog',          placeholder: 'e.g. Company News' },
    { key: 'website_meta_title',      label: 'SEO Title' },
    { key: 'content',                 label: 'Content',       type: 'textarea', dataErp: 'field-description', fullWidth: true },
    { key: 'website_meta_description',label: 'SEO Description', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          fields={fields}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/blog')}
          extra={<PublishToggle published={published} onToggle={() => setPublished(p => !p)} />}
        />
      </div>
    </WebsiteShell>
  )
}
