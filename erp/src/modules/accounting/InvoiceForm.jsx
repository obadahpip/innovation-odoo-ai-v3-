/**
 * InvoiceForm.jsx — Odoo 19.0 field names
 *
 * account.move fields used:
 *   name, move_type, state, payment_state, partner_id,
 *   invoice_date, invoice_date_due, invoice_payment_term_id,
 *   invoice_line_ids (One2many of product lines), line_ids (all lines),
 *   journal_id, currency_id, amount_untaxed, amount_tax,
 *   amount_total, amount_residual, narration (terms), ref, invoice_user_id
 *
 * account.move.line fields used:
 *   name, account_id, product_id, quantity, price_unit, discount,
 *   tax_ids, price_subtotal, price_total, display_type
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord } from '@data/useRecord.js'
import { listRecords, generateId } from '@data/db.js'
import Chatter from '@shell/Chatter.jsx'

const DEFAULTS = {
  // account.move fields
  name:                    'INV/2026/00001',
  move_type:               'out_invoice',   // out_invoice | in_invoice | out_refund | in_refund
  state:                   'draft',          // draft | posted | cancel
  payment_state:           'not_paid',       // not_paid | in_payment | paid | partial
  partner_id:              null,
  invoice_date:            '',
  invoice_date_due:        '',
  invoice_payment_term_id: null,
  invoice_line_ids:        [],               // product lines only (what users see)
  journal_id:              null,
  currency_id:             'JOD',
  amount_untaxed:          0,
  amount_tax:              0,
  amount_total:            0,
  amount_residual:         0,
  narration:               '',              // Terms and Conditions (was 'note' in old API)
  ref:                     '',              // Payment Reference
  invoice_user_id:         'user-admin',
}

export default function InvoiceForm({ moveType }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, setFields, save } = useRecord(
    'account.move', !id || id === 'new' ? null : id,
    { ...DEFAULTS, move_type: moveType || DEFAULTS.move_type }
  )

  const [partners,    setPartners]    = useState([])
  const [partnerDrop, setPartnerDrop] = useState(false)
  const [partnerQ,    setPartnerQ]    = useState('')
  const [tab,         setTab]         = useState('invoice_lines')
  const [messages,    setMessages]    = useState([
    { id:1, author:'obadah abuodah', body:'Creating a new record...', date:new Date().toISOString(), type:'note' }
  ])

  useEffect(() => {
    listRecords('res.partner').then(setPartners)
  }, [])

  const isInvoice = (record?.move_type || moveType) === 'out_invoice' || (record?.move_type || moveType) === 'out_refund'

  // invoice_line_ids (product lines)
  const lines   = record?.invoice_line_ids || []
  const untaxed = lines.filter(l => l.display_type !== 'line_section' && l.display_type !== 'line_note')
                       .reduce((s, l) => s + (Number(l.price_subtotal) || 0), 0)
  const tax     = 0
  const total   = untaxed + tax

  const handleSave = async () => {
    setFields({ amount_untaxed: untaxed, amount_tax: tax, amount_total: total, amount_residual: total })
    const s = await save()
    const base = isInvoice ? '/erp/accounting/invoices' : '/erp/accounting/bills'
    if (!id || id === 'new') navigate(`${base}/${s.id}`, { replace:true })
  }

  const handleConfirm = async () => {
    // Posting sets state='posted' and generates the invoice number
    setField('state', 'posted')
    setTimeout(handleSave, 50)
  }

  // invoice_line_ids CRUD
  const addLine = () => {
    setField('invoice_line_ids', [...lines, {
      id: generateId(),
      // account.move.line fields (Odoo 19)
      name:          '',             // Char — Label
      account_id:    '400101 Sales Account', // Many2one(account.account)
      product_id:    null,           // Many2one(product.product)
      quantity:      1,              // Float (NOT product_uom_qty like in sale.order.line!)
      price_unit:    0,              // Float
      discount:      0,              // Float
      tax_ids:       [],             // Many2many(account.tax) (NOT tax_id like sale.order.line!)
      price_subtotal: 0,             // Monetary (computed)
      price_total:   0,              // Monetary (computed, includes tax)
      display_type:  'product',      // 'product' | 'line_section' | 'line_note'
    }])
  }

  const updateLine = (lineId, key, val) => {
    const updated = lines.map(l => {
      if (l.id !== lineId) return l
      const nl = { ...l, [key]: val }
      if (key === 'quantity' || key === 'price_unit') {
        nl.price_subtotal = Number(key==='quantity'?val:nl.quantity) * Number(key==='price_unit'?val:nl.price_unit)
        nl.price_subtotal = Math.round(nl.price_subtotal * 1000) / 1000
        nl.price_total = nl.price_subtotal // (no tax for now)
      }
      return nl
    })
    setField('invoice_line_ids', updated)
  }

  const selectProduct = async (lineId, productId) => {
    const { getRecord } = await import('@data/db.js')
    const prod = await getRecord('product.template', productId)
    if (!prod) return
    const updated = lines.map(l => l.id === lineId ? {
      ...l,
      product_id: productId,
      name: prod.name,
      price_unit: prod.list_price || 0,
      price_subtotal: (prod.list_price || 0) * l.quantity,
      price_total: (prod.list_price || 0) * l.quantity,
    } : l)
    setField('invoice_line_ids', updated)
  }

  const removeLine = (lineId) => setField('invoice_line_ids', lines.filter(l => l.id !== lineId))

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>

  const selectedPartner  = partners.find(p => p.id === record?.partner_id)
  const filteredPartners = partnerQ
    ? partners.filter(p => p.name?.toLowerCase().includes(partnerQ.toLowerCase()))
    : partners.slice(0, 8)

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

      {/* Action bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer' }}
          onClick={() => navigate(isInvoice?'/erp/accounting/invoices':'/erp/accounting/bills')}>
          {isInvoice ? 'Customer Invoices' : 'Vendor Bills'}
        </button>
        <span style={{ color:'var(--text3)' }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || 'Draft Invoice'}</span>

        {isDirty && <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save manually</button>}

        {/* Confirm button — only in draft */}
        {record?.state === 'draft' && (
          <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleConfirm}>Confirm</button>
        )}
        {record?.state === 'posted' && (
          <button className="btn btn-secondary btn-sm" style={{ marginLeft:8 }}>Register Payment</button>
        )}

        {/* State pills: Draft → Posted */}
        <div style={{ marginLeft:'auto', display:'flex', gap:0 }}>
          {['Draft','Posted'].map((s, i) => {
            const stateMap = { Draft:'draft', Posted:'posted' }
            const isActive = record?.state === stateMap[s]
            return (
              <div key={s} style={{
                padding:'4px 16px', fontSize:12, fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--surface3)' : 'transparent',
                border:`1px solid ${isActive ? 'var(--teal)' : 'var(--border2)'}`,
                borderRadius: i===0 ? '20px 0 0 20px' : '0 20px 20px 0',
                color: isActive ? 'var(--teal)' : 'var(--text3)',
                marginLeft: i > 0 ? -1 : 0,
              }}>{s}</div>
            )
          })}
        </div>

        {/* Chatter buttons */}
        <div style={{ display:'flex', gap:4, marginLeft:12 }}>
          {['Send message','Log note','Activity'].map(t => (
            <button key={t} className="btn btn-secondary btn-sm" style={{ fontSize:11, padding:'2px 8px' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

          {/* Header label + name */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:4 }}>
              {isInvoice ? 'Customer Invoice' : 'Vendor Bill'}
            </div>
            <h1 style={{ fontSize:22, fontWeight:700, color:'var(--text)' }}>{record?.name || 'INV/2026/00001'}</h1>
          </div>

          {/* Fields grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 40px', marginBottom:20 }}>
            <div>
              {/* partner_id */}
              <FieldRow label="Customer">
                <div style={{ position:'relative' }}>
                  <input className="o-input" placeholder="Search a name or Tax ID..."
                    value={partnerQ || selectedPartner?.name || ''}
                    onChange={e => { setPartnerQ(e.target.value); setPartnerDrop(true) }}
                    onFocus={() => setPartnerDrop(true)} />
                  {partnerDrop && (
                    <>
                      <div onClick={() => setPartnerDrop(false)} style={{ position:'fixed', inset:0, zIndex:50 }} />
                      <div style={{ position:'absolute', top:'105%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:6, zIndex:200, boxShadow:'var(--shadow-md)', maxHeight:200, overflowY:'auto' }}>
                        {filteredPartners.map(p => (
                          <div key={p.id} onClick={() => { setField('partner_id', p.id); setPartnerQ(''); setPartnerDrop(false) }}
                            style={{ padding:'7px 12px', fontSize:13, cursor:'pointer', color:'var(--text)' }}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                            onMouseLeave={e=>e.currentTarget.style.background=''}>
                            {p.name}
                          </div>
                        ))}
                        <div style={{ padding:'7px 12px', fontSize:12, color:'var(--teal)', cursor:'pointer' }}>Search more...</div>
                      </div>
                    </>
                  )}
                </div>
                {selectedPartner && (
                  <div style={{ fontSize:12, color:'var(--text2)', marginTop:4, lineHeight:1.6 }}>
                    {[selectedPartner.street, `${selectedPartner.city || ''} ${selectedPartner.state_id || ''} ${selectedPartner.zip || ''}`.trim(), selectedPartner.country_id === 'US' ? 'United States' : selectedPartner.country_id === 'JO' ? 'Jordan' : selectedPartner.country_id].filter(Boolean).join('\n')}
                  </div>
                )}
              </FieldRow>
            </div>
            <div>
              {/* invoice_date */}
              <FieldRow label="Invoice Date">
                <input type="date" className="o-input" value={record?.invoice_date || ''}
                  onChange={e => setField('invoice_date', e.target.value)} style={{ colorScheme:'dark' }} />
              </FieldRow>

              {/* invoice_date_due + invoice_payment_term_id */}
              <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'center', gap:8, marginBottom:10 }}>
                <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>Due Date</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="date" className="o-input" style={{ flex:1, colorScheme:'dark' }}
                    value={record?.invoice_date_due || ''} onChange={e => setField('invoice_date_due', e.target.value)} />
                  <span style={{ fontSize:12, color:'var(--text3)', whiteSpace:'nowrap' }}>or</span>
                  <input className="o-input" style={{ flex:1 }} placeholder="Payment Terms" />
                </div>
              </div>

              {/* Invoice Type (computed from move_type, but shown as field) */}
              <FieldRow label="Invoice Type">
                <select className="o-input" value={record?.move_type || 'out_invoice'} onChange={e => setField('move_type', e.target.value)}>
                  <option value="out_invoice">Customer Invoice</option>
                  <option value="in_invoice">Vendor Bill</option>
                  <option value="out_refund">Credit Note</option>
                  <option value="in_refund">Vendor Credit Note</option>
                </select>
              </FieldRow>
            </div>
          </div>

          {/* Tabs: Invoice Lines | Journal Items | Other Info */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:0 }}>
            {[['invoice_lines','Invoice Lines'],['journal_items','Journal Items'],['other_info','Other Info']].map(([k,label]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding:'8px 16px', background:'none', border:'none', fontFamily:'inherit',
                borderBottom: tab===k ? '2px solid var(--teal)' : '2px solid transparent',
                color: tab===k ? 'var(--text)' : 'var(--text2)',
                fontSize:13, fontWeight: tab===k ? 600 : 400, cursor:'pointer', marginBottom:-1,
              }}>{label}</button>
            ))}
          </div>

          {/* Invoice Lines tab */}
          {tab === 'invoice_lines' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>
                    <th style={{ width:24, padding:'7px 8px' }} />
                    {/* account.move.line column headers */}
                    {['Product','Account','Quantity','Price','Taxes','Amount'].map((h, i) => (
                      <th key={h} style={{ padding:'7px 10px', textAlign:i>=2?'right':'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.3px' }}>{h}</th>
                    ))}
                    <th style={{ width:30 }} />
                  </tr>
                </thead>
                <tbody>
                  {lines.filter(l => l.display_type === 'product' || !l.display_type).map(line => (
                    <InvoiceLineRow
                      key={line.id}
                      line={line}
                      onUpdate={(key, val) => updateLine(line.id, key, val)}
                      onSelectProduct={(pid) => selectProduct(line.id, pid)}
                      onRemove={() => removeLine(line.id)}
                    />
                  ))}
                </tbody>
              </table>

              {/* Add line links */}
              <div style={{ padding:'8px 10px', display:'flex', gap:16 }}>
                {['Add a line','Add a section','Add a note','Catalog'].map(label => (
                  <button key={label} onClick={label === 'Add a line' ? addLine : undefined}
                    style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer', fontFamily:'inherit', padding:0 }}
                    onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                    onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>{label}</button>
                ))}
              </div>

              {/* narration (Terms and Conditions) */}
              <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border)' }}>
                <input className="o-input" style={{ background:'none', border:'none', outline:'none', color:'var(--text3)', fontSize:12 }}
                  placeholder="Terms and Conditions"
                  value={record?.narration || ''} onChange={e => setField('narration', e.target.value)} />
              </div>

              {/* Totals */}
              <div style={{ padding:'12px 16px', display:'flex', justifyContent:'flex-end' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:260 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text2)' }}>
                    <span>Untaxed Amount:</span><span>{untaxed.toFixed(3)} د.ا</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text2)' }}>
                    <span>Total:</span><span>{total.toFixed(3)} د.ا</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700, color:'var(--text)', borderTop:'1px solid var(--border)', paddingTop:6, marginTop:4 }}>
                    {/* amount_residual = Amount Due */}
                    <span>Amount Due:</span><span>{total.toFixed(3)} د.ا</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'other_info' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px', padding:16 }}>
              {/* ref (Payment Reference) */}
              <FieldRow label="Payment Ref.">
                <input className="o-input" value={record?.ref||''} onChange={e=>setField('ref',e.target.value)} placeholder="Payment reference for this invoice" />
              </FieldRow>
              {/* invoice_user_id (Salesperson) */}
              <FieldRow label="Salesperson">
                <input className="o-input" value="obadah abuodah" readOnly />
              </FieldRow>
            </div>
          )}
        </div>

        {/* Chatter */}
        <div style={{ width:320, borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName="account.move" recordId={record?.id} messages={messages}
            onSend={msg => setMessages(m => [...m, msg])} />
        </div>
      </div>
    </div>
  )
}

// ── Invoice line row ──────────────────────────────────────────────
function InvoiceLineRow({ line, onUpdate, onSelectProduct, onRemove }) {
  const [prodDrop, setProdDrop] = useState(false)
  const [products, setProducts] = useState([])
  const [query,    setQuery]    = useState(line.name || '')

  const loadProducts = async () => {
    const recs = await (await import('@data/db.js')).listRecords('product.template', { filter: r => r.active !== false })
    setProducts(recs)
    setProdDrop(true)
  }

  const filtered = query
    ? products.filter(p => p.name?.toLowerCase().includes(query.toLowerCase()))
    : products.slice(0, 10)

  return (
    <tr style={{ borderBottom:'1px solid var(--border)' }}>
      <td style={{ padding:'6px 8px', color:'var(--text3)', cursor:'grab', textAlign:'center' }}>⠿</td>
      {/* product_id + name */}
      <td style={{ padding:'6px 10px' }}>
        <div style={{ position:'relative' }}>
          <input className="o-input" value={query} placeholder="Search a product..."
            onChange={e => { setQuery(e.target.value); onUpdate('name', e.target.value) }}
            onFocus={loadProducts} style={{ fontSize:13 }} />
          {prodDrop && products.length > 0 && (
            <>
              <div onClick={() => setProdDrop(false)} style={{ position:'fixed', inset:0, zIndex:50 }} />
              <div style={{ position:'absolute', top:'105%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:6, zIndex:200, boxShadow:'var(--shadow-md)', maxHeight:200, overflowY:'auto' }}>
                {filtered.map(p => (
                  <div key={p.id} onClick={() => { setQuery(p.name); onSelectProduct(p.id); setProdDrop(false) }}
                    style={{ padding:'7px 12px', fontSize:13, cursor:'pointer', color:'var(--text)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    {p.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <input style={{ width:'100%', background:'none', border:'none', outline:'none', color:'var(--text3)', fontSize:11, fontFamily:'inherit', marginTop:2 }}
          placeholder="Enter a description" value={line.name === query ? '' : line.name}
          onChange={e => onUpdate('name', e.target.value)} />
      </td>
      {/* account_id */}
      <td style={{ padding:'6px 10px', fontSize:12, color:'var(--text2)', textAlign:'center' }}>
        ≡ {line.account_id || '400101 Sales Account'}
      </td>
      {/* quantity (note: NOT product_uom_qty — Odoo invoice lines use 'quantity') */}
      <td style={{ padding:'6px 10px', textAlign:'right' }}>
        <input type="number" className="o-input" value={line.quantity}
          onChange={e => onUpdate('quantity', parseFloat(e.target.value) || 0)}
          style={{ textAlign:'right', width:70 }} />
      </td>
      {/* price_unit */}
      <td style={{ padding:'6px 10px', textAlign:'right' }}>
        <input type="number" className="o-input" value={line.price_unit}
          onChange={e => onUpdate('price_unit', parseFloat(e.target.value) || 0)}
          style={{ textAlign:'right', width:80 }} />
      </td>
      {/* tax_ids badge (Odoo 19: tax_ids, not tax_id like in sale.order.line) */}
      <td style={{ padding:'6px 10px', textAlign:'right' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'1px 6px', borderRadius:4, fontSize:11, background:'rgba(231,76,60,0.15)', color:'var(--danger)' }}>
          0% EX <span style={{ cursor:'pointer' }}>×</span>
        </span>
      </td>
      {/* price_subtotal */}
      <td style={{ padding:'6px 10px', textAlign:'right', fontSize:13, color:'var(--text)', fontWeight:500 }}>
        {Number(line.price_subtotal).toFixed(3)} د.ا
      </td>
      <td style={{ padding:'6px 8px', textAlign:'center' }}>
        <button onClick={onRemove} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:16 }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--danger)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>🗑</button>
      </td>
    </tr>
  )
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'start', gap:8, marginBottom:10 }}>
      <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500, paddingTop:5 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}
