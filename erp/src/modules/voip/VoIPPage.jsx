/**
 * VoIPPage.jsx — VoIP Calls
 * Odoo 19.0 model: voip.call
 * Route base: /erp/voip
 * Sub-nav: ['Calls', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'incoming':{label:'Incoming',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'outgoing':{label:'Outgoing',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'missed':{label:'Missed',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Contact',width:'22%'},
  {key:'phone',label:'Phone Number',width:'18%'},
  {key:'duration',label:'Duration',width:'12%'},
  {key:'date',label:'Date',width:'18%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'state',label:'Type',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
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
export function VoIPPage() {
  return (
    <GenericList
      model="voip.call"
      title="VoIP Calls"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/voip/new"
      formPath="/erp/voip/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📞"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function VoIPForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="voip.call" id={id}
      defaults={DEFAULTS}
      title="VoIP Call"
      backPath="/erp/voip" backLabel="VoIP Calls"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Contact'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Phone'><input className='o-input' value={record?.phone||''} onChange={e=>setField('phone',e.target.value)}/></FieldRow>
          <FieldRow label='Date'><input type='datetime-local' className='o-input' value={(record?.date||'').slice(0,16)} onChange={e=>setField('date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default VoIPPage
