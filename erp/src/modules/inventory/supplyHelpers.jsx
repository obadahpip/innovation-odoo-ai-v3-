/**
 * supplyHelpers.jsx
 * Shared UI primitives for supply chain modules.
 * Identical pattern to websiteHelpers but independent file.
 */
import { useState } from 'react'

/* ── Page header ────────────────────────────────────────────────── */
export function PageHeader({ title, onNew, newLabel = 'New', extra, subtitle }) {
  return (
    <div style={{
      padding: '10px 20px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        {subtitle && <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 10 }}>{subtitle}</span>}
      </div>
      {extra}
      {onNew && (
        <button
          data-erp="new-button"
          className="btn btn-primary btn-sm"
          onClick={onNew}
        >
          + New
        </button>
      )}
    </div>
  )
}

/* ── Status badge ───────────────────────────────────────────────── */
export function StatusBadge({ label, color = 'var(--teal)' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: color + '22',
      border: `1px solid ${color}44`,
      color,
    }}>{label}</span>
  )
}

/* ── Status pipeline bar (for forms: Draft → Confirmed → Done) ─── */
export function StatusBarField({ stages, current, onChange }) {
  return (
    <div data-erp="status-bar" style={{
      display: 'flex', alignItems: 'center', gap: 2,
      padding: '8px 20px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0, overflowX: 'auto',
    }}>
      {stages.map((stage, i) => {
        const isActive  = stage === current
        const isPast    = stages.indexOf(current) > i
        return (
          <button key={stage} onClick={() => onChange?.(stage)}
            style={{
              padding: '4px 14px', borderRadius: 20,
              border: `1px solid ${isActive ? 'var(--teal)' : isPast ? 'var(--border2)' : 'transparent'}`,
              background: isActive ? 'var(--teal)' : 'transparent',
              color: isActive ? '#fff' : isPast ? 'var(--text2)' : 'var(--text3)',
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all var(--t)',
            }}
          >{stage}</button>
        )
      })}
    </div>
  )
}

/* ── Generic list table ─────────────────────────────────────────── */
export function GenericList({ columns, rows, onRowClick, emptyMsg = 'No records found.' }) {
  const [sel, setSel] = useState(new Set())
  const toggleAll = () => setSel(sel.size === rows.length ? new Set() : new Set(rows.map(r => r.id)))
  const toggle    = id => { const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); setSel(s) }

  return (
    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
            <th style={TH}><input type="checkbox" onChange={toggleAll} checked={sel.size === rows.length && rows.length > 0} /></th>
            {columns.map(c => <th key={c.key} style={{ ...TH, width: c.width }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
              {emptyMsg}
            </td></tr>
          )}
          {rows.map((row, i) => (
            <tr key={row.id || i}
              data-erp="list-row"
              onClick={() => onRowClick?.(row)}
              style={{ borderBottom: '1px solid var(--border)', cursor: onRowClick ? 'pointer' : 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={TD} onClick={e => { e.stopPropagation(); toggle(row.id) }}>
                <input type="checkbox" checked={sel.has(row.id)} onChange={() => {}} />
              </td>
              {columns.map(c => (
                <td key={c.key} style={{ ...TD, ...c.style }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Generic form ───────────────────────────────────────────────── */
export function GenericForm({ fields, values, onChange, onSave, onDiscard, tabs, activeTab, onTabChange, extra, children }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Action bar */}
      <div style={{
        padding: '8px 20px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <button data-erp="save-button"    className="btn btn-primary btn-sm" onClick={onSave}>Save</button>
        <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={onDiscard}>Discard</button>
        <span style={{ flex: 1 }} />
        {extra}
      </div>

      {/* Tabs */}
      {tabs && (
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border)',
          background: 'var(--surface)', padding: '0 20px', flexShrink: 0,
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => onTabChange?.(tab)} style={{
              padding: '9px 16px', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--teal)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--teal)' : 'var(--text2)',
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{tab}</button>
          ))}
        </div>
      )}

      {/* Fields */}
      <div style={{ padding: '20px 24px', maxWidth: 960, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {(fields || []).map(field => {
            if (field.hidden) return null
            const full = field.fullWidth || field.type === 'textarea'
            return (
              <div key={field.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'var(--text3)', marginBottom: 5,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {field.label}
                  {field.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea rows={4}
                    data-erp={field.dataErp || `field-${field.key}`}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || ''}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ) : field.type === 'select' ? (
                  <select
                    data-erp={field.dataErp || `field-${field.key}`}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">— Select —</option>
                    {(field.options || []).map(o => (
                      <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
                    ))}
                  </select>
                ) : field.type === 'number' ? (
                  <input type="number"
                    data-erp={field.dataErp || 'field-amount'}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || '0'}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ) : field.type === 'date' ? (
                  <input type="date"
                    data-erp={field.dataErp || 'field-date'}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ) : field.type === 'toggle' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
                    <div
                      data-erp={field.dataErp || `field-${field.key}`}
                      onClick={() => onChange(field.key, !values[field.key])}
                      style={{
                        width: 40, height: 22, borderRadius: 11,
                        background: values[field.key] ? 'var(--teal)' : 'var(--border2)',
                        position: 'relative', cursor: 'pointer',
                        transition: 'background var(--t)', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2,
                        left: values[field.key] ? 20 : 2,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#fff', transition: 'left var(--t)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                      {values[field.key] ? (field.onLabel || 'Yes') : (field.offLabel || 'No')}
                    </span>
                  </div>
                ) : (
                  <input type="text"
                    data-erp={field.dataErp || (field.key === 'name' ? 'field-name' : field.key === 'product_id' ? 'field-product' : field.key === 'partner_id' ? 'field-customer' : `field-${field.key}`)}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || ''}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                )}
              </div>
            )
          })}
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── Order lines table ──────────────────────────────────────────── */
export function OrderLinesTable({ lines, onChange, productLabel = 'Product' }) {
  const addLine = () => onChange([...lines, { product_id: '', product_qty: 1, price_unit: 0, id: Date.now() }])
  const removeLine = id => onChange(lines.filter(l => l.id !== id))
  const updateLine = (id, key, val) => onChange(lines.map(l => l.id === id ? { ...l, [key]: val } : l))

  const subtotal = lines.reduce((s, l) => s + (Number(l.product_qty) || 0) * (Number(l.price_unit) || 0), 0)

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        Order Lines
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--surface)' }}>
            {[productLabel, 'Description', 'Quantity', 'Unit Price', 'Subtotal', ''].map(h => (
              <th key={h} style={{ ...TH, padding: '6px 10px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.map(line => (
            <tr key={line.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={TD}>
                <input data-erp="field-product" value={line.product_id || ''} onChange={e => updateLine(line.id, 'product_id', e.target.value)}
                  placeholder="Search product..." style={{ ...inlineInput, width: 160 }} />
              </td>
              <td style={TD}>
                <input value={line.name || ''} onChange={e => updateLine(line.id, 'name', e.target.value)}
                  placeholder="Description" style={{ ...inlineInput, width: 180 }} />
              </td>
              <td style={TD}>
                <input type="number" data-erp="field-amount" value={line.product_qty || 1} onChange={e => updateLine(line.id, 'product_qty', e.target.value)}
                  style={{ ...inlineInput, width: 70, textAlign: 'right' }} />
              </td>
              <td style={TD}>
                <input type="number" data-erp="field-amount" value={line.price_unit || 0} onChange={e => updateLine(line.id, 'price_unit', e.target.value)}
                  style={{ ...inlineInput, width: 90, textAlign: 'right' }} />
              </td>
              <td style={{ ...TD, textAlign: 'right', color: 'var(--text2)' }}>
                {((Number(line.product_qty) || 0) * (Number(line.price_unit) || 0)).toFixed(2)}
              </td>
              <td style={TD}>
                <button onClick={() => removeLine(line.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <button data-erp="create-button" onClick={addLine} style={{
          background: 'transparent', border: `1px dashed var(--border2)`,
          borderRadius: 5, color: 'var(--teal)', fontSize: 12,
          padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          + Add a line
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          Total: <span style={{ color: 'var(--teal)', marginLeft: 8 }}>{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Confirm button ─────────────────────────────────────────────── */
export function ConfirmButton({ label = 'Confirm', onClick }) {
  return (
    <button data-erp="confirm-button" onClick={onClick}
      style={{
        padding: '6px 18px',
        background: 'var(--success)',
        border: 'none',
        borderRadius: 5,
        color: '#fff',
        fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'opacity var(--t)',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {label}
    </button>
  )
}

/* ── Approve button ─────────────────────────────────────────────── */
export function ApproveButton({ label = 'Approve', onClick }) {
  return (
    <button data-erp="approve-button" onClick={onClick}
      style={{
        padding: '6px 18px',
        background: 'var(--teal)',
        border: 'none', borderRadius: 5,
        color: '#fff', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{label}</button>
  )
}

/* ── Submit button ──────────────────────────────────────────────── */
export function SubmitButton({ label = 'Submit', onClick }) {
  return (
    <button data-erp="submit-button" onClick={onClick}
      style={{
        padding: '6px 18px',
        background: '#17a2b8',
        border: 'none', borderRadius: 5,
        color: '#fff', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{label}</button>
  )
}

/* ── Styles ─────────────────────────────────────────────────────── */
const TH = {
  padding: '8px 12px', textAlign: 'left',
  fontSize: 11, fontWeight: 600, color: 'var(--text3)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
}
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }
const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 5, color: 'var(--text)', fontSize: 13,
  fontFamily: 'inherit', outline: 'none',
  transition: 'border-color var(--t)',
}
const inlineInput = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 12,
  fontFamily: 'inherit', outline: 'none', padding: '3px 4px',
}
