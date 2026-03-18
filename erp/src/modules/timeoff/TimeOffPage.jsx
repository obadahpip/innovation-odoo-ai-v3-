/**
 * TimeOffPage.jsx — hr.leave / hr.leave.type
 * Odoo 19.0 fields: name, employee_id, holiday_status_id, date_from,
 *   date_to, number_of_days, state, holiday_type, notes, active
 * state: draft|confirm|refuse|validate1|validate|cancel
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import { createRecord } from '@data/db.js'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  draft:     { label:'To Submit',   color:'var(--text3)',   bg:'var(--surface3)' },
  confirm:   { label:'To Approve',  color:'var(--warning)', bg:'rgba(240,173,78,0.15)' },
  validate1: { label:'2nd Approval',color:'var(--info)',    bg:'rgba(52,152,219,0.15)' },
  validate:  { label:'Approved',    color:'var(--success)', bg:'rgba(46,204,113,0.15)' },
  refuse:    { label:'Refused',     color:'var(--danger)',  bg:'rgba(231,76,60,0.15)' },
  cancel:    { label:'Cancelled',   color:'var(--text3)',   bg:'var(--surface3)' },
}

export default function TimeOffPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')

  const { records: leaves } = useRecordList('hr.leave', { sortKey:'date_from', sortDir:'desc' })
  const { records: types  } = useRecordList('hr.leave.type', {})
  const { records: emps   } = useRecordList('hr.employee', {})

  const getTypeName = id => types.find(t => t.id === id)?.name || id || '—'
  const getEmpName  = id => emps.find(e => e.id === id)?.name  || id || '—'

  const filtered = leaves.filter(l => !search || getEmpName(l.employee_id).toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      {/* Sub-nav */}
      <div style={{ height:40, background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 16px', gap:0, flexShrink:0 }}>
        {[['overview','Overview'],['my','My Time Off'],['all','All Time Off'],['allocation','Allocations']].map(([k,label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'0 16px', height:'100%', background:'none', border:'none', fontFamily:'inherit',
            fontSize:13, cursor:'pointer',
            color: tab===k ? 'var(--text)' : 'var(--text2)',
            borderBottom: tab===k ? '2px solid var(--teal)' : '2px solid transparent',
            fontWeight: tab===k ? 600 : 400,
          }}>{label}</button>
        ))}
      </div>

      <ActionBar
        showNew onNew={async () => {
          await createRecord('hr.leave', { name:'New Time Off', employee_id:'emp-emma', holiday_status_id:'lt-annual', date_from:new Date().toISOString(), date_to:new Date().toISOString(), number_of_days:1, state:'draft', active:true })
        }}
        title="Time Off" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={filtered.length} pageSize={80}
        views={['list','kanban','activity','calendar','gantt']} activeView="list"
      />

      {/* Overview: allocation summary per type */}
      {tab === 'overview' && (
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16 }}>
            {types.map(type => (
              <div key={type.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:8 }}>{type.name}</div>
                <div style={{ display:'flex', gap:16 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:20, fontWeight:700, color:'var(--teal)' }}>{type.allocation_type === 'no' ? '∞' : '20'}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>Available</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:20, fontWeight:700, color:'var(--text)' }}>
                      {leaves.filter(l => l.holiday_status_id === type.id && l.state === 'validate').reduce((s,l)=>s+(l.number_of_days||0),0)}
                    </div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>Approved</div>
                  </div>
                </div>
                <button style={{ marginTop:12, width:'100%', padding:'5px 0', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:4, cursor:'pointer', color:'var(--text2)', fontSize:12, fontFamily:'inherit' }}>
                  New Allocation
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All time off list */}
      {(tab === 'my' || tab === 'all') && (
        <div style={{ flex:1, overflow:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></th>
                {['Employee','Time Off Type','Date From','Date To','Days','Status'].map(h=>(
                  <th key={h} style={{ padding:'8px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const badge = STATE_MAP[l.state] || STATE_MAP.draft
                return (
                  <tr key={l.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'0 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></td>
                    <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', fontWeight:500 }}>{getEmpName(l.employee_id)}</td>
                    <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{getTypeName(l.holiday_status_id)}</td>
                    <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{l.date_from ? new Date(l.date_from).toLocaleDateString() : '—'}</td>
                    <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{l.date_to ? new Date(l.date_to).toLocaleDateString() : '—'}</td>
                    <td style={{ padding:'8px 10px', fontSize:13, fontWeight:500 }}>{l.number_of_days || '—'}</td>
                    <td style={{ padding:'8px 10px' }}>
                      <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:badge.bg, color:badge.color }}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state"><div style={{fontSize:40,opacity:0.2}}>🌴</div><h3>No time off requests</h3></div>
          )}
        </div>
      )}
    </div>
  )
}
