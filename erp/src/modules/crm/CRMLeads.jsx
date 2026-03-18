/**
 * CRMLeads.jsx — Odoo 19.0 field names
 * crm.lead fields: name, partner_name, email_from, user_id,
 *   expected_revenue, stage_id, priority, type
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

export default function CRMLeads() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { records, loading } = useRecordList('crm.lead', {
    sortKey: '__createdAt', sortDir: 'desc',
  })

  // crm.stage map
  const { records: stages } = useRecordList('crm.stage', { sortKey:'sequence' })
  const stageName = id => stages.find(s => s.id === id)?.name || id || '—'

  const filtered = records.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.partner_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/crm/leads/new')}
        title="All Leads" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={filtered.length} pageSize={80}
        views={['kanban','list','calendar','pivot','graph','activity','map']}
        activeView="list"
        onViewChange={v => v === 'kanban' && navigate('/erp/crm/pipeline')}
      />
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} /></th>
              {['Opportunity','Contact Name','Email','Salesperson','Expected Rev.','Stage'].map(h => (
                <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                onClick={() => navigate(`/erp/crm/leads/${r.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding:'0 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} /></td>
                {/* name */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', fontWeight:500 }}>{r.name}</td>
                {/* contact_name / partner_name */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.contact_name || r.partner_name || '—'}</td>
                {/* email_from */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.email_from || '—'}</td>
                {/* user_id — Salesperson */}
                <td style={{ padding:'8px 10px', fontSize:13 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>O</div>
                    <span style={{ fontSize:13, color:'var(--text2)' }}>obadah abuodah</span>
                  </div>
                </td>
                {/* expected_revenue */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)', textAlign:'right' }}>
                  {r.expected_revenue ? `${Number(r.expected_revenue).toFixed(3)} د.ا` : '0.000 د.ا'}
                </td>
                {/* stage_id → stage name */}
                <td style={{ padding:'8px 10px', fontSize:13 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ color:'var(--text2)' }}>{stageName(r.stage_id)}</span>
                    <button onClick={e => e.stopPropagation()} style={{ border:'1px solid var(--teal)', borderRadius:3, color:'var(--teal)', fontSize:11, padding:'1px 6px', cursor:'pointer', background:'none' }}>Email</button>
                    <button onClick={e => e.stopPropagation()} style={{ border:'1px solid var(--teal)', borderRadius:3, color:'var(--teal)', fontSize:11, padding:'1px 6px', cursor:'pointer', background:'none' }}>SMS</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="empty-state"><div style={{fontSize:40,opacity:0.2}}>🎯</div><h3>No leads found</h3></div>
        )}
      </div>
    </div>
  )
}
