/**
 * Settings.jsx — General Settings
 * Odoo 19.0 model: res.config.settings
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 16px', gap:12, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <span style={{ fontSize:18 }}>⚙️</span>
        <span style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>Settings</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save'}
        </button>
        <button className="btn btn-secondary btn-sm">Discard</button>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Sidebar nav */}
        <div style={{ width:200, borderRight:'1px solid var(--border)', padding:'12px 0', flexShrink:0, background:'var(--bg)' }}>
          {['General Settings','Users & Companies','Technical','Discuss','Sales','Accounting','Employees','Inventory'].map((item, i) => (
            <button key={item} style={{
              width:'100%', padding:'8px 16px', background:i===0?'var(--surface3)':'none',
              border:'none', borderLeft:i===0?'3px solid var(--teal)':'3px solid transparent',
              color:i===0?'var(--teal)':'var(--text2)', fontSize:13, textAlign:'left',
              cursor:'pointer', fontFamily:'inherit', fontWeight:i===0?600:400,
            }}>{item}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
          <SettingGroup title="Company">
            <SettingRow label="Company Name" hint="The name of your company as it appears on documents">
              <input className="o-input" defaultValue="mta" style={{ maxWidth:280 }} />
            </SettingRow>
            <SettingRow label="Default Currency" hint="Currency used for all financial operations">
              <select className="o-input" style={{ maxWidth:180 }}>
                <option>JOD – Jordanian Dinar</option>
                <option>USD – US Dollar</option>
                <option>EUR – Euro</option>
              </select>
            </SettingRow>
            <SettingRow label="Default Language">
              <select className="o-input" style={{ maxWidth:180 }}>
                <option>English (US)</option>
                <option>Arabic</option>
              </select>
            </SettingRow>
          </SettingGroup>

          <SettingGroup title="Users">
            <SettingRow label="Default User Rights">
              <select className="o-input" style={{ maxWidth:240 }}>
                <option>Internal User</option>
                <option>Portal</option>
                <option>Public</option>
              </select>
            </SettingRow>
            <SettingRow label="2-Factor Authentication" hint="Require two-factor authentication for all users">
              <Toggle defaultChecked={false} />
            </SettingRow>
          </SettingGroup>

          <SettingGroup title="Discuss">
            <SettingRow label="External Email Servers" hint="Use custom SMTP servers">
              <Toggle defaultChecked={false} />
            </SettingRow>
            <SettingRow label="Alias Domain" hint="Use a custom email domain for replies">
              <input className="o-input" placeholder="e.g. company.com" style={{ maxWidth:240 }} />
            </SettingRow>
          </SettingGroup>

          <SettingGroup title="Integrations">
            <SettingRow label="Google Calendar">
              <button className="btn btn-secondary btn-sm">Connect</button>
            </SettingRow>
            <SettingRow label="WhatsApp Business">
              <button className="btn btn-secondary btn-sm">Connect</button>
            </SettingRow>
          </SettingGroup>
        </div>
      </div>
    </div>
  )
}

function SettingGroup({ title, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:16, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>
        {title}
      </h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, hint, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ flex:1, maxWidth:320 }}>
        <div style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{label}</div>
        {hint && <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{hint}</div>}
      </div>
      <div style={{ flex:1 }}>{children}</div>
    </div>
  )
}

function Toggle({ defaultChecked }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div onClick={() => setOn(!on)} style={{ width:40, height:22, borderRadius:11, background:on?'var(--teal)':'var(--border2)', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:on?20:2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }}/>
    </div>
  )
}
