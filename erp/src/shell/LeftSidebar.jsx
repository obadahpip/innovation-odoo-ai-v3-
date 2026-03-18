import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function LeftSidebar({ sections = [], onItemClick, extraContent }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState({})

  const toggle = key => setCollapsed(c => ({ ...c, [key]:!c[key] }))

  const isActive = (item) => {
    if (!item.path) return false
    return location.pathname.startsWith(item.path.split('?')[0])
  }

  return (
    <aside style={{
      width:'var(--sidebar-w)', flexShrink:0, background:'var(--bg)',
      borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column',
      overflow:'hidden',
    }}>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {extraContent}
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 14px 2px' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  {section.label}
                </span>
                {section.collapsible && (
                  <button onClick={() => toggle(section.label)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:12, padding:0 }}>
                    {collapsed[section.label] ? '▶' : '▼'}
                  </button>
                )}
              </div>
            )}
            {!collapsed[section.label] && section.items?.map(item => {
              const active = isActive(item)
              return (
                <button
                  key={item.id || item.label}
                  onClick={() => onItemClick?.(item)}
                  style={{
                    width:'100%', padding:'7px 14px', background:'none', border:'none',
                    borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                    color: active ? 'var(--teal)' : 'var(--text2)',
                    fontSize:13, fontWeight: active ? 600 : 400,
                    textAlign:'left', cursor:'pointer', fontFamily:'inherit',
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    transition:'all var(--t)',
                  }}
                  onMouseEnter={e=>{ if(!active){ e.currentTarget.style.color='var(--text)'; e.currentTarget.style.background='var(--surface2)' }}}
                  onMouseLeave={e=>{ if(!active){ e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.background='none' }}}>
                  <span>{item.label}</span>
                  {item.count != null && item.count > 0 && (
                    <span style={{ background:'var(--purple)', color:'#fff', fontSize:10, fontWeight:700, borderRadius:10, padding:'1px 6px', minWidth:16, textAlign:'center' }}>{item.count}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
