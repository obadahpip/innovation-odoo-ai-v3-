/**
 * WebsitePage.jsx — Website
 * Odoo 19.0 model: website
 * Route base: /erp/website
 * Sub-nav: ['Go to Website', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Website',width:'30%'},
  {key:'domain',label:'Domain',width:'30%'},
  {key:'company_id',label:'Company',width:'20%'},
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
export function WebsitePage() {
  return (
    <GenericList
      model="website"
      title="Website"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/website/new"
      formPath="/erp/website/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🌐"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function WebsiteForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="website" id={id}
      defaults={DEFAULTS}
      title="Website"
      backPath="/erp/website" backLabel="Website"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Website Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Domain'><input className='o-input' value={record?.domain||''} onChange={e=>setField('domain',e.target.value)} placeholder='e.g. https://www.example.com'/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default WebsitePage
