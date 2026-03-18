/**
 * Many2OneField.jsx
 * Searchable dropdown that links to another model.
 * Accepts: value (id or {id,name}), options ([{id,name}]), onChange
 */
import { useState, useRef, useEffect } from 'react'

export default function Many2OneField({ value, onChange, readonly, options=[], label, placeholder }) {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const inputRef            = useRef(null)

  const displayName = typeof value === 'object' ? (value?.name ?? '') : (options.find(o=>o.id===value)?.name ?? (value || ''))

  const filtered = query
    ? options.filter(o => o.name?.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  if (readonly) {
    return <span style={{ fontSize:13, color: displayName ? 'var(--teal)' : 'var(--text3)' }}>{displayName || '—'}</span>
  }

  return (
    <div style={{ position:'relative' }}>
      <div
        className="o-input"
        style={{ display:'flex', alignItems:'center', cursor:'pointer', gap:4 }}
        onClick={() => setOpen(o=>!o)}
      >
        <input
          ref={inputRef}
          value={open ? query : displayName}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { setOpen(true); setQuery('') }}
          placeholder={placeholder || `Search ${label||''}...`}
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:13, fontFamily:'inherit', cursor:'pointer' }}
        />
        {value && (
          <button onClick={e => { e.stopPropagation(); onChange?.(null); setQuery('') }}
            style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:14, padding:0 }}>×</button>
        )}
        <span style={{ color:'var(--text3)', fontSize:10 }}>▼</span>
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:'var(--z-dropdown)' }} />
          <div style={{
            position:'absolute', top:'105%', left:0, right:0,
            background:'var(--surface)', border:'1px solid var(--border2)',
            borderRadius:6, maxHeight:240, overflowY:'auto',
            boxShadow:'var(--shadow-md)', zIndex:'calc(var(--z-dropdown) + 1)',
          }}>
            {filtered.length === 0 && (
              <div style={{ padding:'10px 12px', color:'var(--text3)', fontSize:12 }}>No results</div>
            )}
            {filtered.map(opt => (
              <div
                key={opt.id}
                onClick={() => { onChange?.(opt); setOpen(false); setQuery('') }}
                style={{
                  padding:'7px 12px', fontSize:13, color:'var(--text)', cursor:'pointer',
                  transition:'background var(--t)',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background=''}
              >
                {opt.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
