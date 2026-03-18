export default function DateTimeField({ value='', onChange, readonly }) {
  return (
    <input type="datetime-local" className="o-input" value={value?.slice(0,16)||''}
      onChange={e => onChange?.(e.target.value+'Z')} readOnly={readonly}
      style={{ colorScheme: 'dark' }} />
  )
}
