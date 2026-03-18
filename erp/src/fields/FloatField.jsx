export default function FloatField({ value='', onChange, readonly, label, decimals=2 }) {
  return (
    <input type="number" step="any" className="o-input" value={value}
      onChange={e => onChange?.(parseFloat(e.target.value)||0)} readOnly={readonly} placeholder={label} />
  )
}
