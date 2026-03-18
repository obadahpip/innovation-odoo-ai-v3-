/**
 * UsersList.jsx — res.users list
 * Odoo 19.0 fields: name, login, email, company_id, active, groups_id
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

const COLORS = ['#714b67','#e07a5f','#3d405b','#81b29a','#457b9d']
const colorFor = n => COLORS[(n?.charCodeAt(0)||0) % COLORS.length]
const initials = n => n?.trim().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?'

export default function UsersList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { records, total, loading } = useRecordList('res.users', {
    filter: r => r.active !== false,
    sortKey: 'name',
    search, searchFields: ['name','login','email'],
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => {}}
        title="Users" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={total} pageSize={80}
        views={['list']} activeView="list"
      />
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></th>
              {['Name','Login','Email','Company','Status'].map(h=>(
                <th key={h} style={{ padding:'8px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderBottom:'1px solid var(--border)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'0 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></td>
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:colorFor(r.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {initials(r.name)}
                    </div>
                    <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.login}</td>
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.email}</td>
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>mta</td>
                <td style={{ padding:'8px 10px' }}>
                  <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:'rgba(46,204,113,0.15)', color:'var(--success)' }}>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="empty-state"><div style={{fontSize:40,opacity:0.2}}>👤</div><h3>No users found</h3></div>
        )}
      </div>
    </div>
  )
}
