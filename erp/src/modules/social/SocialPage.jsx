/**
 * SocialPage.jsx — Social Posts
 * Odoo 19.0 model: social.post
 * Route base: /erp/social
 * Sub-nav: ['Feed', 'Posts', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'scheduled':{label:'Scheduled',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'posting':{label:'Posting',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'posted':{label:'Posted',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'failed':{label:'Failed',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'message',label:'Message',width:'38%'},
  {key:'account_ids',label:'Accounts',width:'18%'},
  {key:'scheduled_date',label:'Scheduled',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'scheduled',label:'Scheduled'},
  {value:'posted',label:'Posted'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function SocialPage() {
  return (
    <GenericList
      model="social.post"
      title="Social Posts"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/social/new"
      formPath="/erp/social/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📲"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SocialForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="social.post" id={id}
      defaults={DEFAULTS}
      title="Social Post"
      backPath="/erp/social" backLabel="Social Posts"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Message'><textarea className='o-input' rows={3} value={record?.message||''} onChange={e=>setField('message',e.target.value)}/></FieldRow>
          <FieldRow label='Scheduled Date'><input type='datetime-local' className='o-input' value={(record?.scheduled_date||'').slice(0,16)} onChange={e=>setField('scheduled_date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SocialPage
