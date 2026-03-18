/**
 * AccountingDashboard.jsx — Accounting overview dashboard
 * Odoo 19.0 model: account.move (invoices & bills)
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listRecords } from '@data/db.js'

export default function AccountingDashboard() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [bills, setBills] = useState([])

  useEffect(() => {
    listRecords('account.move', { filter: r => r.move_type === 'out_invoice' }).then(setInvoices)
    listRecords('account.move', { filter: r => r.move_type === 'in_invoice' }).then(setBills)
  }, [])

  const totalDue = invoices.filter(i => i.payment_state === 'not_paid')
                            .reduce((s, i) => s + (Number(i.amount_total) || 0), 0)
  const totalOverdue = invoices.filter(i => i.payment_state === 'not_paid' && i.invoice_date_due && new Date(i.invoice_date_due) < new Date())
                               .reduce((s, i) => s + (Number(i.amount_total) || 0), 0)

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'24px' }}>
      <h1 style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:24 }}>Accounting</h1>

      {/* KPI Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
        {[
          { label:'Customers Invoices', sub:'To Invoice', amount: totalDue.toFixed(3) + ' د.ا', color:'#00b5b5', path:'/erp/accounting/invoices' },
          { label:'Vendors Bills',      sub:'To Pay',     amount: bills.reduce((s,b)=>s+(Number(b.amount_total)||0),0).toFixed(3)+' د.ا', color:'#e07a5f', path:'/erp/accounting/bills' },
          { label:'Cash',               sub:'Balance',    amount: '0.000 د.ا', color:'#81b29a', path:'/erp/accounting' },
          { label:'Bank',               sub:'Balance',    amount: '0.000 د.ا', color:'#457b9d', path:'/erp/accounting' },
        ].map(card => (
          <div key={card.label} onClick={() => navigate(card.path)}
            style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 20px', cursor:'pointer', transition:'box-shadow var(--t)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ fontSize:12, color:'var(--text3)', marginBottom:4 }}>{card.sub}</div>
            <div style={{ fontSize:22, fontWeight:700, color:card.color, marginBottom:4 }}>{card.amount}</div>
            <div style={{ fontSize:13, color:'var(--text2)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:12, marginBottom:32 }}>
        {[
          { icon:'📋', label:'New Invoice',    path:'/erp/accounting/invoices/new' },
          { icon:'🧾', label:'New Bill',       path:'/erp/accounting/bills/new' },
          { icon:'💰', label:'Register Payment', path:'/erp/accounting/invoices' },
        ].map(btn => (
          <button key={btn.label} onClick={() => navigate(btn.path)} style={{
            display:'flex', alignItems:'center', gap:8, padding:'8px 16px',
            background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6,
            cursor:'pointer', color:'var(--text)', fontSize:13, fontFamily:'inherit',
            transition:'background var(--t)',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--surface)'}>
            <span>{btn.icon}</span> {btn.label}
          </button>
        ))}
      </div>

      {/* Recent invoices */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:600, color:'var(--text)' }}>Recent Invoices</span>
          <button onClick={() => navigate('/erp/accounting/invoices')} style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer' }}>View all →</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <tbody>
            {invoices.slice(0, 5).map(inv => (
              <tr key={inv.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                onClick={() => navigate(`/erp/accounting/invoices/${inv.id}`)}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'10px 20px', fontSize:13, color:'var(--teal)', fontWeight:500, width:'20%' }}>{inv.name}</td>
                <td style={{ padding:'10px 16px', fontSize:13, color:'var(--text2)', width:'25%' }}>{inv.partner_id}</td>
                <td style={{ padding:'10px 16px', fontSize:13, color:'var(--text2)', width:'18%' }}>{inv.invoice_date || '—'}</td>
                <td style={{ padding:'10px 16px', fontSize:13, fontWeight:500, textAlign:'right', width:'17%' }}>{Number(inv.amount_total||0).toFixed(3)} د.ا</td>
                <td style={{ padding:'10px 16px', width:'15%' }}>
                  <span style={{
                    display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600,
                    background: inv.payment_state==='paid' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                    color:       inv.payment_state==='paid' ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {inv.payment_state === 'paid' ? 'Paid' : 'Not Paid'}
                  </span>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr><td colSpan={5} style={{ padding:'24px', textAlign:'center', color:'var(--text3)' }}>No invoices yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
