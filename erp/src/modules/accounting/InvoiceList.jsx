/**
 * InvoiceList.jsx — Odoo 19.0 field names
 *
 * account.move fields:
 *   name, move_type, state, payment_state, partner_id,
 *   invoice_date, invoice_date_due, amount_total, amount_residual
 *
 * payment_state values: not_paid | in_payment | paid | partial | reversed
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

// Odoo 19 account.move payment_state → badge
const PAYMENT_BADGE = {
  not_paid:  { label:'Not Paid',   color:'var(--danger)',  bg:'rgba(231,76,60,0.15)' },
  in_payment:{ label:'In Payment', color:'var(--info)',    bg:'rgba(52,152,219,0.15)' },
  paid:      { label:'Paid',       color:'var(--success)', bg:'rgba(46,204,113,0.15)' },
  partial:   { label:'Partial',    color:'var(--warning)', bg:'rgba(240,173,78,0.15)' },
  reversed:  { label:'Reversed',   color:'var(--text3)',   bg:'var(--surface3)' },
}

export default function InvoiceList({ moveType = 'out_invoice', title = 'Customer Invoices' }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const pageSize = 80

  const isInvoice = moveType === 'out_invoice'

  // account.move — filter by move_type (Odoo 19 field, replaces old 'type')
  const { records, total, loading } = useRecordList('account.move', {
    filter: r => r.move_type === moveType,
    sortKey: 'invoice_date', sortDir: 'desc',
    search, searchFields: ['name'],
    page, pageSize,
  })

  const newPath = isInvoice ? '/erp/accounting/invoices/new' : '/erp/accounting/bills/new'
  const editPath = id => isInvoice ? `/erp/accounting/invoices/${id}` : `/erp/accounting/bills/${id}`

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate(newPath)}
        title={title} showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={page} totalCount={total} pageSize={pageSize}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => p + 1)}
        views={['list','kanban','pivot','graph','activity']} activeView="list"
      />

      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}>
                <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
              </th>
              {[['Number','18%'],['Customer','22%'],['Invoice Date','14%'],['Due Date','12%'],['Activities','8%'],['Amount Due','12%'],['Status','14%']].map(([h, w]) => (
                <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', width:w, borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const badge = PAYMENT_BADGE[r.payment_state] || PAYMENT_BADGE.not_paid
              return (
                <tr key={r.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                  onClick={() => navigate(editPath(r.id))}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding:'0 12px' }}>
                    <div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }} />
                  </td>
                  {/* name */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--teal)', fontWeight:500 }}>{r.name}</td>
                  {/* partner_id */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)' }}>
                    <PartnerCell partnerId={r.partner_id} />
                  </td>
                  {/* invoice_date */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>
                    {r.invoice_date ? new Date(r.invoice_date).toLocaleDateString() : '—'}
                  </td>
                  {/* invoice_date_due */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)' }}>
                    {r.invoice_date_due ? new Date(r.invoice_date_due).toLocaleDateString() : '—'}
                  </td>
                  {/* Activities */}
                  <td style={{ padding:'8px 10px', textAlign:'center' }}>
                    <span style={{ color:'var(--text3)' }}>⏱</span>
                  </td>
                  {/* amount_residual — Amount Due */}
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', textAlign:'right', fontWeight:500 }}>
                    {r.amount_residual != null ? `${Number(r.amount_residual).toFixed(3)} د.ا` : '0.000 د.ا'}
                  </td>
                  {/* payment_state badge */}
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
        {records.length === 0 && !loading && (
          <div className="empty-state">
            <div style={{ fontSize:40, opacity:0.2 }}>💰</div>
            <h3>No {title?.toLowerCase()} found</h3>
          </div>
        )}
      </div>
    </div>
  )
}

function PartnerCell({ partnerId }) {
  const [name, setName] = useState(null)
  if (!name && partnerId) {
    import('@data/db.js').then(db => db.getRecord('res.partner', partnerId).then(p => { if (p) setName(p.name) }))
  }
  return <span>{name || '—'}</span>
}
