/**
 * hrHelpers.jsx
 * Shared sidebar shell + primitives for HR modules:
 * Expenses, Payroll, Time Off, Recruitment
 */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ── HR Sidebar Shell ───────────────────────────────────────────── */
export function HRShell({ children, sidebarSections }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        width: 210, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
      }}>
        {sidebarSections.map(section => (
          <div key={section.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  style={{
                    width: '100%', padding: '7px 14px',
                    background: active ? 'var(--surface3)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                    textAlign: 'left', fontSize: 13,
                    color: active ? 'var(--teal)' : 'var(--text2)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all var(--t)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Page header ────────────────────────────────────────────────── */
export function PageHeader({ title, onNew, newLabel = 'New', extra }) {
  return (
    <div style={{
      padding: '10px 20px', background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{title}</span>
      {extra}
      {onNew && (
        <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={onNew}>
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
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: color + '22', border: `1px solid ${color}44`, color,
    }}>{label}</span>
  )
}

/* ── Status pipeline bar ────────────────────────────────────────── */
export function StatusBarField({ stages, current, onChange }) {
  return (
    <div data-erp="status-bar" style={{
      display: 'flex', alignItems: 'center', gap: 2,
      padding: '8px 20px', background: 'var(--surface)',
      borderBottom: '1px solid var(--border)', flexShrink: 0, overflowX: 'auto',
    }}>
      {stages.map((stage, i) => {
        const isActive = stage === current
        const isPast   = stages.indexOf(current) > i
        return (
          <button key={stage} onClick={() => onChange?.(stage)} style={{
            padding: '4px 14px', borderRadius: 20,
            border: `1px solid ${isActive ? 'var(--teal)' : isPast ? 'var(--border2)' : 'transparent'}`,
            background: isActive ? 'var(--teal)' : 'transparent',
            color: isActive ? '#fff' : isPast ? 'var(--text2)' : 'var(--text3)',
            fontSize: 12, fontWeight: isActive ? 600 : 400,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            transition: 'all var(--t)',
          }}>{stage}</button>
        )
      })}
    </div>
  )
}

/* ── Generic list ───────────────────────────────────────────────── */
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
      <div style={{
        padding: '8px 20px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={onSave}>Save</button>
        <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={onDiscard}>Discard</button>
        <span style={{ flex: 1 }} />
        {extra}
      </div>
      {tabs && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px', flexShrink: 0 }}>
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
      <div style={{ padding: '20px 24px', maxWidth: 960, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {(fields || []).map(field => {
            if (field.hidden) return null
            const full = field.fullWidth || field.type === 'textarea'
            return (
              <div key={field.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {field.label}{field.required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={4} data-erp={field.dataErp || `field-${field.key}`}
                    value={values[field.key] || ''} onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || ''} style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                ) : field.type === 'select' ? (
                  <select data-erp={field.dataErp || 'field-type'}
                    value={values[field.key] || ''} onChange={e => onChange(field.key, e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">— Select —</option>
                    {(field.options || []).map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                  </select>
                ) : field.type === 'date' ? (
                  <input type="date" data-erp={field.dataErp || 'field-date'}
                    value={values[field.key] || ''} onChange={e => onChange(field.key, e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                ) : field.type === 'number' ? (
                  <input type="number" data-erp={field.dataErp || 'field-amount'}
                    value={values[field.key] || ''} onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || '0'} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                ) : (
                  <input type="text"
                    data-erp={field.dataErp || (field.key === 'name' ? 'field-name' : field.key === 'project_id' ? 'field-project' : `field-${field.key}`)}
                    value={values[field.key] || ''} onChange={e => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || ''} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
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

/* ── Action buttons ─────────────────────────────────────────────── */
export function ConfirmButton({ label = 'Confirm', onClick }) {
  return <button data-erp="confirm-button" className="btn btn-primary btn-sm" onClick={onClick}
    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>{label}</button>
}
export function SubmitButton({ label = 'Submit', onClick }) {
  return <button data-erp="submit-button" className="btn btn-primary btn-sm" onClick={onClick}
    style={{ background: '#17a2b8', borderColor: '#17a2b8' }}>{label}</button>
}
export function RefuseButton({ label = 'Refuse', onClick }) {
  return <button data-erp="refuse-button" className="btn btn-sm"
    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={onClick}>{label}</button>
}

/* ── Styles ─────────────────────────────────────────────────────── */
const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }
const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }
