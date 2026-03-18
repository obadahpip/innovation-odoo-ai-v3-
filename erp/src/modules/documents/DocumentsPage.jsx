/**
 * DocumentsPage.jsx — Documents
 * Odoo 19.0 model: documents.document
 * Route base: /erp/documents
 * Sub-nav: ['Documents', 'Trash', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'name',label:'Name',width:'28%'},
  {key:'folder_id',label:'Folder',width:'16%'},
  {key:'owner_id',label:'Owner',width:'14%'},
  {key:'create_date',label:'Created',width:'14%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'mimetype',label:'Type',width:'12%'},
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
export function DocumentsPage() {
  return (
    <GenericList
      model="documents.document"
      title="Documents"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/documents/new"
      formPath="/erp/documents/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📄"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function DocumentsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="documents.document" id={id}
      defaults={DEFAULTS}
      title="Document"
      backPath="/erp/documents" backLabel="Documents"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Document Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Folder'><input className='o-input' value={record?.folder_id||''} onChange={e=>setField('folder_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default DocumentsPage
