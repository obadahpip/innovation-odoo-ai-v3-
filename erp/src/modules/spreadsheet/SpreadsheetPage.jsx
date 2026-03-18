/**
 * SpreadsheetPage.jsx — Spreadsheets
 * Odoo 19.0 model: spreadsheet.document
 * Route base: /erp/spreadsheet
 * Sub-nav: ['Spreadsheets']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Name',width:'32%'},
  {key:'create_uid',label:'Created By',width:'20%'},
  {key:'write_date',label:'Last Modified',width:'18%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
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
export function SpreadsheetPage() {
  return (
    <GenericList
      model="spreadsheet.document"
      title="Spreadsheets"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/spreadsheet/new"
      formPath="/erp/spreadsheet/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📊"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SpreadsheetForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="spreadsheet.document" id={id}
      defaults={DEFAULTS}
      title="Spreadsheet"
      backPath="/erp/spreadsheet" backLabel="Spreadsheets"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Spreadsheet Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SpreadsheetPage
