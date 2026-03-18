/**
 * MonetaryField.jsx — currency input with symbol
 */
export default function MonetaryField({ value=0, onChange, readonly, currency='$', label }) {
  if (readonly) {
    return <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{currency}{Number(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
  }
  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
      <span style={{ position:'absolute', left:8, color:'var(--text2)', fontSize:13, pointerEvents:'none' }}>{currency}</span>
      <input
        type="number" step="0.01" min="0"
        className="o-input"
        value={value}
        onChange={e => onChange?.(parseFloat(e.target.value)||0)}
        placeholder="0.00"
        style={{ paddingLeft:22, textAlign:'right' }}
      />
    </div>
  )
}
