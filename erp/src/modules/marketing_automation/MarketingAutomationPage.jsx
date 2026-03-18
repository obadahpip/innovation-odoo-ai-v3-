/**
 * MarketingAutomationPage.jsx — Marketing Campaigns
 * Odoo 19.0 model: marketing.campaign
 * Route base: /erp/marketing-automation
 * Sub-nav: ['Campaigns', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'running':{label:'Running',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'stopped':{label:'Stopped',color:'var(--text2)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'name',label:'Campaign',width:'28%'},
  {key:'model_id',label:'Target',width:'18%'},
  {key:'total_participant_count',label:'Participants',width:'14%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'running',label:'Running'},
  {value:'stopped',label:'Stopped'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function MarketingAutomationPage() {
  return (
    <GenericList
      model="marketing.campaign"
      title="Marketing Campaigns"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/marketing-automation/new"
      formPath="/erp/marketing-automation/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🤖"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function MarketingAutomationForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="marketing.campaign" id={id}
      defaults={DEFAULTS}
      title="Marketing Campaign"
      backPath="/erp/marketing-automation" backLabel="Marketing Campaigns"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Campaign Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Runs On'><input className='o-input' value={record?.model_id||''} onChange={e=>setField('model_id',e.target.value)}/></FieldRow>
          <FieldRow label='Domain Filter'><input className='o-input' value={record?.filter_id||''} onChange={e=>setField('filter_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default MarketingAutomationPage
