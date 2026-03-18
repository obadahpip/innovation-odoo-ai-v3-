/**
 * websiteHelpers.jsx
 * Shared UI primitives for all website sub-module pages.
 * Provides: GenericList, GenericForm, PageHeader, StatusBadge
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Page header with New button ──────────────────────────────── */
export function PageHeader({ title, onNew, newLabel = 'New', extra }) {
  return (
    <div style={{
      padding: '10px 20px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
    }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{title}</span>
      {extra}
      {onNew && (
        <button
          data-erp="new-button"
          className="btn btn-primary btn-sm"
          onClick={onNew}
        >+ New</button>
      )}
    </div>
  )
}

/* ── Generic list table ───────────────────────────────────────── */
export function GenericList({ columns, rows, onRowClick, emptyMsg = 'No records yet. Click New to create one.' }) {
  const [sel, setSel] = useState(new Set())

  const toggleAll = () => setSel(sel.size === rows.length ? new Set() : new Set(rows.map(r => r.id)))
  const toggle    = id  => { const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); setSel(s) }

  return (
    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
            <th style={TH}><input type="checkbox" onChange={toggleAll} checked={sel.size === rows.length && rows.length > 0} /></th>
            {columns.map(c => (
              <th key={c.key} style={{ ...TH, width: c.width }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + 1} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
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

/* ── Generic form ─────────────────────────────────────────────── */
export function GenericForm({ title, fields, values, onChange, onSave, onDiscard, extra, tabs, activeTab, onTabChange }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
      {/* Form action bar */}
      <div style={{
        padding: '8px 20px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <button data-erp="save-button" className="btn btn-primary btn-sm" onClick={onSave}>Save</button>
        <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={onDiscard}>Discard</button>
        <span style={{ flex: 1 }} />
        {extra}
      </div>

      {/* Tabs */}
      {tabs && (
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '0 20px',
          flexShrink: 0,
        }}>
          {tabs.map(tab => (
            <button key={tab}
              onClick={() => onTabChange?.(tab)}
              style={{
                padding: '9px 16px',
                background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--teal)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--teal)' : 'var(--text2)',
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all var(--t)',
              }}
            >{tab}</button>
          ))}
        </div>
      )}

      {/* Fields */}
      <div style={{ padding: '20px 24px', maxWidth: 900 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px 24px',
        }}>
          {fields.map(field => {
            if (field.hidden) return null
            const isFullWidth = field.fullWidth || field.type === 'textarea' || field.type === 'html'
            return (
              <div key={field.key} style={{ gridColumn: isFullWidth ? '1 / -1' : 'span 1' }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'var(--text3)', marginBottom: 5,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {field.label}
                  {field.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    data-erp={field.dataErp || `field-${field.key}`}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    rows={4}
                    placeholder={field.placeholder || ''}
                    style={{
                      width: '100%', padding: '8px 12px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 5, color: 'var(--text)', fontSize: 13,
                      fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ) : field.type === 'select' ? (
                  <select
                    data-erp={field.dataErp || `field-${field.key}`}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 5, color: 'var(--text)', fontSize: 13,
                      fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">— Select —</option>
                    {(field.options || []).map(opt => (
                      <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'toggle' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
                    <div
                      data-erp={field.dataErp || `field-${field.key}`}
                      onClick={() => onChange(field.key, !values[field.key])}
                      style={{
                        width: 40, height: 22, borderRadius: 11,
                        background: values[field.key] ? 'var(--teal)' : 'var(--border2)',
                        position: 'relative', cursor: 'pointer',
                        transition: 'background var(--t)',
                        flexShrink: 0,
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
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    data-erp={field.dataErp || 'field-amount'}
                    value={values[field.key] || ''}
                    onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || '0'}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ) : (
                  <input
                    type="text"
                    data-erp={field.dataErp || (field.key === 'name' ? 'field-name' : `field-${field.key}`)}
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
      </div>
    </div>
  )
}

/* ── Status badge ─────────────────────────────────────────────── */
export function StatusBadge({ label, color = 'var(--teal)' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: color + '22',
      border: `1px solid ${color}44`,
      color,
    }}>{label}</span>
  )
}

/* ── Publish toggle button ───────────────────────────────────── */
export function PublishToggle({ published, onToggle }) {
  return (
    <button
      data-erp="publish-toggle"
      onClick={onToggle}
      style={{
        padding: '4px 14px',
        borderRadius: 20,
        border: `1px solid ${published ? 'var(--success)' : 'var(--border2)'}`,
        background: published ? 'rgba(40,167,69,0.12)' : 'transparent',
        color: published ? 'var(--success)' : 'var(--text2)',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {published ? '● Published' : '○ Unpublished'}
    </button>
  )
}

/* ── Styles ───────────────────────────────────────────────────── */
const TH = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: 11, fontWeight: 600,
  color: 'var(--text3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
}
const TD = {
  padding: '9px 12px',
  color: 'var(--text)',
  verticalAlign: 'middle',
}
const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 5, color: 'var(--text)',
  fontSize: 13, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color var(--t)',
}
