/**
 * SalesList.jsx — Odoo 19.0 field names
 *
 * sale.order fields:
 *   name, state, partner_id, date_order, user_id,
 *   amount_total, currency_id
 *
 * state values: draft | sent | sale | done | cancel
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

// Odoo 19 sale.order state → badge style
const STATE_BADGE = {
  draft:  { label:'Quotation',      color:'var(--text3)',   bg:'var(--surface3)' },
  sent:   { label:'Quotation Sent', color:'var(--info)',    bg:'rgba(52,152,219,0.15)' },
  sale:   { label:'Sales Order',    color:'var(--success)', bg:'rgba(46,204,113,0.15)' },
  done:   { label:'Locked',         color:'var(--text2)',   bg:'var(--surface3)' },
  cancel: { label:'Cancelled',      color:'var(--danger)',  bg:'rgba(231,76,60,0.15)' },
}

export default function SalesList({ stateFilter, title }) {
  const navigate  = useNavigate()
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const pageSize = 80

  const filter = stateFilter ? (r => stateFilter.includes(r.state)) : undefined
  const { records, total, loading } = useRecordList('sale.order', {
    filter,
    sortKey: 'date_order', sortDir: 'desc',
    search, searchFields: ['name'],
    page, pageSize,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/sales/quotations/new')}
        title={title} showGear
        searchValue={search} onSearchChange={setSearch}
        activeFilters={[{ label:'My Quotations', onRemove:()=>{} }]}
        currentPage={page} totalCount={total} pageSize={pageSize}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => p + 1)}
        views={['list','kanban','map','calendar','pivot','graph','activity']}
        activeView="list"
      />

      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}>
                <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
              </th>
              {[
                ['Number',        '18%'],
                ['Creation Date', '15%'],
                ['Customer',      '20%'],
                ['Salesperson',   '15%'],
                ['Activities',    '8%' ],
                ['Total',         '12%'],
                ['Status',        '12%'],
              ].map(([h, w]) => (
                <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', width:w, borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const badge = STATE_BADGE[r.state] || STATE_BADGE.draft
              // partner lookup — in our seed partner_id is stored as an ID string
              return (
                <tr key={r.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                  onClick={() => navigate(`/erp/sales/quotations/${r.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding:'0 12px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
                  </td>
                  {/* name — Order Reference */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--teal)', fontWeight:500 }}>{r.name}</td>
                  {/* date_order */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>
                    {r.date_order ? new Date(r.date_order).toLocaleDateString('en-US',{ month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}
                  </td>
                  {/* partner_id → we display name or partner_name for quick display */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)' }}>
                    <PartnerCell partnerId={r.partner_id} />
                  </td>
                  {/* user_id (Salesperson) */}
                  <td style={{ padding:'8px 10px', fontSize:13 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>O</div>
                      <span style={{ fontSize:13, color:'var(--text2)' }}>Admin</span>
                    </div>
                  </td>
                  {/* Activities */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)', textAlign:'center' }}>
                    <span style={{ fontSize:13, color:'var(--text3)' }}>⏱</span>
                  </td>
                  {/* amount_total */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', textAlign:'right', fontWeight:500 }}>
                    {r.amount_total != null ? `${Number(r.amount_total).toFixed(3)} د.ا` : '0.000 د.ا'}
                  </td>
                  {/* state badge */}
                  <td style={{ padding:'8px 10px' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:badge.bg, color:badge.color }}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="empty-state">
            <div style={{ fontSize:40, opacity:0.2 }}>🛍️</div>
            <h3>No {title?.toLowerCase()} found</h3>
            <p>Create a new quotation to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper to show partner name without prop-drilling the full list
function PartnerCell({ partnerId }) {
  const [name, setName] = useState(null)
  if (!name && partnerId) {
    import('@data/db.js').then(db => db.getRecord('res.partner', partnerId).then(p => { if (p) setName(p.name) }))
  }
  return <span>{name || '—'}</span>
}
