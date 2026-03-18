// ListView.jsx - generic list view wrapper
export default function ListView({ columns=[], records=[], onRowClick, loading }) {
  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} /></th>
            {columns.map(c => (
              <th key={c.key} style={{ padding:'8px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', textAlign:c.align||'left', borderBottom:'1px solid var(--border)' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r,i) => (
            <tr key={r.id||i} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
              onClick={() => onRowClick?.(r)}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
              onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{ padding:'0 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} /></td>
              {columns.map(c => (
                <td key={c.key} style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', textAlign:c.align||'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {c.render ? c.render(r[c.key], r) : (r[c.key]??'—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ padding:20, textAlign:'center', color:'var(--text3)' }}>Loading...</div>}
    </div>
  )
}
