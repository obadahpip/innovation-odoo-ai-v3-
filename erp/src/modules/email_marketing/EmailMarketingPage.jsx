/**
 * EmailMarketingPage.jsx — Email Marketing module
 * Covers screens: email_marketing
 * L36 Live Chat: create-button, field-description, field-name, new-button, save-button
 * L58 Email Marketing: calendar, kanban-card, list-row
 * L59 SMS Marketing: calendar, create-button, field-description, field-name, kanban-card, list-row, save-button, send-button, status-bar
 * L62 Marketing Automation: confirm-button, field-name, field-type, new-button, save-button, status-bar
 * L73 Sign: create-button, field-name, list-row, save-button, send-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

/* ── Shared helpers ─────────────────────────────────────────────── */
const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }
const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

function StatusBar({ stages, current, onChange }) {
  return (
    <div data-erp="status-bar" style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, overflowX: 'auto' }}>
      {stages.map((s, i) => {
        const active = s === current
        const past   = stages.indexOf(current) > i
        return (
          <button key={s} onClick={() => onChange?.(s)} style={{
            padding: '4px 14px', borderRadius: 20,
            border: `1px solid ${active ? 'var(--teal)' : past ? 'var(--border2)' : 'transparent'}`,
            background: active ? 'var(--teal)' : 'transparent',
            color: active ? '#fff' : past ? 'var(--text2)' : 'var(--text3)',
            fontSize: 12, fontWeight: active ? 600 : 400,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{s}</button>
        )
      })}
    </div>
  )
}

/* ── Marketing sidebar shell ────────────────────────────────────── */
const MKTG_SIDEBAR = [
  { label: 'EMAIL MARKETING', items: [
    { label: 'Email Marketing',     path: '/erp/email-marketing',        icon: '📧' },
    { label: 'Mailing Lists',       path: '/erp/email-marketing/lists',  icon: '📋' },
    { label: 'Mailing Contacts',    path: '/erp/email-marketing/contacts',icon: '👥' },
  ]},
  { label: 'SMS', items: [
    { label: 'SMS Marketing',       path: '/erp/sms',                    icon: '📱' },
  ]},
  { label: 'MARKETING AUTOMATION', items: [
    { label: 'Automation',          path: '/erp/marketing-automation',   icon: '🤖' },
  ]},
  { label: 'SIGN', items: [
    { label: 'Sign Templates',      path: '/erp/sign',                   icon: '✍' },
  ]},
  { label: 'CONFIGURATION', items: [
    { label: 'Settings',            path: '/erp/email-marketing/config', icon: '⚙' },
  ]},
]

function MktgShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 210, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        {MKTG_SIDEBAR.map(section => (
          <div key={section.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{section.label}</div>
            {section.items.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <button key={item.path} onClick={() => navigate(item.path)} style={{
                  width: '100%', padding: '7px 14px', background: active ? 'var(--surface3)' : 'transparent', border: 'none',
                  borderLeft: active ? '3px solid var(--teal)' : '3px solid transparent',
                  textAlign: 'left', fontSize: 13, color: active ? 'var(--teal)' : 'var(--text2)',
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'all var(--t)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

/* ── Seed ───────────────────────────────────────────────────────── */
async function seedMktg() {
  const existing = await listRecords('mailing.mailing')
  if (existing.length > 0) return
  for (const m of [
    { name: 'Q1 Newsletter',          mailing_type: 'mail', state: 'done',   sent: 1240, opened: 380, clicked: 120, scheduled_date: '2025-01-15' },
    { name: 'Product Launch Promo',   mailing_type: 'mail', state: 'sent',   sent: 890,  opened: 210, clicked: 74,  scheduled_date: '2025-02-20' },
    { name: 'Spring Sale Campaign',   mailing_type: 'mail', state: 'draft',  sent: 0,    opened: 0,   clicked: 0,   scheduled_date: '2025-04-01' },
    { name: 'SMS — Flash Sale',       mailing_type: 'sms',  state: 'done',   sent: 450,  opened: 320, clicked: 88,  scheduled_date: '2025-03-05' },
    { name: 'SMS — Event Reminder',   mailing_type: 'sms',  state: 'draft',  sent: 0,    opened: 0,   clicked: 0,   scheduled_date: '2025-04-10' },
  ]) await createRecord('mailing.mailing', m)
}

async function seedAutomation() {
  const existing = await listRecords('marketing.automation')
  if (existing.length > 0) return
  for (const a of [
    { name: 'Lead Nurture Sequence',  model_name: 'crm.lead',    state: 'running', activities_count: 4 },
    { name: 'Customer Onboarding',    model_name: 'res.partner', state: 'stopped', activities_count: 3 },
    { name: 'Win-Back Campaign',      model_name: 'crm.lead',    state: 'draft',   activities_count: 2 },
  ]) await createRecord('marketing.automation', a)
}

async function seedSign() {
  const existing = await listRecords('sign.template')
  if (existing.length > 0) return
  for (const s of [
    { name: 'NDA Agreement',       nb_fields: 5, state: 'shared',  sign_count: 12 },
    { name: 'Sales Contract',      nb_fields: 8, state: 'shared',  sign_count: 7  },
    { name: 'Employment Contract', nb_fields: 12,state: 'closed',  sign_count: 3  },
    { name: 'Service Agreement',   nb_fields: 6, state: 'shared',  sign_count: 0  },
  ]) await createRecord('sign.template', s)
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL MARKETING — Kanban + List (L58)
═══════════════════════════════════════════════════════════════ */
export function EmailMarketingPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('kanban')
  const { records, reload } = useRecordList('mailing.mailing', { sortKey: 'scheduled_date' })
  useEffect(() => { seedMktg().then(reload) }, [])

  const emailRecords = records.filter(r => r.mailing_type === 'mail')
  const STATE_COLOR  = { draft: 'var(--text3)', in_queue: 'var(--warning)', sending: 'var(--teal)', sent: 'var(--teal)', done: 'var(--success)', test: '#17a2b8' }
  const stages = ['Draft', 'In Queue', 'Sending', 'Done']
  const stageMap = { draft: 'Draft', in_queue: 'In Queue', sending: 'Sending', sent: 'Done', done: 'Done' }

  return (
    <MktgShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Email Marketing</span>
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 4, border: '1px solid var(--border)' }}>
            {[['kanban','⊞'],['list','☰']].map(([v,icon]) => (
              <button key={v} onClick={() => setView(v)} style={{
                width: 30, height: 28, background: view === v ? 'var(--surface3)' : 'none', border: 'none',
                cursor: 'pointer', color: view === v ? 'var(--teal)' : 'var(--text3)', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{icon}</button>
            ))}
          </div>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/email-marketing/new')}>+ New</button>
        </div>

        {/* Kanban */}
        {view === 'kanban' && (
          <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
            {stages.map(stage => {
              const stageRecords = emailRecords.filter(r => (stageMap[r.state] || 'Draft') === stage)
              return (
                <div key={stage} style={{ width: 260, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                    <span style={{ fontSize: 11, color: 'var(--text2)' }}>{stageRecords.length}</span>
                  </div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {stageRecords.map(rec => (
                      <div key={rec.id}
                        data-erp="kanban-card"
                        onClick={() => navigate(`/erp/email-marketing/${rec.id}`)}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', transition: 'all var(--t)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{rec.name}</div>
                        {rec.sent > 0 && (
                          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text2)' }}>
                            <span>📨 {rec.sent}</span>
                            <span>👁 {rec.opened}</span>
                            <span>🖱 {rec.clicked}</span>
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{rec.scheduled_date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List */}
        {view === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                {['Name','Scheduled','Sent','Opened','Clicked','Status'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {emailRecords.map(rec => (
                  <tr key={rec.id} data-erp="list-row" onClick={() => navigate(`/erp/email-marketing/${rec.id}`)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{rec.name}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{rec.scheduled_date}</td>
                    <td style={TD}>{rec.sent || 0}</td>
                    <td style={TD}>{rec.opened || 0}</td>
                    <td style={TD}>{rec.clicked || 0}</td>
                    <td style={TD}><Badge label={rec.state} color={STATE_COLOR[rec.state] || 'var(--text3)'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MktgShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL / SMS FORM (L59)
═══════════════════════════════════════════════════════════════ */
export function EmailMarketingForm({ type = 'mail' }) {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isNew     = !id || id === 'new'
  const location  = useLocation()
  const isSMS     = location.pathname.startsWith('/erp/sms') || type === 'sms'

  const [vals, setVals]     = useState({ name: '', mailing_type: isSMS ? 'sms' : 'mail', subject: '', body_html: '', mailing_model_id: 'res.partner', scheduled_date: '' })
  const [status, setStatus] = useState('Draft')
  const [tab, setTab]       = useState('Content')

  useEffect(() => {
    if (!isNew) getRecord('mailing.mailing', id).then(r => {
      if (r) { setVals(r); setStatus(r.state === 'done' ? 'Done' : r.state === 'sent' ? 'Done' : 'Draft') }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'In Queue': 'in_queue', 'Done': 'done' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('mailing.mailing', data)
    else       await updateRecord('mailing.mailing', id, data)
    navigate(isSMS ? '/erp/sms' : '/erp/email-marketing')
  }

  const handleSend = async () => { setStatus('Done'); await handleSave() }

  const contentFields = [
    { key: 'name',     label: isSMS ? 'SMS Name' : 'Email Subject', required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'mailing_model_id', label: 'Recipients',  type: 'select', dataErp: 'field-type',
      options: ['res.partner','crm.lead','sale.order','hr.employee'] },
    { key: 'scheduled_date', label: 'Scheduled Date', type: 'date', dataErp: 'field-date' },
    { key: 'body_html',      label: isSMS ? 'SMS Body' : 'Email Body', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <MktgShell>
      <StatusBar stages={['Draft', 'In Queue', 'Done']} current={status} onChange={setStatus} />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Action bar */}
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate(isSMS ? '/erp/sms' : '/erp/email-marketing')}>Discard</button>
          <span style={{ flex: 1 }} />
          {status === 'Draft' && (
            <button data-erp="send-button" className="btn btn-primary btn-sm"
              style={{ background: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleSend}>
              {isSMS ? '📱 Send SMS' : '📧 Send'}
            </button>
          )}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px', flexShrink: 0 }}>
          {['Content', 'Settings'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 16px', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--teal)' : '2px solid transparent', color: tab === t ? 'var(--teal)' : 'var(--text2)', fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>
        {/* Fields */}
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {contentFields.map(field => {
              const full = field.fullWidth || field.type === 'textarea'
              return (
                <div key={field.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea rows={6} data-erp={field.dataErp} value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder || ''} style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : field.type === 'select' ? (
                    <select data-erp={field.dataErp} value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">— Select —</option>
                      {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'date' ? (
                    <input type="date" data-erp="field-date" value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  ) : (
                    <input type="text" data-erp={field.dataErp} value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder || ''} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </MktgShell>
  )
}

/* ── SMS page (reuses email list filtered by type) ──────────────── */
export function SMSPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('kanban')
  const { records, reload } = useRecordList('mailing.mailing', { sortKey: 'scheduled_date' })
  useEffect(() => { seedMktg().then(reload) }, [])

  const smsRecords = records.filter(r => r.mailing_type === 'sms')
  const stages = ['Draft', 'Done']
  const stageMap = { draft: 'Draft', sent: 'Done', done: 'Done' }

  return (
    <MktgShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>SMS Marketing</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/sms/new')}>+ New</button>
        </div>
        {view === 'kanban' ? (
          <div style={{ flex: 1, display: 'flex', gap: 12, padding: '14px 20px', overflowX: 'auto', alignItems: 'flex-start', minHeight: 0 }}>
            {stages.map(stage => {
              const stageRecords = smsRecords.filter(r => (stageMap[r.state] || 'Draft') === stage)
              return (
                <div key={stage} style={{ width: 260, flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                    <span style={{ fontSize: 11, color: 'var(--text2)' }}>{stageRecords.length}</span>
                  </div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {stageRecords.map(rec => (
                      <div key={rec.id} data-erp="kanban-card" onClick={() => navigate(`/erp/sms/${rec.id}`)}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', transition: 'all var(--t)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'var(--surface3)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{rec.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{rec.scheduled_date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)' }}>
                {['Name','Scheduled','Sent','Status'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {smsRecords.map(rec => (
                  <tr key={rec.id} data-erp="list-row" onClick={() => navigate(`/erp/sms/${rec.id}`)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{rec.name}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{rec.scheduled_date}</td>
                    <td style={TD}>{rec.sent || 0}</td>
                    <td style={TD}><Badge label={rec.state} color={rec.state === 'done' ? 'var(--success)' : 'var(--text3)'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MktgShell>
  )
}
export function SMSForm() { return <EmailMarketingForm type="sms" /> }

/* ═══════════════════════════════════════════════════════════════
   MARKETING AUTOMATION (L62)
═══════════════════════════════════════════════════════════════ */
export function MarketingAutomationPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('marketing.automation', { sortKey: 'name' })
  useEffect(() => { seedAutomation().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', running: 'var(--success)', stopped: 'var(--warning)' }

  return (
    <MktgShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Marketing Automation</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/marketing-automation/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              {['Name','Model','Activities','Status'].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {records.map(rec => (
                <tr key={rec.id} data-erp="list-row" onClick={() => navigate(`/erp/marketing-automation/${rec.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{rec.name}</td>
                  <td style={{ ...TD, color: 'var(--text2)', fontFamily: 'monospace', fontSize: 12 }}>{rec.model_name}</td>
                  <td style={TD}>{rec.activities_count}</td>
                  <td style={TD}><Badge label={rec.state} color={STATE_COLOR[rec.state] || 'var(--text3)'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MktgShell>
  )
}

export function MarketingAutomationForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals]     = useState({ name: '', model_name: 'crm.lead', state: 'draft' })
  const [status, setStatus] = useState('Draft')

  useEffect(() => {
    if (!isNew) getRecord('marketing.automation', id).then(r => {
      if (r) { setVals(r); setStatus(r.state === 'running' ? 'Running' : r.state === 'stopped' ? 'Stopped' : 'Draft') }
    })
  }, [id])

  const handleSave = async () => {
    const stateMap = { 'Draft': 'draft', 'Running': 'running', 'Stopped': 'stopped' }
    const data = { ...vals, state: stateMap[status] || 'draft' }
    if (isNew) await createRecord('marketing.automation', data)
    else       await updateRecord('marketing.automation', id, data)
    navigate('/erp/marketing-automation')
  }

  const handleStart = async () => { setStatus('Running'); await handleSave() }

  return (
    <MktgShell>
      <StatusBar stages={['Draft', 'Running', 'Stopped']} current={status} onChange={setStatus} />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button data-erp="save-button" className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/marketing-automation')}>Discard</button>
          <span style={{ flex: 1 }} />
          {status === 'Draft' && <button data-erp="confirm-button" className="btn btn-primary btn-sm" style={{ background: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleStart}>Start</button>}
        </div>
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {[
              { key: 'name',       label: 'Automation Name', required: true, dataErp: 'field-name', fullWidth: true },
              { key: 'model_name', label: 'Target Model',    type: 'select', dataErp: 'field-type',
                options: ['crm.lead','res.partner','sale.order','hr.employee'] },
            ].map(field => {
              const full = field.fullWidth
              return (
                <div key={field.key} style={{ gridColumn: full ? '1 / -1' : 'span 1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select data-erp={field.dataErp} value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" data-erp={field.dataErp} value={vals[field.key] || ''} onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </MktgShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SIGN (L73)
═══════════════════════════════════════════════════════════════ */
export function SignPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('sign.template', { sortKey: 'name' })
  useEffect(() => { seedSign().then(reload) }, [])

  return (
    <MktgShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Sign Templates</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/sign/new')}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              {['Template Name','Fields','Signed','Status'].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {records.map(rec => (
                <tr key={rec.id} data-erp="list-row" onClick={() => navigate(`/erp/sign/${rec.id}`)}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{rec.name}</td>
                  <td style={{ ...TD, color: 'var(--text2)' }}>{rec.nb_fields}</td>
                  <td style={TD}>{rec.sign_count}</td>
                  <td style={TD}><Badge label={rec.state || 'shared'} color={rec.state === 'closed' ? 'var(--text3)' : 'var(--success)'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MktgShell>
  )
}

export function SignForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', nb_fields: 0, state: 'shared' })

  useEffect(() => {
    if (!isNew) getRecord('sign.template', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('sign.template', vals)
    else       await updateRecord('sign.template', id, vals)
    navigate('/erp/sign')
  }

  const handleSend = () => alert('Send sign request dialog would open here.')

  return (
    <MktgShell>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/sign')}>Discard</button>
          <span style={{ flex: 1 }} />
          <button data-erp="send-button" className="btn btn-primary btn-sm" style={{ background: 'var(--teal)', borderColor: 'var(--teal)' }} onClick={handleSend}>
            ✍ Send
          </button>
        </div>
        <div style={{ padding: '20px 24px', maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {[
              { key: 'name', label: 'Template Name', dataErp: 'field-name', fullWidth: true },
              { key: 'nb_fields', label: 'Number of Fields', type: 'number', dataErp: 'field-amount' },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.fullWidth ? '1 / -1' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{field.label}</label>
                <input type={field.type === 'number' ? 'number' : 'text'}
                  data-erp={field.dataErp} value={vals[field.key] || ''}
                  onChange={e => setVals(p => ({ ...p, [field.key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MktgShell>
  )
}
