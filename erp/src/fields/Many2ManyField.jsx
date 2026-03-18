/**
 * Many2ManyField.jsx — tag selector
 */
import { useState } from 'react'

export default function Many2ManyField({ value=[], onChange, readonly, options=[], label }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = value.map(v => typeof v==='object' ? v : options.find(o=>o.id===v)||{id:v,name:String(v)})
  const available = options.filter(o => !selected.find(s=>s.id===o.id))
  const filtered = query ? available.filter(o=>o.name?.toLowerCase().includes(query.toLowerCase())) : available

  const remove = (id) => onChange?.(value.filter(v=>(typeof v==='object'?v.id:v)!==id))
  const add = (opt) => { onChange?.([...value, opt]); setQuery('') }

  return (
    <div style={{
      display:'flex', flexWrap:'wrap', gap:4, alignItems:'center',
      minHeight:32, padding:'3px 6px',
      background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:4,
      cursor: readonly ? 'default' : 'text',
    }}
    onClick={() => !readonly && setOpen(true)}
    >
      {selected.map(tag => (
        <span key={tag.id} style={{
          display:'flex', alignItems:'center', gap:3,
          background:'var(--surface3)', color:'var(--text)',
          padding:'1px 8px', borderRadius:3, fontSize:12, fontWeight:500,
        }}>
          {tag.name}
          {!readonly && (
            <button onClick={e=>{e.stopPropagation();remove(tag.id)}}
              style={{background:'none',border:'none',color:'var(--text2)',cursor:'pointer',fontSize:13,padding:0,lineHeight:1}}>×</button>
          )}
        </span>
      ))}
      {!readonly && (
        <div style={{ position:'relative', display:'inline-flex' }}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onFocus={()=>setOpen(true)}
            placeholder={selected.length===0 ? `Add ${label||'tag'}...` : ''}
            style={{ background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit', minWidth:80 }}
          />
          {open && filtered.length > 0 && (
            <>
              <div onClick={e=>{e.stopPropagation();setOpen(false)}} style={{ position:'fixed', inset:0, zIndex:'var(--z-dropdown)' }} />
              <div style={{
                position:'absolute', top:'110%', left:0,
                background:'var(--surface)', border:'1px solid var(--border2)',
                borderRadius:6, minWidth:160, maxHeight:200, overflowY:'auto',
                boxShadow:'var(--shadow-md)', zIndex:'calc(var(--z-dropdown)+1)',
              }}>
                {filtered.map(opt=>(
                  <div key={opt.id} onClick={e=>{e.stopPropagation();add(opt);setOpen(false)}}
                    style={{ padding:'7px 12px', fontSize:13, color:'var(--text)', cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}
                  >{opt.name}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
