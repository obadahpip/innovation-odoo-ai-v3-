/**
 * SMSPage.jsx — SMS Campaigns
 * Odoo 19.0 model: mailing.mailing
 * Route base: /erp/sms
 * Sub-nav: ['SMS', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'in_queue':{label:'In Queue',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'sending':{label:'Sending',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Sent',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
}

const COLUMNS = [
  {key:'subject',label:'Campaign',width:'28%'},
  {key:'sent_date',label:'Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'sent',label:'Sent',width:'10%'},
  {key:'opened',label:'Opened',width:'10%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'in_queue',label:'In Queue'},
  {value:'done',label:'Sent'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function SMSPage() {
  return (
    <GenericList
      model="mailing.mailing"
      title="SMS Campaigns"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/sms/new"
      formPath="/erp/sms/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📱"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SMSForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="mailing.mailing" id={id}
      defaults={DEFAULTS}
      title="SMS Campaign"
      backPath="/erp/sms" backLabel="SMS Campaigns"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Campaign Name'><input className='o-input' value={record?.subject||''} onChange={e=>setField('subject',e.target.value)}/></FieldRow>
          <FieldRow label='Message'><textarea className='o-input' rows={3} value={record?.body_plaintext||''} onChange={e=>setField('body_plaintext',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SMSPage
