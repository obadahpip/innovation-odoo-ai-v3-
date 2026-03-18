// SettingsPage.jsx
export default function SettingsPage() {
  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
      {/* Left nav */}
      <div style={{ width:200, borderRight:'1px solid var(--border)', padding:'16px 0', overflowY:'auto', background:'var(--bg)' }}>
        {['General Settings','Users & Companies','Technical'].map(item => (
          <button key={item} style={{ width:'100%', padding:'8px 14px', background:'none', border:'none', color:'var(--text2)', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'inherit' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>
            {item}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
        <h2 style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:24 }}>General Settings</h2>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px', marginBottom:16 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:12 }}>Company</h3>
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:10, alignItems:'center', marginBottom:10 }}>
            <label style={{ fontSize:12, color:'var(--text2)' }}>Company Name</label>
            <input className="o-input" defaultValue="mta" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:10, alignItems:'center' }}>
            <label style={{ fontSize:12, color:'var(--text2)' }}>Country</label>
            <input className="o-input" defaultValue="Jordan" />
          </div>
        </div>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px' }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:12 }}>Currency</h3>
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:10, alignItems:'center' }}>
            <label style={{ fontSize:12, color:'var(--text2)' }}>Default Currency</label>
            <select className="o-input"><option>JOD – Jordanian Dinar</option><option>USD – US Dollar</option><option>EUR – Euro</option></select>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:20 }}>
          <button className="btn btn-primary">Save</button>
          <button className="btn btn-secondary">Discard</button>
        </div>
      </div>
    </div>
  )
}
