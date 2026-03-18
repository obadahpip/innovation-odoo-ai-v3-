/**
 * PurchasePage.jsx — Purchase module
 * Lesson 41: Purchase
 * Selectors: confirm-button, create-button, field-amount, field-name,
 *            field-product, list-row, save-button, status-bar
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SupplyChainShell from '../inventory/SupplyChainShell'
import {
  PageHeader, GenericList, GenericForm,
  StatusBadge, StatusBarField, OrderLinesTable, ConfirmButton,
} from '../inventory/supplyHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

const SIDEBAR = [
  { label: 'ORDERS', items: [
    { label: 'Requests for Quotation', path: '/erp/purchase/rfq',    icon: '📝' },
    { label: 'Purchase Orders',        path: '/erp/purchase/orders', icon: '🛍' },
  ]},
  { label: 'PRODUCTS', items: [
    { label: 'Products',        path: '/erp/purchase/products',   icon: '📦' },
    { label: 'Vendor Prices',   path: '/erp/purchase/pricelists', icon: '💰' },
  ]},
  { label: 'REPORTING', items: [
    { label: 'Purchase Analysis', path: '/erp/purchase/reporting', icon: '📊' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Settings', path: '/erp/purchase/config', icon: '⚙' },
  ]},
]

async function seedPurchase() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('purchase.order')
  if (existing.length > 0) return
  for (const p of [
    { name: 'P/00001', partner_id: 'Azure Interior',    state: 'purchase', date_order: '2025-02-15', amount_total: 4500.00 },
    { name: 'P/00002', partner_id: 'Deco Addict',       state: 'draft',    date_order: '2025-03-01', amount_total: 1200.00 },
    { name: 'P/00003', partner_id: 'Ready Mat',         state: 'sent',     date_order: '2025-03-05', amount_total: 8750.00 },
    { name: 'P/00004', partner_id: 'Lumber Inc',        state: 'purchase', date_order: '2025-03-10', amount_total: 620.00  },
    { name: 'P/00005', partner_id: 'Azure Interior',    state: 'draft',    date_order: '2025-03-15', amount_total: 3200.00 },
  ]) await createRecord('purchase.order', p)
}

/* ── RFQ / Orders list ──────────────────────────────────────────── */
export function PurchasePage({ stateFilter, title = 'Purchase Orders' }) {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('purchase.order', { sortKey: 'name' })

  useEffect(() => { seedPurchase().then(reload) }, [])

  const rows = stateFilter ? records.filter(r => stateFilter.includes(r.state)) : records

  const STATE_COLOR = { draft: 'var(--text3)', sent: 'var(--warning)', purchase: 'var(--success)', cancel: 'var(--danger)' }
  const STATE_LABEL = { draft: 'RFQ', sent: 'RFQ Sent', purchase: 'Purchase Order', cancel: 'Cancelled' }

  const columns = [
    { key: 'name',         label: 'Reference',  style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'partner_id',   label: 'Vendor',     style: { color: 'var(--text2)' } },
    { key: 'date_order',   label: 'Order Date', style: { color: 'var(--text2)' } },
    { key: 'amount_total', label: 'Total',      render: v => v ? `$${Number(v).toFixed(2)}` : '—' },
    { key: 'state',        label: 'Status',     render: v => <StatusBadge label={STATE_LABEL[v] || v} color={STATE_COLOR[v] || 'var(--text3)'} /> },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title={title} onNew={() => navigate('/erp/purchase/orders/new')} />
        <GenericList columns={columns} rows={rows} onRowClick={r => navigate(`/erp/purchase/orders/${r.id}`)} />
      </div>
    </SupplyChainShell>
  )
}

/* ── Purchase Order Form ────────────────────────────────────────── */
export function PurchaseForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]   = useState({ name: '', partner_id: '', date_order: new Date().toISOString().split('T')[0], state: 'draft', notes: '' })
  const [lines, setLines] = useState([{ id: 1, product_id: '', name: '', product_qty: 1, price_unit: 0 }])
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('purchase.order', id).then(r => {
      if (r) {
        setVals(r)
        const map = { draft: 'Draft', sent: 'RFQ Sent', purchase: 'Purchase Order', cancel: 'Cancelled' }
        setStatus(map[r.state] || 'Draft')
      }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'RFQ Sent': 'sent', 'Purchase Order': 'purchase', 'Cancelled': 'cancel' }
    const total = lines.reduce((s, l) => s + (Number(l.product_qty) || 0) * (Number(l.price_unit) || 0), 0)
    const data = { ...vals, state: stateMap[status] || 'draft', amount_total: total }
    if (isNew) await createRecord('purchase.order', data)
    else       await updateRecord('purchase.order', id, data)
    navigate('/erp/purchase/orders')
  }

  const handleConfirm = async () => { setStatus('Purchase Order'); await handleSave() }

  const fields = [
    { key: 'partner_id',  label: 'Vendor',       required: true, dataErp: 'field-name', fullWidth: false },
    { key: 'date_order',  label: 'Order Date',   type: 'date',   dataErp: 'field-date' },
    { key: 'notes',       label: 'Notes',        type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SupplyChainShell sidebarSections={SIDEBAR}>
      <StatusBarField
        stages={['Draft', 'RFQ Sent', 'Purchase Order', 'Done']}
        current={status}
        onChange={setStatus}
      />
      <GenericForm
        fields={fields} values={vals}
        onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
        onSave={handleSave}
        onDiscard={() => navigate('/erp/purchase/orders')}
        extra={status === 'Draft' && <ConfirmButton label="Confirm Order" onClick={handleConfirm} />}
      >
        <OrderLinesTable lines={lines} onChange={setLines} productLabel="Product" />
      </GenericForm>
    </SupplyChainShell>
  )
}
