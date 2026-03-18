/**
 * SelectionField.jsx
 */
export default function SelectionField({ value='', onChange, readonly, options=[], label }) {
  if (readonly) {
    const opt = options.find(o => (o.value ?? o) === value)
    return <span style={{ fontSize:13, color:'var(--text)' }}>{opt?.label ?? opt ?? value ?? '—'}</span>
  }
  return (
    <select
      className="o-input"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      style={{ cursor:'pointer' }}
    >
      <option value="">{label ? `Select ${label}` : 'Select...'}</option>
      {options.map(opt => {
        const val = opt.value ?? opt
        const lbl = opt.label ?? opt
        return <option key={val} value={val}>{lbl}</option>
      })}
    </select>
  )
}
