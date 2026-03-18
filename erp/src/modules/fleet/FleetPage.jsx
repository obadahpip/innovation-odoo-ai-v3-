/**
 * FleetPage.jsx — Fleet Vehicles
 * Odoo 19.0 model: fleet.vehicle
 * Route base: /erp/fleet
 * Sub-nav: ['Vehicles', 'Fleet Analysis', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'active':{label:'Active',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'inactive':{label:'Inactive',color:'var(--text3)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'name',label:'Vehicle',width:'22%'},
  {key:'driver_id',label:'Driver',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'model_id',label:'Model',width:'15%'},
  {key:'license_plate',label:'Plate',width:'12%'},
  {key:'state_id',label:'Status',width:'13%'},
  {key:'km_last_counter',label:'Mileage',width:'10%'},
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
export function FleetPage() {
  return (
    <GenericList
      model="fleet.vehicle"
      title="Fleet Vehicles"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/fleet/new"
      formPath="/erp/fleet/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🚗"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function FleetForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="fleet.vehicle" id={id}
      defaults={DEFAULTS}
      title="Fleet Vehicle"
      backPath="/erp/fleet" backLabel="Fleet Vehicles"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Vehicle'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='License Plate'><input className='o-input' value={record?.license_plate||''} onChange={e=>setField('license_plate',e.target.value)}/></FieldRow>
          <FieldRow label='Driver'><input className='o-input' value={record?.driver_id||''} onChange={e=>setField('driver_id',e.target.value)}/></FieldRow>
          <FieldRow label='Model'><input className='o-input' value={record?.model_id||''} onChange={e=>setField('model_id',e.target.value)}/></FieldRow>
          <FieldRow label='Acquisition Date'><input type='date' className='o-input' value={(record?.acquisition_date||'').slice(0,10)} onChange={e=>setField('acquisition_date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default FleetPage
