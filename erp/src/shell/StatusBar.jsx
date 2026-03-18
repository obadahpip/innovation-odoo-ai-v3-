// StatusBar.jsx - used in form views with stage pipeline pills
export default function StatusBar({ stages = [], currentStage, onStageChange }) {
  return (
    <div style={{ display:'flex', gap:0 }}>
      {stages.map((s, i) => {
        const isActive  = s.id === currentStage
        const isPast    = stages.findIndex(x=>x.id===currentStage) > i
        return (
          <button key={s.id} onClick={() => onStageChange?.(s.id)} style={{
            padding:'4px 18px 4px 24px', border:`1px solid ${isActive ? 'var(--teal)' : 'var(--border2)'}`,
            borderRadius: i===0?'20px 0 0 20px':i===stages.length-1?'0 20px 20px 0':0,
            background: isActive ? 'var(--surface3)' : isPast ? 'var(--surface2)' : 'transparent',
            color: isActive ? 'var(--teal)' : isPast ? 'var(--text2)' : 'var(--text3)',
            fontSize:12, fontWeight: isActive?600:400, cursor:'pointer', fontFamily:'inherit',
            marginLeft: i>0 ? -1 : 0, position:'relative', transition:'all var(--t)',
          }}>{s.name}</button>
        )
      })}
    </div>
  )
}
