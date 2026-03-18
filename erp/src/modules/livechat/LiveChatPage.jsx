/**
 * LiveChatPage.jsx — Live Chat
 * Odoo 19.0 model: im_livechat.channel
 * Route base: /erp/livechat
 * Sub-nav: ['Conversations', 'Reports', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Channel',width:'30%'},
  {key:'nb_agents',label:'Agents',width:'14%'},
  {key:'are_you_inside',label:'Active',width:'12%'},
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
export function LiveChatPage() {
  return (
    <GenericList
      model="im_livechat.channel"
      title="Live Chat"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/livechat/new"
      formPath="/erp/livechat/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💬"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function LiveChatForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="im_livechat.channel" id={id}
      defaults={DEFAULTS}
      title="Live Chat"
      backPath="/erp/livechat" backLabel="Live Chat"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Channel Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default LiveChatPage
