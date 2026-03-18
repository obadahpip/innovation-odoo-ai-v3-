/**
 * MaintenancePage.jsx — Maintenance Requests
 * Odoo 19.0 model: maintenance.request
 * Route base: /erp/maintenance
 * Sub-nav: ['Maintenance Requests', 'Equipment', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'New',color:'var(--text3)',bg:'var(--surface3)'},
  'confirmed':{label:'Confirmed',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'ready':{label:'Ready to Repair',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'under_repair':{label:'Under Repair',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Repaired',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Request',width:'24%'},
  {key:'equipment_id',label:'Equipment',width:'18%'},
  {key:'maintenance_type',label:'Type',width:'12%'},
  {key:'user_id',label:'Technician',width:'15%'},
  {key:'stage_id',label:'Stage',width:'12%'},
]

const STAGES = [
  {value:'draft',label:'New'},
  {value:'confirmed',label:'Confirmed'},
  {value:'under_repair',label:'Under Repair'},
  {value:'done',label:'Repaired'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function MaintenancePage() {
  return (
    <GenericList
      model="maintenance.request"
      title="Maintenance Requests"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/maintenance/new"
      formPath="/erp/maintenance/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🔧"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function MaintenanceForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="maintenance.request" id={id}
      defaults={DEFAULTS}
      title="Maintenance Request"
      backPath="/erp/maintenance" backLabel="Maintenance Requests"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Request Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Equipment'><input className='o-input' value={record?.equipment_id||''} onChange={e=>setField('equipment_id',e.target.value)}/></FieldRow>
          <FieldRow label='Maintenance Type'><select className='o-input' value={record?.maintenance_type||''} onChange={e=>setField('maintenance_type',e.target.value)}><option value='corrective'>Corrective</option><option value='preventive'>Preventive</option></select></FieldRow>
          <FieldRow label='Responsible'><input className='o-input' value={record?.user_id||''} onChange={e=>setField('user_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default MaintenancePage
