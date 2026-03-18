export default function IntegerField({ value='', onChange, readonly, label }) {
  return (
    <input type="number" step="1" className="o-input" value={value}
      onChange={e => onChange?.(parseInt(e.target.value,10)||0)} readOnly={readonly} placeholder={label} />
  )
}
