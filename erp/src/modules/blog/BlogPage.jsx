/**
 * BlogPage.jsx — Blog Posts
 * Odoo 19.0 model: blog.post
 * Route base: /erp/blog
 * Sub-nav: ['Blog Posts', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'published':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'unpublished':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'name',label:'Title',width:'30%'},
  {key:'blog_id',label:'Blog',width:'15%'},
  {key:'website_published',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
  {key:'post_date',label:'Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
]

const STAGES = null

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function BlogPage() {
  return (
    <GenericList
      model="blog.post"
      title="Blog Posts"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/blog/new"
      formPath="/erp/blog/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📝"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function BlogForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="blog.post" id={id}
      defaults={DEFAULTS}
      title="Blog Post"
      backPath="/erp/blog" backLabel="Blog Posts"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Post Title'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Subtitle'><input className='o-input' value={record?.subtitle||''} onChange={e=>setField('subtitle',e.target.value)}/></FieldRow>
          <FieldRow label='Tags'><input className='o-input' value={record?.tag_ids||''} onChange={e=>setField('tag_ids',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default BlogPage
