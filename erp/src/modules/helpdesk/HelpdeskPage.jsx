/**
 * HelpdeskPage.jsx — Helpdesk Tickets
 * Odoo 19.0 model: helpdesk.ticket
 * Route base: /erp/helpdesk
 * Sub-nav: ['My Tickets', 'All Tickets', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'new':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'in_progress':{label:'In Progress',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Subject',width:'26%'},
  {key:'team_id',label:'Team',width:'14%'},
  {key:'user_id',label:'Assigned',width:'14%'},
  {key:'partner_id',label:'Customer',width:'14%',render:(v) => <PartnerCell id={v}/>},
  {key:'priority',label:'Priority',width:'8%',render:(v) => <PriorityStars value={v}/>},
  {key:'stage_id',label:'Stage',width:'12%'},
]

const STAGES = [
  {value:'new',label:'New'},
  {value:'in_progress',label:'In Progress'},
  {value:'done',label:'Solved'},
  {value:'cancel',label:'Cancelled'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function HelpdeskPage() {
  return (
    <GenericList
      model="helpdesk.ticket"
      title="Helpdesk Tickets"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/helpdesk/new"
      formPath="/erp/helpdesk/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🎧"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function HelpdeskForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="helpdesk.ticket" id={id}
      defaults={DEFAULTS}
      title="Helpdesk Ticket"
      backPath="/erp/helpdesk" backLabel="Helpdesk Tickets"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Subject'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Helpdesk Team'><input className='o-input' value={record?.team_id||''} onChange={e=>setField('team_id',e.target.value)}/></FieldRow>
          <FieldRow label='Assigned To'><input className='o-input' value={record?.user_id||''} onChange={e=>setField('user_id',e.target.value)}/></FieldRow>
          <FieldRow label='Priority'><div style={{display:'flex',gap:4}}>{[0,1,2,3].map(p=>(<span key={p} onClick={()=>setField('priority',String(p))} style={{fontSize:18,cursor:'pointer',color:parseInt(record?.priority||'0')>=p?'#f0ad4e':'var(--border2)'}}>★</span>))}</div></FieldRow>
          <FieldRow label='Tags'><input className='o-input' value={record?.tag_ids||''} onChange={e=>setField('tag_ids',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default HelpdeskPage
