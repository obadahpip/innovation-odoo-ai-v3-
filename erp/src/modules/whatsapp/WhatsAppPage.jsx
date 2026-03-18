/**
 * WhatsAppPage.jsx — WhatsApp
 * Odoo 19.0 model: whatsapp.message
 * Route base: /erp/whatsapp
 * Sub-nav: ['Conversations', 'Templates', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'sent':{label:'Sent',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'delivered':{label:'Delivered',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'read':{label:'Read',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'failed':{label:'Failed',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Contact',width:'22%'},
  {key:'message',label:'Message',width:'32%'},
  {key:'create_date',label:'Date',width:'15%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
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
export function WhatsAppPage() {
  return (
    <GenericList
      model="whatsapp.message"
      title="WhatsApp"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/whatsapp/new"
      formPath="/erp/whatsapp/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💬"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function WhatsAppForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="whatsapp.message" id={id}
      defaults={DEFAULTS}
      title="WhatsApp"
      backPath="/erp/whatsapp" backLabel="WhatsApp"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Contact'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Message'><textarea className='o-input' rows={3} value={record?.message||''} onChange={e=>setField('message',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default WhatsAppPage
