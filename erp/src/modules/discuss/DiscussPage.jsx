/**
 * DiscussPage.jsx — Discuss
 * Odoo 19.0 model: mail.channel
 * Route base: /erp/discuss
 * Sub-nav: ['Inbox', 'Starred', 'Channels', 'Direct Messages']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Channel',width:'30%'},
  {key:'channel_type',label:'Type',width:'15%'},
  {key:'message_count',label:'Messages',width:'12%'},
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
export function DiscussPage() {
  return (
    <GenericList
      model="mail.channel"
      title="Discuss"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/discuss/new"
      formPath="/erp/discuss/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💬"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function DiscussForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="mail.channel" id={id}
      defaults={DEFAULTS}
      title="Discu"
      backPath="/erp/discuss" backLabel="Discuss"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Channel Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Description'><textarea className='o-input' rows={3} value={record?.description||''} onChange={e=>setField('description',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default DiscussPage
