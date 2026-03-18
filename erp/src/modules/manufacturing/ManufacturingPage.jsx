/**
 * ManufacturingPage.jsx — Manufacturing module
 * Lesson 42: Manufacturing, Lesson 47: PLM
 * Selectors: app-manufacturing, confirm-button, create-button, field-amount,
 *            field-date, field-product, save-button, status-bar, approve-button,
 *            field-description, field-name, list-row
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SupplyChainShell from '../inventory/SupplyChainShell'
import {
  PageHeader, GenericList, GenericForm,
  StatusBadge, StatusBarField, OrderLinesTable, ConfirmButton, ApproveButton,
} from '../inventory/supplyHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'MANUFACTURING', items: [
    { label: 'Manufacturing Orders', path: '/erp/manufacturing',       icon: '🏭' },
    { label: 'Work Orders',          path: '/erp/manufacturing/work',  icon: '🔧' },
    { label: 'Scrap',                path: '/erp/manufacturing/scrap', icon: '🗑' },
  ]},
  { label: 'PRODUCTS', items: [
    { label: 'Bills of Materials',   path: '/erp/manufacturing/bom',      icon: '📋' },
    { label: 'Products',             path: '/erp/manufacturing/products',  icon: '📦' },
    { label: 'Operations',           path: '/erp/manufacturing/operations',icon: '⚙' },
  ]},
  { label: 'PLM', items: [
    { label: 'Engineering Changes',  path: '/erp/plm',     icon: '📝' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Production Analysis',  path: '/erp/manufacturing/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Settings',             path: '/erp/manufacturing/config',    icon: '⚙' },
  ]},
]

async function seedManufacturing() {
  const { listRecords } = await import('@data/db.js')
  const [mos, boms] = await Promise.all([
    listRecords('mrp.production'),
    listRecords('mrp.bom'),
  ])
  if (mos.length === 0) {
    for (const m of [
      { name: 'WH/MO/00001', product_id: 'Acoustic Bloc Screens', product_qty: 5, state: 'confirmed', scheduled_date: '2025-03-10', workcenter: 'Assembly' },
      { name: 'WH/MO/00002', product_id: 'Corner Desk Right Sit',  product_qty: 2, state: 'draft',     scheduled_date: '2025-03-15', workcenter: 'Woodwork' },
      { name: 'WH/MO/00003', product_id: 'Office Chair Black',     product_qty: 10,state: 'progress',  scheduled_date: '2025-03-05', workcenter: 'Assembly' },
      { name: 'WH/MO/00004', product_id: 'Bin Cushion Cover',      product_qty: 20,state: 'done',      scheduled_date: '2025-02-28', workcenter: 'Sewing' },
    ]) await createRecord('mrp.production', m)
  }
  if (boms.length === 0) {
    for (const b of [
      { product_id: 'Acoustic Bloc Screens', product_qty: 1, type: 'normal',    component_count: 4 },
      { product_id: 'Corner Desk Right Sit',  product_qty: 1, type: 'normal',    component_count: 6 },
      { product_id: 'Office Chair Black',     product_qty: 1, type: 'normal',    component_count: 8 },
      { product_id: 'Bin Cushion Cover',      product_qty: 1, type: 'phantom',   component_count: 2 },
    ]) await createRecord('mrp.bom', b)
  }
}

async function seedPLM() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('mrp.eco')
  if (existing.length > 0) return
  for (const e of [
    { name: 'ECO/00001', product_id: 'Acoustic Bloc Screens', type_id: 'Normal Change', state: 'confirmed', description: 'Update foam density from 30kg to 35kg.' },
    { name: 'ECO/00002', product_id: 'Corner Desk Right Sit',  type_id: 'Normal Change', state: 'draft',     description: 'Replace MDF panels with solid wood.' },
    { name: 'ECO/00003', product_id: 'Office Chair Black',     type_id: 'Urgent Change', state: 'done',      description: 'Fix gas cylinder attachment point.' },
  ]) await createRecord('mrp.eco', e)
}

/* ═══════════════════════════════════════════════════════════════
   MANUFACTURING ORDERS LIST
═══════════════════════════════════════════════════════════════ */
export function ManufacturingPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('mrp.production', { sortKey: 'name' })

  useEffect(() => { seedManufacturing().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', confirmed: 'var(--warning)', progress: 'var(--teal)', done: 'var(--success)', cancel: 'var(--danger)' }
  const STATE_LABEL = { draft: 'Draft', confirmed: 'Confirmed', progress: 'In Progress', done: 'Done', cancel: 'Cancelled' }

  const columns = [
    { key: 'name',           label: 'Reference',    style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'product_id',     label: 'Product',      style: { color: 'var(--text2)' } },
    { key: 'product_qty',    label: 'Quantity',     style: { color: 'var(--text2)' } },
    { key: 'scheduled_date', label: 'Scheduled',    style: { color: 'var(--text2)' } },
    { key: 'workcenter',     label: 'Work Center',  style: { color: 'var(--text2)' } },
    { key: 'state',          label: 'Status',       render: v => <StatusBadge label={STATE_LABEL[v] || v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Manufacturing Orders"
          onNew={() => navigate('/erp/manufacturing/new')}
          extra={
            <button data-erp="app-manufacturing"
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🏭 Manufacturing
            </button>
          }
        />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/manufacturing/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MANUFACTURING ORDER FORM
═══════════════════════════════════════════════════════════════ */
export function ManufacturingForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', product_id: '', product_qty: 1, scheduled_date: new Date().toISOString().split('T')[0], workcenter: '', note: '' })
  const [lines, setLines] = useState([{ id: 1, product_id: '', name: '', product_qty: 1, price_unit: 0 }])
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('mrp.production', id).then(r => {
      if (r) {
        setVals(r)
        const map = { draft: 'Draft', confirmed: 'Confirmed', progress: 'In Progress', done: 'Done' }
        setStatus(map[r.state] || 'Draft')
      }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'Confirmed': 'confirmed', 'In Progress': 'progress', 'Done': 'done' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('mrp.production', data)
    else       await updateRecord('mrp.production', id, data)
    navigate('/erp/manufacturing')
  }

  const handleConfirm = async () => { setStatus('Confirmed'); await handleSave() }

  const fields = [
    { key: 'product_id',     label: 'Product',        required: true, dataErp: 'field-product', fullWidth: false },
    { key: 'product_qty',    label: 'Quantity',        type: 'number', dataErp: 'field-amount' },
    { key: 'scheduled_date', label: 'Scheduled Date',  type: 'date',   dataErp: 'field-date' },
    { key: 'workcenter',     label: 'Work Center',     placeholder: 'e.g. Assembly' },
    { key: 'note',           label: 'Notes',           type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <StatusBarField
        stages={['Draft', 'Confirmed', 'In Progress', 'Done']}
        current={status}
        onChange={setStatus}
      />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/manufacturing')}
        extra={status === 'Draft' && <ConfirmButton label="Confirm" onClick={handleConfirm} />}
        tabs={['Components', 'Work Orders', 'Misc']}
        activeTab="Components"
        onTabChange={() => {}}
      >
        <OrderLinesTable lines={lines} onChange={setLines} productLabel="Component" />
      </GenericForm>
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BILL OF MATERIALS LIST
═══════════════════════════════════════════════════════════════ */
export function BOMList() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('mrp.bom', { sortKey: 'product_id' })

  useEffect(() => { seedManufacturing().then(reload) }, [])

  const columns = [
    { key: 'product_id',      label: 'Product',     style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'product_qty',     label: 'Quantity',    style: { color: 'var(--text2)' } },
    { key: 'type',            label: 'BoM Type',    render: v => <StatusBadge label={v || 'normal'} color="#17a2b8" /> },
    { key: 'component_count', label: 'Components',  style: { color: 'var(--text2)' } },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Bills of Materials" onNew={() => navigate('/erp/manufacturing/bom/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/manufacturing/bom/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PLM — Engineering Change Orders (Lesson 47)
═══════════════════════════════════════════════════════════════ */
export function PLMPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('mrp.eco', { sortKey: 'name' })

  useEffect(() => { seedPLM().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', confirmed: 'var(--warning)', done: 'var(--success)' }

  const columns = [
    { key: 'name',        label: 'Reference',  style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'product_id',  label: 'Product',    style: { color: 'var(--text2)' } },
    { key: 'type_id',     label: 'Type',       render: v => <StatusBadge label={v || 'Normal'} color="#17a2b8" /> },
    { key: 'state',       label: 'Status',     render: v => <StatusBadge label={v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Engineering Change Orders" onNew={() => navigate('/erp/plm/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/plm/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

export function PLMForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', product_id: '', type_id: 'Normal Change', description: '', state: 'draft' })
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('mrp.eco', id).then(r => {
      if (r) { setVals(r); setStatus(r.state === 'done' ? 'Done' : r.state === 'confirmed' ? 'Confirmed' : 'Draft') }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'Confirmed': 'confirmed', 'Done': 'done' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('mrp.eco', data)
    else       await updateRecord('mrp.eco', id, data)
    navigate('/erp/plm')
  }

  const fields = [
    { key: 'name',        label: 'Reference',   dataErp: 'field-name', fullWidth: true },
    { key: 'product_id',  label: 'Product',     dataErp: 'field-product' },
    { key: 'type_id',     label: 'Change Type', type: 'select', options: ['Normal Change','Urgent Change','Minor Change'] },
    { key: 'description', label: 'Description', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <StatusBarField stages={['Draft', 'Confirmed', 'Done']} current={status} onChange={setStatus} />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/plm')}
        extra={status === 'Confirmed' && <ApproveButton label="Approve" onClick={() => { setStatus('Done'); handleSave() }} />}
      />
    </SupplyChainShell>
  )
}
