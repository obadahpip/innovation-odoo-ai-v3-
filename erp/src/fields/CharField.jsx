export default function CharField({ value='', onChange, readonly, placeholder, label, required }) {
  return (
    <input
      className="o-input"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder || label}
      readOnly={readonly}
      required={required}
    />
  )
}
