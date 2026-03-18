import { useState } from 'react'

// ── View icons ────────────────────────────────────────────────────
const VIEW_ICONS = {
  list:       '☰',
  'list-detailed': '⊟',
  kanban:     '⊞',
  calendar:   '📅',
  pivot:      '⊕',
  graph:      '📊',
  activity:   '⏱',
  map:        '📍',
  hierarchy:  '🌳',
  'hierarchy-detailed': '🌳',
}

export default function ActionBar({
  // New button
  showNew, onNew,
  showGenerate,
  // Title / breadcrumb
  title, showGear, onGear,
  // Search
  searchValue = '', onSearchChange,
  activeFilters = [],
  // Pagination
  currentPage, totalCount, pageSize,
  onPrev, onNext,
  // Views
  views = [], activeView, onViewChange,
}) {
  const [searchFocus, setSearchFocus] = useState(false)

  const start = totalCount > 0 ? ((currentPage||1)-1) * (pageSize||80) + 1 : 0
  const end   = Math.min((currentPage||1) * (pageSize||80), totalCount||0)

  return (
    <div style={{
      height:'var(--actionbar-h)', background:'var(--bg)',
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', padding:'0 12px', gap:6,
      flexShrink:0, position:'sticky', top:0, zIndex:'var(--z-actionbar)',
    }}>
      {/* New button */}
      {showNew && (
        <button className="btn btn-primary btn-sm" onClick={onNew} style={{ flexShrink:0 }}>
          New
        </button>
      )}

      {/* Title */}
      {title && (
        <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{title}</span>
          {showGear && <button onClick={onGear} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:13, padding:'0 2px' }}>⚙</button>}
        </div>
      )}

      {/* Search */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', gap:6, maxWidth:560,
        background:'var(--surface)', border:`1px solid ${searchFocus ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius:20, padding:'4px 12px', transition:'border-color var(--t)',
      }}>
        <span style={{ color:'var(--text3)', fontSize:13 }}>🔍</span>

        {/* Active filter tags */}
        {activeFilters.map((f, i) => (
          <span key={i} style={{
            display:'inline-flex', alignItems:'center', gap:4, background:'var(--purple)',
            color:'#fff', padding:'1px 8px', borderRadius:20, fontSize:12, fontWeight:500, flexShrink:0,
          }}>
            {typeof f === 'string' ? f : f.label}
            {f.onRemove && <span onClick={f.onRemove} style={{ cursor:'pointer', opacity:0.7 }}>×</span>}
          </span>
        ))}

        <input
          value={searchValue}
          onChange={e => onSearchChange?.(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="Search..."
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:13, fontFamily:'inherit', minWidth:80 }}
        />
        <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:13, flexShrink:0, padding:0 }}>▼</button>
      </div>

      {/* Spacer */}
      <div style={{ flex:1 }} />

      {/* Pagination */}
      {totalCount != null && (
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <span style={{ fontSize:12, color:'var(--text2)', whiteSpace:'nowrap' }}>
            {totalCount === 0 ? '0 / 0' : `${start}-${end} / ${totalCount}`}
          </span>
          <button onClick={onPrev} disabled={!onPrev || (currentPage||1) <= 1}
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:16, padding:'0 2px', lineHeight:1, opacity:!onPrev||(currentPage||1)<=1?0.3:1 }}>‹</button>
          <button onClick={onNext} disabled={!onNext || end >= (totalCount||0)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:16, padding:'0 2px', lineHeight:1, opacity:!onNext||end>=(totalCount||0)?0.3:1 }}>›</button>
        </div>
      )}

      {/* View switcher */}
      {views.length > 0 && (
        <div style={{ display:'flex', gap:1, flexShrink:0, background:'var(--surface)', borderRadius:4, border:'1px solid var(--border)', overflow:'hidden' }}>
          {views.map(v => (
            <button key={v} onClick={() => onViewChange?.(v)} title={v.charAt(0).toUpperCase()+v.slice(1)}
              style={{
                width:30, height:28, background: v === activeView ? 'var(--surface3)' : 'none',
                border:'none', cursor:'pointer', color: v === activeView ? 'var(--teal)' : 'var(--text3)',
                fontSize:14, display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all var(--t)',
              }}
              onMouseEnter={e=>{ if(v!==activeView) e.currentTarget.style.color='var(--text)' }}
              onMouseLeave={e=>{ if(v!==activeView) e.currentTarget.style.color='var(--text3)' }}>
              {VIEW_ICONS[v] || v[0].toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
