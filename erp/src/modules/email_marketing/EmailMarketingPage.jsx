/**
 * EmailMarketingPage.jsx — Email Campaigns
 * Odoo 19.0 model: mailing.mailing
 * Route base: /erp/email-marketing
 * Sub-nav: ['Mailings', 'A/B Tests', 'Reporting', 'Configuration']
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
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'subject',label:'Subject',width:'26%'},
  {key:'email_from',label:'From',width:'18%'},
  {key:'sent_date',label:'Sent',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'sent',label:'Sent',width:'8%'},
  {key:'opened',label:'Opened',width:'8%'},
  {key:'replied',label:'Replied',width:'8%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'in_queue',label:'In Queue'},
  {value:'sending',label:'Sending'},
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
export function EmailMarketingPage() {
  return (
    <GenericList
      model="mailing.mailing"
      title="Email Campaigns"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/email-marketing/new"
      formPath="/erp/email-marketing/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📧"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function EmailMarketingForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="mailing.mailing" id={id}
      defaults={DEFAULTS}
      title="Email Campaign"
      backPath="/erp/email-marketing" backLabel="Email Campaigns"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Email Subject'><input className='o-input' value={record?.subject||''} onChange={e=>setField('subject',e.target.value)}/></FieldRow>
          <FieldRow label='Send From'><input className='o-input' value={record?.email_from||''} onChange={e=>setField('email_from',e.target.value)}/></FieldRow>
          <FieldRow label='Recipients'><input className='o-input' value={record?.mailing_model_id||''} onChange={e=>setField('mailing_model_id',e.target.value)}/></FieldRow>
          <FieldRow label='Body'><textarea className='o-input' rows={3} value={record?.body_html||''} onChange={e=>setField('body_html',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default EmailMarketingPage
