/**
 * RentalPage.jsx — Rental module
 * Lesson 33: Rental
 * Selectors: app-products, create-button, field-amount, kanban-card, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

function RentalShell({ children }) {
  const navigate = useNavigate()
  const items = [
    { label: 'Rental Orders',   path: '/erp/rental',          icon: '📋' },
    { label: 'Products',        path: '/erp/rental/products', icon: '📦' },
    { label: 'Reporting',       path: '/erp/rental/reporting',icon: '📊' },
    { label: 'Configuration',   path: '/erp/rental/config',   icon: '⚙' },
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 180, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '8px 0' }}>
        <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>RENTAL</div>
        {items.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

async function seedRental() {
  const existing = await listRecords('sale.order')
  if (existing.filter(r => r.is_rental).length > 0) return
  for (const r of [
    { name: 'R/00001', partner_id: 'Azure Interior',   state: 'draft',   is_rental: true, rental_start: '2025-03-10', rental_stop: '2025-03-17', amount_total: 350.00, product_id: 'Projector' },
    { name: 'R/00002', partner_id: 'Agrolait',         state: 'sale',    is_rental: true, rental_start: '2025-03-15', rental_stop: '2025-03-22', amount_total: 175.00, product_id: 'Folding Tables x10' },
    { name: 'R/00003', partner_id: 'Ready Mat',        state: 'sale',    is_rental: true, rental_start: '2025-04-01', rental_stop: '2025-04-05', amount_total: 520.00, product_id: 'Scaffolding Set' },
    { name: 'R/00004', partner_id: 'Deco Addict',      state: 'cancel',  is_rental: true, rental_start: '2025-02-20', rental_stop: '2025-02-25', amount_total: 0,      product_id: 'Generator 5kW' },
    { name: 'R/00005', partner_id: 'Marc Demo',        state: 'sent',    is_rental: true, rental_start: '2025-04-10', rental_stop: '2025-04-20', amount_total: 890.00, product_id: 'Camera Kit' },
  ]) await createRecord('sale.order', r)
}

/* ═══════════════════════════════════════════════════════════════
   RENTAL ORDERS KANBAN
═══════════════════════════════════════════════════════════════ */
export function RentalPage() {
  const navigate = useNavigate()
  const { records: allOrders, reload } = useRecordList('sale.order', { sortKey: 'name' })
  useEffect(() => { seedRental().then(reload) }, [])

  const records = allOrders.filter(r => r.is_rental)

  const STATE_COLOR = { draft: 'var(--text3)', sent: 'var(--warning)', sale: 'var(--success)', cancel: 'var(--danger)' }
  const STATE_LABEL = { draft: 'Quotation', sent: 'Quotation Sent', sale: 'Rental Order', cancel: 'Cancelled' }
  const stages = ['Quotation', 'Quotation Sent', 'Rental Order', 'Cancelled']
  const stageMap = { draft: 'Quotation', sent: 'Quotation Sent', sale: 'Rental Order', cancel: 'Cancelled' }

  return (
    <RentalShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Rental Orders</span>
          <button
            data-erp="app-products"
            style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => navigate('/erp/rental/products')}
          >
            📦 Products
          </button>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/rental/new')}>+ New</button>
        </div>

        {/* Kanban */}
        <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
          {stages.map(stage => {
            const stageRecords = records.filter(r => (stageMap[r.state] || 'Quotation') === stage)
            return (
              <div key={stage} style={{ width: 260, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{stageRecords.length}</span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stageRecords.map(rec => (
                    <div key={rec.id}
                      data-erp="kanban-card"
                      onClick={() => navigate(`/erp/rental/${rec.id}`)}
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', transition: 'all var(--t)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', marginBottom: 3 }}>{rec.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>{rec.partner_id}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>📦 {rec.product_id}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                        <span style={{ color: 'var(--text3)' }}>{rec.rental_start} →</span>
                        {rec.amount_total > 0 && <span style={{ fontWeight: 600, color: 'var(--teal)' }}>${Number(rec.amount_total).toFixed(2)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </RentalShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RENTAL ORDER FORM
═══════════════════════════════════════════════════════════════ */
export function RentalForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', partner_id: '', product_id: '', rental_start: '', rental_stop: '', amount_total: '', state: 'draft', is_rental: true, note: '' })

  useEffect(() => {
    if (!isNew) getRecord('sale.order', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, is_rental: true }
    if (isNew) await createRecord('sale.order', data)
    else       await updateRecord('sale.order', id, data)
    navigate('/erp/rental')
  }

  const handleConfirm = async () => {
    setVals(p => ({ ...p, state: 'sale' }))
    await handleSave()
  }

  const fields = [
    { key: 'partner_id',    label: 'Customer',      required: true, dataErp: 'field-name' },
    { key: 'product_id',    label: 'Product',       placeholder: 'e.g. Projector',  dataErp: 'field-name' },
    { key: 'rental_start',  label: 'Rental Start',  placeholder: 'YYYY-MM-DD' },
    { key: 'rental_stop',   label: 'Rental End',    placeholder: 'YYYY-MM-DD' },
    { key: 'amount_total',  label: 'Rental Price',  type: 'number', dataErp: 'field-amount' },
    { key: 'note',          label: 'Notes',         type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <RentalShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/rental')}>Discard</button>
          <span style={{ flex: 1 }} />
          {vals.state === 'draft' && (
            <button data-erp="create-button" className="btn btn-primary btn-sm"
              style={{ background: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleConfirm}>
              Confirm Rental
            </button>
          )}
        </div>
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {fields.map(f => {
              const full = f.fullWidth || f.type === 'textarea'
              return (
                <div key={f.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.label}{f.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea rows={4} data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : f.type === 'number' ? (
                    <input type="number" data-erp={f.dataErp} value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : (
                    <input type="text" data-erp={f.dataErp || 'field-name'}
                      value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder || ''} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </RentalShell>
  )
}
