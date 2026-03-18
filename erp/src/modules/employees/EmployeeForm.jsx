/**
 * EmployeeForm.jsx — Odoo 19.0 field names
 *
 * hr.employee fields used:
 *   name, job_id (Many2one hr.job), job_title, department_id,
 *   parent_id (Manager), coach_id, work_email, work_phone, mobile_phone,
 *   work_location_id, resource_calendar_id, user_id, company_id,
 *   active, category_ids (Tags), image_1920, gender, birthday,
 *   country_id (Nationality), identification_id, passport_id,
 *   emergency_contact, emergency_phone, private_email,
 *   study_field, study_school, children, marital
 */
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord, useRecordList } from '@data/useRecord.js'
import { useState } from 'react'
import Chatter from '@shell/Chatter.jsx'

const DEFAULTS = {
  name: '', job_title: '', job_id: null, department_id: null,
  parent_id: null, coach_id: null,
  work_email: '', work_phone: '', mobile_phone: '',
  work_location_id: null,
  resource_calendar_id: null,
  user_id: null, company_id: 'partner-mta',
  active: true, category_ids: [],
  image_1920: null,
  // Private tab
  gender: '', birthday: '', private_email: '',
  country_id: null, identification_id: '', passport_id: '',
  emergency_contact: '', emergency_phone: '',
  study_field: '', study_school: '',
  children: 0, marital: 'single',
  bank_account_id: null,
}

const DAYS_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export default function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, save } = useRecord(
    'hr.employee', !id || id === 'new' ? null : id, DEFAULTS
  )
  const { records: employees } = useRecordList('hr.employee', {})
  const { records: depts }    = useRecordList('hr.department', {})
  const [tab, setTab] = useState('work')

  const handleSave = async () => {
    const s = await save()
    if (!id || id === 'new') navigate(`/erp/employees/${s.id}`, { replace:true })
  }

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>

  const manager = employees.find(e => e.id === record?.parent_id)
  const tags    = record?.category_ids || []
  const initials = n => n ? n.trim().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?'

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

      {/* Top action bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer', padding:0 }} onClick={() => navigate('/erp/employees')}>Employees</button>
        <span style={{ color:'var(--text3)', fontSize:12 }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || 'New Employee'}</span>
        {isDirty && <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save</button>}

        {/* Smart buttons */}
        <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
          {[['📄 Documents','0'],['📅 Time Off',''],['📋 History','1']].map(([label, count]) => (
            <button key={label} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', background:'none', border:'1px solid var(--border)', borderRadius:4, cursor:'pointer', color:'var(--text2)', fontSize:12, fontFamily:'inherit' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
              onMouseLeave={e=>e.currentTarget.style.background='none'}>
              {label} <span style={{ fontWeight:600, color:'var(--text)' }}>{count}</span>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display:'flex', gap:6, marginLeft:16 }}>
          <button className="btn btn-secondary btn-sm">Create User</button>
          <button className="btn btn-secondary btn-sm">Launch Plan</button>
        </div>

        {/* Status date */}
        <div style={{ marginLeft:12, padding:'3px 12px', background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:20, fontSize:12, color:'var(--text2)' }}>
          {new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
          <span style={{ marginLeft:4, cursor:'pointer', color:'var(--teal)' }}>+</span>
        </div>

        <div style={{ display:'flex', gap:4, marginLeft:12 }}>
          {['Send message','Log note','Activity'].map(t => (
            <button key={t} className="btn btn-primary btn-sm" style={{ fontSize:11, padding:'2px 8px' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

          {/* Header: image_1920 + name + contact info + category_ids */}
          <div style={{ display:'flex', gap:16, marginBottom:20 }}>
            <div style={{ width:80, height:80, borderRadius:8, background:'#714b67', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'rgba(255,255,255,0.5)', overflow:'hidden', cursor:'pointer' }}>
              {record?.image_1920
                ? <img src={record.image_1920} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : initials(record?.name)
              }
            </div>
            <div style={{ flex:1 }}>
              {/* name */}
              <input value={record?.name || ''} onChange={e => setField('name', e.target.value)}
                placeholder="Employee Name"
                style={{ fontSize:22, fontWeight:700, color:'var(--text)', background:'none', border:'none', outline:'none', width:'100%', fontFamily:'inherit', marginBottom:6 }} />

              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                {/* work_email */}
                {record?.work_email && <span style={{ fontSize:12, color:'var(--text2)' }}>✉️ {record.work_email}</span>}
                {/* work_phone */}
                {record?.work_phone && <span style={{ fontSize:12, color:'var(--text2)' }}>📞 {record.work_phone}</span>}
                {/* mobile_phone + Call/SMS */}
                {record?.mobile_phone && (
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'var(--text2)' }}>📱 {record.mobile_phone}</span>
                    <button style={{ background:'none', border:'1px solid var(--teal)', borderRadius:3, color:'var(--teal)', fontSize:11, padding:'1px 6px', cursor:'pointer' }}>Call</button>
                    <button style={{ background:'none', border:'1px solid var(--teal)', borderRadius:3, color:'var(--teal)', fontSize:11, padding:'1px 6px', cursor:'pointer' }}>SMS</button>
                  </div>
                )}
              </div>

              {/* category_ids (Tags) */}
              {tags.length > 0 && (
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:4 }}>
                  {tags.map((tag, i) => (
                    <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'var(--surface3)', color:'var(--text2)', padding:'1px 8px', borderRadius:12, fontSize:12 }}>
                      {tag} <span style={{ cursor:'pointer', color:'var(--text3)' }} onClick={() => setField('category_ids', tags.filter(t => t !== tag))}>×</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs: Work | Resume | Personal | Payroll | Settings */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:0 }}>
            {['Work','Resume','Personal','Payroll','Settings'].map(t => {
              const k = t.toLowerCase()
              return (
                <button key={t} onClick={() => setTab(k)} style={{
                  padding:'8px 16px', background:'none', border:'none', fontFamily:'inherit',
                  borderBottom: tab===k ? '2px solid var(--teal)' : '2px solid transparent',
                  color: tab===k ? 'var(--text)' : 'var(--text2)',
                  fontSize:13, fontWeight: tab===k ? 600 : 400, cursor:'pointer', marginBottom:-1,
                }}>{t}</button>
              )
            })}
          </div>

          {/* Work tab */}
          {tab === 'work' && (
            <div style={{ padding:'20px 0' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 60px' }}>

                {/* Left: WORK + LOCATION + USUAL WORK LOCATION */}
                <div>
                  <SectionLabel>WORK</SectionLabel>
                  {/* department_id */}
                  <FieldRow label="Department">
                    <select className="o-input" value={record?.department_id || ''} onChange={e => setField('department_id', e.target.value)}>
                      <option value="">—</option>
                      {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </FieldRow>
                  {/* job_id (Job Position — Many2one hr.job) */}
                  <FieldRow label="Job Position">
                    <input className="o-input" value={record?.job_id || ''} onChange={e => setField('job_id', e.target.value)} placeholder="e.g. Software Engineer" />
                  </FieldRow>
                  {/* job_title */}
                  <FieldRow label="Job Title">
                    <input className="o-input" value={record?.job_title || ''} onChange={e => setField('job_title', e.target.value)} placeholder="e.g. Lead Developer" />
                  </FieldRow>
                  {/* parent_id (Manager) */}
                  <FieldRow label="Manager">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {manager && (
                        <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>
                          {initials(manager.name)}
                        </div>
                      )}
                      <select className="o-input" style={{ flex:1 }} value={record?.parent_id || ''} onChange={e => setField('parent_id', e.target.value)}>
                        <option value="">—</option>
                        {employees.filter(e => e.id !== record?.id).map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                  </FieldRow>
                  {/* coach_id */}
                  <FieldRow label="Coach">
                    <select className="o-input" value={record?.coach_id || ''} onChange={e => setField('coach_id', e.target.value)}>
                      <option value="">—</option>
                      {employees.filter(e => e.id !== record?.id).map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </FieldRow>

                  <SectionLabel style={{ marginTop:20 }}>LOCATION</SectionLabel>
                  <FieldRow label="Work Address">
                    <input className="o-input" value={record?.work_address || ''} onChange={e => setField('work_address', e.target.value)} placeholder="mta" />
                  </FieldRow>
                  {/* work_location_id */}
                  <FieldRow label="Work Location">
                    <input className="o-input" value={record?.work_location || ''} onChange={e => setField('work_location', e.target.value)} placeholder="e.g. Building 2, Remote, etc." />
                  </FieldRow>

                  <SectionLabel style={{ marginTop:20 }}>USUAL WORK LOCATION</SectionLabel>
                  {DAYS_OF_WEEK.slice(0, 5).map(day => (
                    <FieldRow key={day} label={day}>
                      <select className="o-input">
                        <option value="">Unspecified</option>
                        <option>Home</option>
                        <option>Office</option>
                        <option>Remote</option>
                      </select>
                    </FieldRow>
                  ))}
                </div>

                {/* Right: ORGANIZATION CHART + CONTACT */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <SectionLabel>ORGANIZATION CHART</SectionLabel>
                    <button style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>▲ FULL CHART</button>
                  </div>

                  {/* Mini org chart */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center', marginBottom:24 }}>
                    {manager && (
                      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6, width:'100%', cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#e07a5f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{initials(manager.name)}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--teal)' }}>{manager.name}</div>
                          <div style={{ fontSize:11, color:'var(--text2)' }}>{manager.job_title}</div>
                        </div>
                        <span style={{ marginLeft:'auto', background:'var(--surface3)', padding:'2px 8px', borderRadius:10, fontSize:11, color:'var(--text2)' }}>
                          {employees.filter(e => e.parent_id === manager.id).length}
                        </span>
                      </div>
                    )}
                    {record?.name && (
                      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background:'var(--surface2)', border:'2px solid var(--teal)', borderRadius:6, width:'85%' }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#714b67', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{initials(record.name)}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record.name}</div>
                          <div style={{ fontSize:11, color:'var(--text2)' }}>{record.job_title}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <SectionLabel>CONTACT</SectionLabel>
                  {/* work_email */}
                  <FieldRow label="Work Email">
                    <input className="o-input" type="email" value={record?.work_email || ''} onChange={e => setField('work_email', e.target.value)} />
                  </FieldRow>
                  {/* work_phone */}
                  <FieldRow label="Work Phone">
                    <input className="o-input" value={record?.work_phone || ''} onChange={e => setField('work_phone', e.target.value)} />
                  </FieldRow>
                  {/* mobile_phone */}
                  <FieldRow label="Mobile">
                    <input className="o-input" value={record?.mobile_phone || ''} onChange={e => setField('mobile_phone', e.target.value)} />
                  </FieldRow>
                </div>
              </div>
            </div>
          )}

          {/* Personal tab */}
          {tab === 'personal' && (
            <div style={{ padding:'20px 0' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 60px' }}>
                <div>
                  {/* private_email */}
                  <FieldRow label="Private Email">
                    <input className="o-input" type="email" value={record?.private_email || ''} onChange={e => setField('private_email', e.target.value)} />
                  </FieldRow>
                  {/* gender */}
                  <FieldRow label="Gender">
                    <select className="o-input" value={record?.gender || ''} onChange={e => setField('gender', e.target.value)}>
                      <option value="">—</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FieldRow>
                  {/* birthday */}
                  <FieldRow label="Date of Birth">
                    <input type="date" className="o-input" value={record?.birthday || ''} onChange={e => setField('birthday', e.target.value)} style={{ colorScheme:'dark' }} />
                  </FieldRow>
                  {/* country_id (Nationality) */}
                  <FieldRow label="Nationality">
                    <select className="o-input" value={record?.country_id || ''} onChange={e => setField('country_id', e.target.value)}>
                      <option value="">—</option>
                      <option value="US">United States</option>
                      <option value="JO">Jordan</option>
                      <option value="DE">Germany</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </FieldRow>
                  {/* marital */}
                  <FieldRow label="Marital Status">
                    <select className="o-input" value={record?.marital || 'single'} onChange={e => setField('marital', e.target.value)}>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="cohabitant">Legal Cohabitant</option>
                      <option value="widower">Widower</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </FieldRow>
                  {/* children */}
                  <FieldRow label="Dependent Children">
                    <input type="number" className="o-input" min={0} value={record?.children || 0} onChange={e => setField('children', parseInt(e.target.value)||0)} />
                  </FieldRow>
                </div>
                <div>
                  {/* identification_id */}
                  <FieldRow label="ID Card Number">
                    <input className="o-input" value={record?.identification_id || ''} onChange={e => setField('identification_id', e.target.value)} />
                  </FieldRow>
                  {/* passport_id */}
                  <FieldRow label="Passport No.">
                    <input className="o-input" value={record?.passport_id || ''} onChange={e => setField('passport_id', e.target.value)} />
                  </FieldRow>
                  {/* emergency_contact */}
                  <FieldRow label="Contact Name">
                    <input className="o-input" value={record?.emergency_contact || ''} onChange={e => setField('emergency_contact', e.target.value)} />
                  </FieldRow>
                  {/* emergency_phone */}
                  <FieldRow label="Contact Phone">
                    <input className="o-input" value={record?.emergency_phone || ''} onChange={e => setField('emergency_phone', e.target.value)} />
                  </FieldRow>
                </div>
              </div>
            </div>
          )}

          {(tab === 'resume' || tab === 'payroll' || tab === 'settings') && (
            <div style={{ padding:20, color:'var(--text3)', fontSize:13, border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px' }}>
              This tab is available in Phase 4+.
            </div>
          )}
        </div>

        {/* Chatter */}
        <div style={{ width:320, borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName="hr.employee" recordId={record?.id} messages={[
            { author:'obadah abuodah', body:'Congratulations! May I recommend you to setup an onboarding plan?', date:new Date().toISOString(), type:'note' },
            { author:'obadah abuodah', body:'Employee created', date:new Date().toISOString(), type:'note' },
          ]} />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children, style }) {
  return <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10, ...style }}>{children}</div>
}
function FieldRow({ label, children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'center', gap:8, marginBottom:10 }}>
      <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}
