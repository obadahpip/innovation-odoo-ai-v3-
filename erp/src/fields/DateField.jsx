export default function DateField({ value='', onChange, readonly }) {
  return (
    <input type="date" className="o-input" value={value?.slice(0,10)||''}
      onChange={e => onChange?.(e.target.value)} readOnly={readonly}
      style={{ colorScheme: 'dark' }} />
  )
}
