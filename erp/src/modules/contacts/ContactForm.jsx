/**
 * ContactForm.jsx — Odoo 19.0 field names
 *
 * res.partner fields:
 *   name, is_company, company_type, parent_id, company_name,
 *   email, phone, mobile, website, street, street2, city, state_id,
 *   zip, country_id, vat, function (Job Position), title, lang,
 *   user_id, tag_ids, customer_rank, supplier_rank, child_ids,
 *   image_1920, active, comment (Notes)
 */
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord } from '@data/useRecord.js'
import { useState } from 'react'
import Chatter from '@shell/Chatter.jsx'

const DEFAULTS = {
  name: '', is_company: false, company_type: 'person',
  parent_id: null, company_name: '',
  email: '', phone: '', mobile: '', website: '',
  street: '', street2: '', city: '', state_id: '', zip: '', country_id: '',
  vat: '',           // Tax ID
  function: '',      // Job Position (Odoo uses 'function' for this field, not 'job_position')
  title: null,       // Many2one(res.partner.title)
  lang: 'en_US',
  user_id: null,
  tag_ids: [],       // Many2many(res.partner.category)
  customer_rank: 0,
  supplier_rank: 0,
  child_ids: [],     // Related contacts
  image_1920: null,
  active: true,
  comment: '',       // Notes (Html)
}

const SMART_BTNS = [
  { label:'Opportunities', icon:'⭐', key:'opps',  count:0 },
  { label:'Sales',         icon:'$',  key:'sales', count:0 },
  { label:'Invoiced',      icon:'📋', key:'inv',   count:0, suffix:'0.000 د.ا' },
  { label:'Meetings',      icon:'📅', key:'meet',  count:0 },
  { label:'Tasks',         icon:'✓',  key:'tasks', count:0 },
  { label:'Documents',     icon:'📄', key:'docs',  count:0 },
]

export default function ContactForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, save } = useRecord(
    'res.partner', !id || id === 'new' ? null : id, DEFAULTS
  )
  const [activeTab, setActiveTab] = useState('contacts')

  const handleSave = async () => {
    const s = await save()
    if (!id || id === 'new') navigate(`/erp/contacts/${s.id}`, { replace:true })
  }

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

      {/* Top bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer', padding:0 }} onClick={() => navigate('/erp/contacts')}>Contacts</button>
        <span style={{ color:'var(--text3)', fontSize:12 }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || 'New'}</span>
        {isDirty && <>
          <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save manually</button>
          <button className="btn btn-secondary btn-sm">Discard</button>
        </>}

        {/* Smart buttons */}
        <div style={{ marginLeft:'auto', display:'flex', gap:2 }}>
          {SMART_BTNS.map(btn => (
            <button key={btn.key} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1, padding:'4px 12px', background:'none', border:'1px solid var(--border)', borderRadius:4, cursor:'pointer', color:'var(--text2)', fontFamily:'inherit', transition:'background var(--t)' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
              onMouseLeave={e=>e.currentTarget.style.background='none'}>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                <span style={{ fontSize:13 }}>{btn.icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{btn.count}</span>
              </div>
              <span style={{ fontSize:10, color:'var(--text3)', whiteSpace:'nowrap' }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

          {/* Company type toggle */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            {[['person','Individual'],['company','Company']].map(([val,label]) => (
              <button key={val} onClick={() => { setField('company_type', val); setField('is_company', val==='company') }}
                style={{ padding:'3px 12px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:'inherit',
                  border:`1px solid ${record?.company_type===val ? 'var(--teal)' : 'var(--border2)'}`,
                  background: record?.company_type===val ? 'var(--surface3)' : 'transparent',
                  color: record?.company_type===val ? 'var(--teal)' : 'var(--text2)',
                  fontWeight: record?.company_type===val ? 600 : 400,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Photo + name + contact details */}
          <div style={{ display:'flex', gap:16, marginBottom:24 }}>
            {/* image_1920 */}
            <div style={{ width:90, height:90, borderRadius:6, background:'var(--surface3)', border:'2px dashed var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
              {record?.image_1920
                ? <img src={record.image_1920} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:4 }} />
                : <span style={{ fontSize:28, opacity:0.3 }}>📷</span>
              }
            </div>

            <div style={{ flex:1 }}>
              {/* name */}
              <input value={record?.name || ''} onChange={e => setField('name', e.target.value)}
                placeholder="Name (company or person)"
                style={{ fontSize:20, fontWeight:700, color:'var(--text)', background:'none', border:'none', borderBottom:'1px solid var(--teal)', outline:'none', width:'100%', padding:'4px 0', fontFamily:'inherit', marginBottom:8 }} />

              {/* parent_id / company_name */}
              <div style={{ display:'flex', gap:8, marginBottom:4, alignItems:'center' }}>
                <span style={{ fontSize:14, color:'var(--purple3)' }}>🏢</span>
                <input className="o-input" value={record?.company_name || ''} onChange={e => setField('company_name', e.target.value)}
                  placeholder="Company Employer" style={{ flex:1, fontSize:13 }} />
              </div>

              {/* email */}
              <div style={{ display:'flex', gap:8, marginBottom:4, alignItems:'center' }}>
                <span style={{ fontSize:14, color:'var(--purple3)' }}>✉️</span>
                <input className="o-input" type="email" value={record?.email || ''} onChange={e => setField('email', e.target.value)}
                  placeholder="Email" style={{ flex:1, fontSize:13 }} />
              </div>

              {/* phone */}
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:14, color:'var(--purple3)' }}>📞</span>
                <input className="o-input" value={record?.phone || ''} onChange={e => setField('phone', e.target.value)}
                  placeholder="Phone" style={{ flex:1, fontSize:13 }} />
              </div>
            </div>
          </div>

          {/* Address + right column */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 40px', marginBottom:24 }}>
            <div>
              {/* Address fields */}
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:4, marginBottom:4, alignItems:'center' }}>
                <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>Address</label>
                <input className="o-input" value={record?.street || ''} onChange={e => setField('street', e.target.value)} placeholder="Street..." />
              </div>
              <div style={{ marginLeft:84, marginBottom:4 }}>
                <input className="o-input" value={record?.street2 || ''} onChange={e => setField('street2', e.target.value)} placeholder="Street 2..." />
              </div>
              {/* city / state_id / zip */}
              <div style={{ marginLeft:84, display:'grid', gridTemplateColumns:'1fr 1fr 80px', gap:4, marginBottom:4 }}>
                <input className="o-input" value={record?.city || ''} onChange={e => setField('city', e.target.value)} placeholder="City" />
                <input className="o-input" value={record?.state_id || ''} onChange={e => setField('state_id', e.target.value)} placeholder="State" />
                <input className="o-input" value={record?.zip || ''} onChange={e => setField('zip', e.target.value)} placeholder="ZIP" />
              </div>
              {/* country_id */}
              <div style={{ marginLeft:84, marginBottom:8 }}>
                <input className="o-input" value={record?.country_id || ''} onChange={e => setField('country_id', e.target.value)} placeholder="Country" />
              </div>
              {/* vat (Tax ID) */}
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:4, alignItems:'center' }}>
                <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>Tax ID</label>
                <input className="o-input" value={record?.vat || ''} onChange={e => setField('vat', e.target.value)} placeholder="not applicable" />
              </div>
            </div>

            <div>
              {/* function (Job Position — Odoo uses 'function', not 'job_position') */}
              <FieldRow label="Job Position">
                <input className="o-input" value={record?.function || ''} onChange={e => setField('function', e.target.value)} placeholder="e.g. Sales Director" />
              </FieldRow>
              {/* website */}
              <FieldRow label="Website">
                <input className="o-input" value={record?.website || ''} onChange={e => setField('website', e.target.value)} placeholder="e.g. https://www.odoo.com" />
              </FieldRow>
              {/* tag_ids */}
              <FieldRow label="Tags">
                <input className="o-input" value={Array.isArray(record?.tag_ids) ? record.tag_ids.join(', ') : ''}
                  onChange={e => setField('tag_ids', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder='e.g. "B2B", "VIP", "Consulting"' />
              </FieldRow>
            </div>
          </div>

          {/* Tabs: Contacts | Sales & Purchase | Accounting | Notes */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:0 }}>
            {['Contacts','Sales & Purchase','Accounting','Notes'].map(t => {
              const k = t.toLowerCase().replace(/[& ]+/g,'_').replace(/[^a-z_]/g,'')
              return (
                <button key={t} onClick={() => setActiveTab(k)} style={{
                  padding:'8px 16px', background:'none', border:'none', fontFamily:'inherit',
                  borderBottom: activeTab===k ? '2px solid var(--teal)' : '2px solid transparent',
                  color: activeTab===k ? 'var(--text)' : 'var(--text2)',
                  fontSize:13, fontWeight: activeTab===k ? 600 : 400, cursor:'pointer', marginBottom:-1,
                }}>{t}</button>
              )
            })}
          </div>

          {/* Contacts tab — child_ids */}
          {activeTab === 'contacts' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px', minHeight:80, padding:12 }}>
              <button style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}
                onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                + Add Related Contacts
              </button>
            </div>
          )}

          {/* Notes tab — comment field */}
          {activeTab === 'notes' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px', padding:12 }}>
              <textarea className="o-input" rows={4} placeholder="Internal notes..."
                value={record?.comment || ''} onChange={e => setField('comment', e.target.value)} />
            </div>
          )}

          {(activeTab === 'sales___purchase' || activeTab === 'accounting') && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px', padding:20, color:'var(--text3)', fontSize:13 }}>
              This tab is available in Phase 4+.
            </div>
          )}
        </div>

        {/* Chatter */}
        <div style={{ width:320, borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName="res.partner" recordId={record?.id} messages={[
            { author:'obadah abuodah', body:'Creating a new record...', date:new Date().toISOString(), type:'note' }
          ]} />
        </div>
      </div>
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'110px 1fr', alignItems:'center', gap:8, marginBottom:10 }}>
      <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}
