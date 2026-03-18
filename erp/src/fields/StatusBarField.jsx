/**
 * StatusBarField.jsx
 * Inline stage selector used inside form views (different from shell/StatusBar.jsx
 * which is the bar above the form — this one is the field-level widget).
 */
export default function StatusBarField({ value, onChange, options=[], readonly }) {
  return (
    <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:4 }}>
      {options.map((opt, i) => {
        const val = opt.value ?? opt
        const lbl = opt.label ?? opt
        const isActive = val === value
        const idx = options.findIndex(o=>(o.value??o)===value)
        const isPast = i < idx

        return (
          <button
            key={val}
            onClick={() => !readonly && onChange?.(val)}
            style={{
              padding:'3px 12px', fontSize:12, borderRadius:20, fontFamily:'inherit',
              background: isActive ? 'var(--purple)' : isPast ? 'var(--surface3)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--purple)' : 'var(--border2)'}`,
              color: isActive ? '#fff' : isPast ? 'var(--text2)' : 'var(--text3)',
              cursor: readonly ? 'default' : 'pointer',
              fontWeight: isActive ? 600 : 400,
              transition: 'all var(--t)',
            }}
          >{lbl}</button>
        )
      })}
    </div>
  )
}
