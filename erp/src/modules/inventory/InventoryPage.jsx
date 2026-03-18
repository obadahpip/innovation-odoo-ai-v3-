/**
 * InventoryPage.jsx — Full Inventory module
 * Lessons: 17 (IoT), 40 (Inventory), 43 (Barcode), 44 (Quality), 46 (Repairs), 72 (Documents)
 * Selectors: create-button, field-amount, field-name, field-description, field-type,
 *            field-product, field-customer, field-date, list-row, save-button,
 *            new-button, confirm-button, status-bar, kanban-card, submit-button, app-inventory
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import SupplyChainShell from './SupplyChainShell'
import {
  PageHeader, GenericList, GenericForm,
  StatusBadge, StatusBarField, OrderLinesTable, ConfirmButton, SubmitButton,
} from './supplyHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

/* ── Sidebar config ─────────────────────────────────────────────── */
const SIDEBAR = [
  { label: 'PRODUCTS', items: [
    { label: 'Products',         path: '/erp/inventory/products', icon: '📦' },
    { label: 'Lots & Serials',   path: '/erp/inventory/lots',     icon: '🔢' },
  ]},
  { label: 'OPERATIONS', items: [
    { label: 'Transfers',        path: '/erp/inventory/transfers',  icon: '🔄' },
    { label: 'Physical Inventory', path: '/erp/inventory/physical', icon: '📋' },
    { label: 'Scrap',            path: '/erp/inventory/scrap',     icon: '🗑' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Moves Analysis',   path: '/erp/inventory/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Warehouses',       path: '/erp/inventory/warehouses', icon: '🏭' },
    { label: 'Settings',         path: '/erp/inventory/config',    icon: '⚙' },
  ]},
]

/* ── Seed data ──────────────────────────────────────────────────── */
async function seedInventory() {
  const { listRecords } = await import('@data/db.js')
  const [prods, transfers] = await Promise.all([
    listRecords('product.template'),
    listRecords('stock.picking'),
  ])
  if (prods.length === 0) {
    for (const p of [
      { name: 'Acoustic Bloc Screens',    type: 'storable', qty_available: 48, standard_price: 1800, list_price: 2950, categ_id: 'All / Saleable', barcode: 'E-COM09' },
      { name: 'Bin Cushion Cover',        type: 'storable', qty_available: 120, standard_price: 28,  list_price: 45.5, categ_id: 'All / Saleable',  barcode: 'E-COM10' },
      { name: 'Corner Desk Right Sit',    type: 'storable', qty_available: 15,  standard_price: 500, list_price: 890,  categ_id: 'All / Furniture', barcode: 'FURN-9999' },
      { name: 'iPad Retina Display',      type: 'storable', qty_available: 7,   standard_price: 1400,list_price: 2199, categ_id: 'All / Electronics', barcode: 'PROD-0001' },
      { name: 'VOIP Phone',              type: 'storable', qty_available: 43,  standard_price: 80,  list_price: 129.99, categ_id: 'All / Electronics', barcode: 'PROD-0002' },
      { name: 'Office Chair Black',       type: 'storable', qty_available: 22,  standard_price: 180, list_price: 320,  categ_id: 'All / Furniture', barcode: 'FURN-0001' },
    ]) await createRecord('product.template', p)
  }
  if (transfers.length === 0) {
    for (const t of [
      { name: 'WH/IN/00001',  picking_type_code: 'incoming', state: 'done',    partner_id: 'Azure Interior',       scheduled_date: '2025-03-01' },
      { name: 'WH/OUT/00001', picking_type_code: 'outgoing', state: 'ready',   partner_id: 'Agrolait',             scheduled_date: '2025-03-05' },
      { name: 'WH/IN/00002',  picking_type_code: 'incoming', state: 'waiting', partner_id: 'Deco Addict',          scheduled_date: '2025-03-10' },
      { name: 'WH/OUT/00002', picking_type_code: 'outgoing', state: 'draft',   partner_id: 'Ready Mat',            scheduled_date: '2025-03-15' },
      { name: 'WH/INT/00001', picking_type_code: 'internal', state: 'ready',   partner_id: '',                     scheduled_date: '2025-03-08' },
    ]) await createRecord('stock.picking', t)
  }
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS LIST
═══════════════════════════════════════════════════════════════ */
export function ProductsList() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('product.template', { sortKey: 'name' })

  useEffect(() => { seedInventory().then(reload) }, [])

  const columns = [
    { key: 'name',           label: 'Product',     style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'barcode',        label: 'Barcode',     style: { color: 'var(--text2)', fontFamily: 'monospace', fontSize: 12 } },
    { key: 'categ_id',       label: 'Category',    style: { color: 'var(--text2)' } },
    { key: 'qty_available',  label: 'On Hand',     style: { color: 'var(--text)', textAlign: 'right' } },
    { key: 'list_price',     label: 'Sales Price', render: v => v ? `$${Number(v).toFixed(2)}` : '—' },
    { key: 'type',           label: 'Type',        render: v => <StatusBadge label={v || 'storable'} color="#17a2b8" /> },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Products"
          onNew={() => navigate('/erp/inventory/products/new')}
          extra={
            <button data-erp="app-inventory"
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => navigate('/erp/inventory/products')}
            >
              📦 All Products
            </button>
          }
        />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/inventory/products/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT FORM
═══════════════════════════════════════════════════════════════ */
export function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', type: 'storable', categ_id: '', barcode: '', list_price: '', standard_price: '', qty_available: 0, description: '' })
  const [tab, setTab] = useState('General')

  useEffect(() => {
    if (!isNew) getRecord('product.template', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('product.template', vals)
    else       await updateRecord('product.template', id, vals)
    navigate('/erp/inventory/products')
  }

  const generalFields = [
    { key: 'name',           label: 'Product Name',  required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'type',           label: 'Product Type',  type: 'select', options: ['storable','consumable','service'], dataErp: 'field-type' },
    { key: 'categ_id',       label: 'Category',      placeholder: 'e.g. All / Saleable' },
    { key: 'barcode',        label: 'Barcode',        placeholder: 'Scan or type barcode', dataErp: 'field-name' },
    { key: 'list_price',     label: 'Sales Price',   type: 'number', dataErp: 'field-amount' },
    { key: 'standard_price', label: 'Cost',          type: 'number', dataErp: 'field-amount' },
  ]
  const descFields = [
    { key: 'description', label: 'Internal Notes', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <GenericForm
        fields={tab === 'General' ? generalFields : tab === 'Notes' ? descFields : []}
        values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/inventory/products')}
        tabs={['General', 'Attributes', 'Variants', 'Notes']}
        activeTab={tab}
        onTabChange={setTab}
      />
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TRANSFERS LIST
═══════════════════════════════════════════════════════════════ */
export function TransfersList() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('stock.picking', { sortKey: 'name' })

  useEffect(() => { seedInventory().then(reload) }, [])

  const STATE_COLOR = { done: 'var(--success)', ready: 'var(--teal)', waiting: 'var(--warning)', draft: 'var(--text3)' }
  const TYPE_LABEL  = { incoming: 'Receipt', outgoing: 'Delivery', internal: 'Internal' }

  const columns = [
    { key: 'name',             label: 'Reference',  style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'picking_type_code',label: 'Type',       render: v => <StatusBadge label={TYPE_LABEL[v] || v} color="#17a2b8" /> },
    { key: 'partner_id',       label: 'Contact',    style: { color: 'var(--text2)' } },
    { key: 'scheduled_date',   label: 'Scheduled',  style: { color: 'var(--text2)' } },
    { key: 'state',            label: 'Status',     render: v => <StatusBadge label={v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Transfers" onNew={() => navigate('/erp/inventory/transfers/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/inventory/transfers/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TRANSFER FORM
═══════════════════════════════════════════════════════════════ */
export function TransferForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', picking_type_code: 'incoming', partner_id: '', scheduled_date: '', state: 'draft', note: '' })
  const [lines, setLines] = useState([{ id: 1, product_id: '', product_qty: 1, price_unit: 0 }])
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('stock.picking', id).then(r => { if (r) { setVals(r); setStatus(r.state === 'done' ? 'Done' : r.state === 'ready' ? 'Ready' : 'Draft') } })
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, state: status.toLowerCase() }
    if (isNew) await createRecord('stock.picking', data)
    else       await updateRecord('stock.picking', id, data)
    navigate('/erp/inventory/transfers')
  }

  const handleConfirm = async () => {
    setStatus('Ready')
    await handleSave()
  }

  const fields = [
    { key: 'picking_type_code', label: 'Operation Type', type: 'select', options: ['incoming','outgoing','internal'], dataErp: 'field-type' },
    { key: 'partner_id',       label: 'Contact',         placeholder: 'Customer or vendor', dataErp: 'field-customer' },
    { key: 'scheduled_date',   label: 'Scheduled Date',  type: 'date', dataErp: 'field-date' },
    { key: 'note',             label: 'Notes',           type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <StatusBarField stages={['Draft', 'Ready', 'Done']} current={status} onChange={setStatus} />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/inventory/transfers')}
        extra={status === 'Draft' && <ConfirmButton label="Validate" onClick={handleConfirm} />}
      >
        <OrderLinesTable lines={lines} onChange={setLines} productLabel="Product" />
      </GenericForm>
    </SupplyChainShell>
  )
}
