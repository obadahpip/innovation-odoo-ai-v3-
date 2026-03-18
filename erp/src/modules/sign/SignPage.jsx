/**
 * SignPage.jsx — Sign Requests
 * Odoo 19.0 model: sign.request
 * Route base: /erp/sign
 * Sub-nav: ['Sign Requests', 'Templates', 'Reporting']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'sent':{label:'Sent',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'signed':{label:'Signed',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'declined':{label:'Declined',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
  'canceled':{label:'Cancelled',color:'var(--text3)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'reference',label:'Reference',width:'24%'},
  {key:'template_id',label:'Template',width:'18%'},
  {key:'create_date',label:'Sent',width:'14%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'sent',label:'Sent'},
  {value:'signed',label:'Signed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function SignPage() {
  return (
    <GenericList
      model="sign.request"
      title="Sign Requests"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/sign/new"
      formPath="/erp/sign/:id"
      searchFields={['name','subject','title']}
      emptyIcon="✍️"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SignForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="sign.request" id={id}
      defaults={DEFAULTS}
      title="Sign Request"
      backPath="/erp/sign" backLabel="Sign Requests"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Document Name'><input className='o-input' value={record?.reference||''} onChange={e=>setField('reference',e.target.value)}/></FieldRow>
          <FieldRow label='Template'><input className='o-input' value={record?.template_id||''} onChange={e=>setField('template_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SignPage
