import { useState } from 'react'

const COLORS = ['#714b67','#e07a5f','#3d405b','#81b29a','#457b9d','#2a9d8f']
const colorFor = name => COLORS[(name?.charCodeAt(0)||0) % COLORS.length]

export default function Chatter({ modelName, recordId, messages = [], onSend }) {
  const [tab, setTab]   = useState('message')
  const [body, setBody] = useState('')
  const [log,  setLog]  = useState([...messages])

  const handleSend = () => {
    if (!body.trim()) return
    const msg = { id:Date.now(), author:'obadah abuodah', body:body.trim(), date:new Date().toISOString(), type: tab==='note' ? 'note' : 'message' }
    setLog(l => [...l, msg])
    onSend?.(msg)
    setBody('')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>

      {/* Tab buttons */}
      <div style={{ display:'flex', padding:'10px 12px 6px', gap:4, borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        {[['message','Send message'],['note','Log note'],['activity','Activity']].map(([k,label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'4px 12px', border:'none', borderRadius:4, fontSize:12, cursor:'pointer', fontFamily:'inherit',
            background: tab===k ? 'var(--purple)' : 'var(--surface2)',
            color: tab===k ? '#fff' : 'var(--text2)', fontWeight: tab===k ? 600 : 400,
            transition:'all var(--t)',
          }}>{label}</button>
        ))}
      </div>

      {/* Input area */}
      {tab !== 'activity' && (
        <div style={{ padding:'8px 12px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <textarea
            value={body}
            onChange={e=>setBody(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); handleSend() }}}
            placeholder={tab==='note' ? 'Log an internal note...' : 'Send a message to followers...'}
            rows={2}
            style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6, outline:'none', padding:'6px 8px', color:'var(--text)', fontSize:12, fontFamily:'inherit', resize:'none', boxSizing:'border-box' }}
          />
          <button className="btn btn-primary btn-sm" style={{ marginTop:6 }} onClick={handleSend}>Send</button>
        </div>
      )}

      {/* Message log */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>
        {/* Date separator */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
          <span style={{ fontSize:11, color:'var(--text3)', whiteSpace:'nowrap' }}>Today</span>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        {log.map((msg, i) => (
          <div key={msg.id || i} style={{ display:'flex', gap:8, marginBottom:12 }}>
            <div style={{
              width:30, height:30, borderRadius:'50%', flexShrink:0,
              background:colorFor(msg.author), display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700, color:'#fff',
            }}>
              {msg.author?.[0]?.toUpperCase() || 'O'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, color:'var(--text2)', marginBottom:3, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                <strong style={{ color:'var(--text)', fontSize:12 }}>{msg.author}</strong>
                {msg.type === 'message' && <span style={{ fontSize:11 }}>✉</span>}
                <span style={{ color:'var(--text3)' }}>{new Date(msg.date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
              <div style={{
                background: msg.type==='message' ? 'rgba(52,152,219,0.12)' : 'var(--surface)',
                border:'1px solid var(--border)', borderRadius:6, padding:'8px 10px',
                fontSize:12, color:'var(--text)', lineHeight:1.5, whiteSpace:'pre-wrap', wordBreak:'break-word',
              }}>
                {msg.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
