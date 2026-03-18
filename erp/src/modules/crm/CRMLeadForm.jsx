/**
 * CRMLeadForm.jsx — Odoo 19.0 field names
 *
 * crm.lead fields:
 *   name, partner_id, partner_name, contact_name, email_from, phone, mobile,
 *   stage_id (Many2one crm.stage), user_id, team_id, type,
 *   priority (Selection '0'-'3'), probability (Float 0-100),
 *   expected_revenue (Monetary), tag_ids, date_deadline (Date),
 *   active, lost_reason_id, kanban_state, description
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord, useRecordList } from '@data/useRecord.js'
import Chatter from '@shell/Chatter.jsx'

const DEFAULTS = {
  name: '', type:'opportunity',
  partner_id: null, partner_name: '', contact_name: '',
  email_from: '', phone: '', mobile: '',
  stage_id: null,
  user_id: 'user-admin', team_id: null,
  priority: '0',           // '0' Normal, '1' Low, '2' High, '3' Very High
  probability: 10,         // Float 0-100
  expected_revenue: 0,     // Monetary
  tag_ids: [],             // Many2many(crm.lead.tag)
  date_deadline: '',       // Date — Expected Closing
  active: true,
  description: '',         // Html Notes
  kanban_state: 'normal',  // normal | done | blocked
}

export default function CRMLeadForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, save } = useRecord(
    'crm.lead', !id || id === 'new' ? null : id, DEFAULTS
  )

  // crm.stage — load real stages from DB
  const { records: stages } = useRecordList('crm.stage', { sortKey:'sequence' })
  const [messages, setMessages] = useState([
    { id:1, author:'obadah abuodah', body:'Creating a new record...', date:new Date().toISOString(), type:'note' }
  ])

  const handleSave = async () => {
    const s = await save()
    if (!id || id === 'new') navigate(`/erp/crm/leads/${s.id}`, { replace:true })
  }

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>

  const activeStageIdx = stages.findIndex(s => s.id === record?.stage_id)

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

      {/* Action bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:6, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer', padding:0 }} onClick={() => navigate('/erp/crm/pipeline')}>Pipeline</button>
        <span style={{ color:'var(--text3)', fontSize:12 }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || 'New'}</span>
        {isDirty && <>
          <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save</button>
          <button className="btn btn-secondary btn-sm">Discard</button>
        </>}

        {/* crm.stage pills — loaded from real DB */}
        <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
          {stages.map((s, i) => {
            const isActive = i === activeStageIdx
            const isPast   = i < activeStageIdx
            return (
              <button key={s.id} onClick={() => setField('stage_id', s.id)} style={{
                padding:'3px 12px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:'inherit',
                border:`1px solid ${isActive ? 'var(--purple)' : 'var(--border2)'}`,
                background: isActive ? 'var(--purple)' : isPast ? 'var(--surface3)' : 'transparent',
                color: isActive ? '#fff' : isPast ? 'var(--text2)' : 'var(--text3)',
                fontWeight: isActive ? 600 : 400,
              }}>{s.name}</button>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          <div style={{ maxWidth:900 }}>
            {/* name */}
            <div style={{ marginBottom:20 }}>
              <input value={record?.name || ''} onChange={e => setField('name', e.target.value)}
                placeholder="Opportunity name..."
                style={{ fontSize:22, fontWeight:700, color:'var(--text)', background:'none', border:'none', borderBottom:'1px solid var(--teal)', outline:'none', width:'100%', padding:'4px 0', fontFamily:'inherit' }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 40px' }}>
              <div>
                {/* contact_name — Contact Person Name */}
                <FieldRow label="Contact Name">
                  <input className="o-input" value={record?.contact_name || ''} onChange={e => setField('contact_name', e.target.value)} />
                </FieldRow>
                {/* partner_name — Company Name */}
                <FieldRow label="Company Name">
                  <input className="o-input" value={record?.partner_name || ''} onChange={e => setField('partner_name', e.target.value)} />
                </FieldRow>
                {/* email_from — Contact Email */}
                <FieldRow label="Email">
                  <input className="o-input" type="email" value={record?.email_from || ''} onChange={e => setField('email_from', e.target.value)} />
                </FieldRow>
                {/* phone */}
                <FieldRow label="Phone">
                  <input className="o-input" value={record?.phone || ''} onChange={e => setField('phone', e.target.value)} />
                </FieldRow>
              </div>
              <div>
                {/* expected_revenue */}
                <FieldRow label="Expected Revenue">
                  <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                    <input type="number" className="o-input" value={record?.expected_revenue || 0}
                      onChange={e => setField('expected_revenue', parseFloat(e.target.value) || 0)} style={{ paddingRight:32 }} />
                    <span style={{ position:'absolute', right:8, color:'var(--text3)', fontSize:12 }}>د.ا</span>
                  </div>
                </FieldRow>
                {/* probability */}
                <FieldRow label="Probability">
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input type="number" className="o-input" min={0} max={100} value={record?.probability || 0}
                      onChange={e => setField('probability', parseInt(e.target.value) || 0)} style={{ flex:1 }} />
                    <span style={{ fontSize:12, color:'var(--text3)' }}>%</span>
                  </div>
                </FieldRow>
                {/* priority — stars (0-3) */}
                <FieldRow label="Priority">
                  <div style={{ display:'flex', gap:4 }}>
                    {[0,1,2,3].map(p => (
                      <span key={p} onClick={() => setField('priority', String(p))}
                        style={{ fontSize:20, cursor:'pointer', color: parseInt(record?.priority || '0') >= p ? '#f0ad4e' : 'var(--border2)' }}>★</span>
                    ))}
                  </div>
                </FieldRow>
                {/* date_deadline — Expected Closing */}
                <FieldRow label="Expected Closing">
                  <input type="date" className="o-input" value={record?.date_deadline || ''}
                    onChange={e => setField('date_deadline', e.target.value)} style={{ colorScheme:'dark' }} />
                </FieldRow>
              </div>
            </div>

            {/* description — Notes */}
            <div style={{ marginTop:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.3px', display:'block', marginBottom:4 }}>Notes</label>
              <textarea className="o-input" rows={4} value={record?.description || ''}
                onChange={e => setField('description', e.target.value)} placeholder="Internal notes..." />
            </div>
          </div>
        </div>

        {/* Chatter */}
        <div style={{ width:340, borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName="crm.lead" recordId={record?.id} messages={messages}
            onSend={msg => setMessages(m => [...m, msg])} />
        </div>
      </div>
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'center', gap:8, marginBottom:10 }}>
      <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}
