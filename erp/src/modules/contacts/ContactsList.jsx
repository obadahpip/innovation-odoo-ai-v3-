/**
 * ContactsList.jsx — Odoo 19.0 field names
 * res.partner: name, email, phone, country_id, customer_rank, tag_ids, image_1920
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

const COLORS = ['#714b67','#e07a5f','#3d405b','#81b29a','#457b9d','#2a9d8f','#e63946','#f4a261']
const colorFor = name => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]
const initials = name => name ? name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'
const countryName = code => ({ US:'United States', JO:'Jordan', DE:'Germany', GB:'United Kingdom', FR:'France' })[code] || code || '—'

export default function ContactsList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const pageSize = 80
  const { records, total, loading } = useRecordList('res.partner', {
    sortKey: 'name',
    search, searchFields: ['name', 'email'],
    page, pageSize,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/contacts/new')}
        title="Contacts" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={page} totalCount={total} pageSize={pageSize}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => p + 1)}
        views={['list','kanban','map']} activeView="list"
      />

      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}>
                <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
              </th>
              {[['Name','25%'],['Email','28%'],['Phone','15%'],['Activities','8%'],['Country','15%']].map(([h, w]) => (
                <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', width:w, borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                onClick={() => navigate(`/erp/contacts/${r.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding:'0 12px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
                </td>
                {/* name + avatar */}
                <td style={{ padding:'8px 10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {r.image_1920 ? (
                      <img src={r.image_1920} alt="" style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover' }} />
                    ) : (
                      <div style={{ width:24, height:24, borderRadius:'50%', background:colorFor(r.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {initials(r.name)}
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{r.name}</span>
                      {/* show ★ count if customer_rank > 0 and $ if supplier_rank > 0 */}
                      {(r.customer_rank > 0 || r.supplier_rank > 0) && (
                        <span style={{ marginLeft:8, fontSize:11, color:'var(--text3)' }}>
                          {r.customer_rank > 0 && `★ ${r.customer_rank}`}
                          {r.customer_rank > 0 && r.supplier_rank > 0 && '  '}
                          {r.supplier_rank > 0 && `$ ${r.supplier_rank}`}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* email */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.email || '—'}</td>
                {/* phone */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{r.phone || '—'}</td>
                {/* Activities clock */}
                <td style={{ padding:'8px 10px', textAlign:'center' }}>
                  <span style={{ color:'var(--text3)', fontSize:14 }}>⏱</span>
                </td>
                {/* country_id */}
                <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>{countryName(r.country_id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="empty-state">
            <div style={{ fontSize:40, opacity:0.2 }}>👥</div>
            <h3>No contacts found</h3>
            <p>Create a new contact to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
