export default function BooleanField({ value=false, onChange, readonly, label }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:8, cursor: readonly?'default':'pointer' }}>
      <div
        onClick={() => !readonly && onChange?.(!value)}
        style={{
          width:36, height:20, borderRadius:10, position:'relative',
          background: value ? 'var(--teal)' : 'var(--surface3)',
          transition: 'background 0.2s', flexShrink:0, cursor: readonly?'default':'pointer',
        }}
      >
        <div style={{
          position:'absolute', top:2, left: value ? 18 : 2,
          width:16, height:16, borderRadius:'50%', background:'#fff',
          transition: 'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
      {label && <span style={{ fontSize:13, color:'var(--text)' }}>{label}</span>}
    </label>
  )
}
