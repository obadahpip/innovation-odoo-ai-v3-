/**
 * TextField.jsx — multiline textarea
 */
export default function TextField({ value='', onChange, readonly, label, rows=4 }) {
  if (readonly) return <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{value||'—'}</div>
  return (
    <textarea
      className="o-input"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={label}
      rows={rows}
      style={{ resize:'vertical', lineHeight:1.6 }}
    />
  )
}
