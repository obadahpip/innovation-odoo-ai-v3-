/**
 * Settings.jsx — Settings module
 * Used by many lessons: L9, L10, L11, L12, L14, L15, L16, L19, L22, L27, L28, etc.
 * Selectors: app-settings, create-button, field-name, field-type, kanban-card,
 *            list-row, new-button, save-button, activate-developer-mode-button, bug-icon
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SettingsSection({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, marginBottom: 16, overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{description}</div>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 38, height: 20, borderRadius: 10,
      background: value ? 'var(--teal)' : 'var(--border2)',
      position: 'relative', cursor: 'pointer', flexShrink: 0,
      transition: 'background var(--t)',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: value ? 20 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left var(--t)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const [devMode,   setDevMode]   = useState(false)
  const [multiCompany, setMultiCompany] = useState(false)
  const [tab, setTab] = useState('General')
  const [saved, setSaved] = useState(false)

  const TABS = ['General', 'Users', 'Companies', 'Technical', 'Integrations']

  const USERS = [
    { id: 1, name: 'Mitchell Admin',   email: 'admin@company.com',   role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Marc Demo',        email: 'marc@company.com',    role: 'User',          status: 'Active' },
    { id: 3, name: 'Abigail Peterson', email: 'abigail@company.com', role: 'User',          status: 'Active' },
    { id: 4, name: 'Brandon Freeman',  email: 'brandon@company.com', role: 'Manager',       status: 'Active' },
  ]

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Left sidebar */}
      <div style={{ width: 210, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Settings</span>
        </div>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              width: '100%', padding: '9px 14px',
              background: tab === t ? 'var(--surface3)' : 'transparent',
              border: 'none',
              borderLeft: tab === t ? '3px solid var(--teal)' : '3px solid transparent',
              textAlign: 'left', fontSize: 13,
              color: tab === t ? 'var(--teal)' : 'var(--text2)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (tab !== t) e.currentTarget.style.background = 'var(--surface2)' }}
            onMouseLeave={e => { if (tab !== t) e.currentTarget.style.background = 'transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', minHeight: 0 }}>
        {/* Save bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <button data-erp="save-button" className="btn btn-primary btn-sm" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm">Discard</button>
        </div>

        {/* ── GENERAL TAB ────────────────────────────────────── */}
        {tab === 'General' && (
          <>
            <SettingsSection title="Company Information">
              <SettingRow label="Company Name">
                <input data-erp="field-name" defaultValue="YourCompany" style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 220 }} />
              </SettingRow>
              <SettingRow label="Default Language">
                <select data-erp="field-type" style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option>English</option><option>Arabic</option><option>French</option>
                </select>
              </SettingRow>
              <SettingRow label="Multi-Company" description="Enable management of multiple companies">
                <Toggle value={multiCompany} onChange={setMultiCompany} />
              </SettingRow>
            </SettingsSection>

            <SettingsSection title="Developer Tools">
              <SettingRow label="Developer Mode" description="Activate technical features and debug tools">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    data-erp="activate-developer-mode-button"
                    onClick={() => setDevMode(!devMode)}
                    style={{
                      padding: '5px 14px',
                      background: devMode ? 'var(--teal)' : 'transparent',
                      border: `1px solid ${devMode ? 'var(--teal)' : 'var(--border)'}`,
                      borderRadius: 5, color: devMode ? '#fff' : 'var(--text2)',
                      fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    {devMode ? '✓ Active' : 'Activate'}
                  </button>
                  {devMode && (
                    <span data-erp="bug-icon" title="Debug mode active" style={{ fontSize: 18, cursor: 'pointer' }}>🐛</span>
                  )}
                </div>
              </SettingRow>
            </SettingsSection>
          </>
        )}

        {/* ── USERS TAB ──────────────────────────────────────── */}
        {tab === 'Users' && (
          <SettingsSection title="Users">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button data-erp="new-button" className="btn btn-primary btn-sm">+ New User</button>
            </div>

            {/* Kanban card grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
              {USERS.map(u => (
                <div key={u.id} data-erp="kanban-card"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px', cursor: 'pointer', transition: 'all var(--t)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                    {u.name[0]}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{u.email}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--teal)22', border: '1px solid var(--teal)44', color: 'var(--teal)', fontWeight: 600 }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Also list view */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)' }}>
                {['Name', 'Email', 'Role', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.id} data-erp="list-row"
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--teal)' }}>{u.name}</td>
                    <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{u.email}</td>
                    <td style={{ padding: '9px 12px' }}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#17a2b822', border: '1px solid #17a2b844', color: '#17a2b8' }}>{u.role}</span></td>
                    <td style={{ padding: '9px 12px' }}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--success)22', border: '1px solid var(--success)44', color: 'var(--success)' }}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SettingsSection>
        )}

        {/* ── TECHNICAL TAB ──────────────────────────────────── */}
        {tab === 'Technical' && (
          <>
            <SettingsSection title="Property Fields">
              <div style={{ marginBottom: 10 }}>
                <button data-erp="create-button" className="btn btn-secondary btn-sm">+ Add Property</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 10 }}>
                {['Text Property', 'Number Property', 'Date Property', 'Selection Property'].map((p, i) => (
                  <div key={i} data-erp="kanban-card"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p}</div>
                    <input data-erp="field-name" placeholder="Field name" style={{ marginTop: 8, width: '100%', padding: '5px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    <select data-erp="field-type" style={{ marginTop: 6, width: '100%', padding: '5px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>
                      <option>Text</option><option>Number</option><option>Date</option><option>Boolean</option>
                    </select>
                  </div>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection title="Automated Actions">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/studio/actions/new')}>+ New</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ background: 'var(--surface)' }}>
                  {['Action Name', 'Model', 'Trigger'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    { name: 'Send confirmation email', model: 'sale.order',  trigger: 'on_write' },
                    { name: 'Assign to salesperson',   model: 'crm.lead',   trigger: 'on_create' },
                  ].map((row, i) => (
                    <tr key={i} data-erp="list-row"
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--teal)' }}>{row.name}</td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)', fontFamily: 'monospace', fontSize: 12 }}>{row.model}</td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{row.trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SettingsSection>
          </>
        )}

        {/* ── COMPANIES TAB ──────────────────────────────────── */}
        {tab === 'Companies' && (
          <SettingsSection title="Companies">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button data-erp="new-button" className="btn btn-primary btn-sm">+ New Company</button>
            </div>
            {['YourCompany', 'Branch Office A', 'International Ltd'].map((c, i) => (
              <div key={i} data-erp="list-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {c[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>company-{i + 1}@example.com</div>
                </div>
                <input data-erp="field-name" placeholder="Company name" defaultValue={c}
                  style={{ marginLeft: 'auto', padding: '5px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none' }}
                  onClick={e => e.stopPropagation()} />
              </div>
            ))}
          </SettingsSection>
        )}

        {/* ── INTEGRATIONS TAB ───────────────────────────────── */}
        {tab === 'Integrations' && (
          <SettingsSection title="External Integrations">
            {['Google Calendar', 'Stripe Payments', 'Mailchimp', 'Slack', 'WhatsApp Business'].map((intg, i) => (
              <div key={i} data-erp="list-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ fontSize: 20 }}>🔌</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{intg}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Not configured</div>
                </div>
                <button data-erp="save-button" style={{ padding: '4px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Configure
                </button>
              </div>
            ))}
          </SettingsSection>
        )}
      </div>
    </div>
  )
}
