/**
 * SaleForm.jsx — Odoo 19.0 field names
 *
 * sale.order fields used:
 *   name, state, partner_id, date_order, validity_date, pricelist_id,
 *   payment_term_id, order_line (One2many), user_id, note,
 *   amount_untaxed, amount_tax, amount_total, currency_id
 *
 * sale.order.line fields:
 *   order_id, name, product_id, product_uom_qty, product_uom,
 *   price_unit, discount, tax_id, price_subtotal, display_type
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord } from '@data/useRecord.js'
import { listRecords, generateId } from '@data/db.js'
import Chatter from '@shell/Chatter.jsx'

// sale.order.state → readable label
const STATE_LABEL = { draft:'Quotation', sent:'Quotation Sent', sale:'Sales Order', done:'Locked', cancel:'Cancelled' }
const STAGES = ['Quotation', 'Quotation Sent', 'Sales Order']
const STATE_STAGE_IDX = { draft:0, sent:1, sale:2, done:2, cancel:0 }

const PAYMENT_TERMS = [
  { id:'immediate', name:'Immediate Payment' },
  { id:'net15',     name:'15 Days' },
  { id:'net21',     name:'21 Days' },
  { id:'net30',     name:'30 Days' },
  { id:'net45',     name:'45 Days' },
  { id:'eom',       name:'End of Following Month' },
  { id:'10eom',     name:'10 Days after End of Next Month' },
  { id:'30n60',     name:'30% Now, Balance 60 Days' },
]

const DEFAULTS = {
  name: 'New', state: 'draft',
  partner_id: null,    // Many2one(res.partner)
  date_order: new Date().toISOString(),
  validity_date: new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
  pricelist_id: 'Default (JOD)',
  payment_term_id: 'immediate',   // Many2one(account.payment.term)
  order_line: [],                  // One2many(sale.order.line)
  user_id: 'user-admin',
  note: '',
  amount_untaxed: 0,
  amount_tax: 0,
  amount_total: 0,
  currency_id: 'JOD',
}

export default function SaleForm() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { record, loading, isDirty, setField, setFields, save } = useRecord(
    'sale.order', !id || id === 'new' ? null : id, DEFAULTS
  )

  const [partners,    setPartners]    = useState([])
  const [partnerDrop, setPartnerDrop] = useState(false)
  const [partnerQ,    setPartnerQ]    = useState('')
  const [payTermDrop, setPayTermDrop] = useState(false)
  const [activeTab,   setActiveTab]   = useState('lines')
  const [messages,    setMessages]    = useState([
    { id:1, author:'obadah abuodah', body:'Creating a new record...', date: new Date().toISOString(), type:'note' }
  ])

  useEffect(() => {
    listRecords('res.partner').then(setPartners)
  }, [])

  // sale.order.line calculations
  const lines     = record?.order_line || []
  const untaxed   = lines.reduce((s, l) => s + (Number(l.price_subtotal) || 0), 0)
  const taxAmount = 0
  const total     = untaxed + taxAmount

  const handleSave = async () => {
    const updated = { ...record, amount_untaxed: untaxed, amount_tax: taxAmount, amount_total: total }
    setFields({ amount_untaxed: untaxed, amount_tax: taxAmount, amount_total: total })
    const s = await save()
    if (!id || id === 'new') navigate(`/erp/sales/quotations/${s.id}`, { replace:true })
  }

  const handleConfirm = async () => {
    const seqNum = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
    setFields({
      state: 'sale',
      name:  record?.name?.startsWith('S') && record.name !== 'New' ? record.name : `S${seqNum}`,
    })
    setTimeout(handleSave, 50)
  }

  const handleSend = async () => {
    const newMsg = {
      id: Date.now(),
      author: 'obadah abuodah',
      body: `Hello,\n\nYour quotation ${record?.name} amounting in ${total.toFixed(3)} د.ا is ready for review.\n\nDo not hesitate to contact us if you have any questions.\n--\nAdministrator`,
      date: new Date().toISOString(),
      type: 'message',
    }
    setMessages(m => [...m, newMsg])
    setField('state', 'sent')
    setTimeout(handleSave, 50)
  }

  // sale.order.line CRUD
  const addLine = () => {
    setField('order_line', [...lines, {
      id: generateId(),
      // sale.order.line fields (Odoo 19)
      name: '',            // Text — Description
      product_id: null,   // Many2one(product.product)
      product_uom_qty: 1, // Float — Ordered Qty
      product_uom: 'unit',// Many2one(uom.uom)
      price_unit: 0,      // Float — Unit Price
      discount: 0,        // Float — Discount %
      tax_id: [],          // Many2many(account.tax)
      price_subtotal: 0,  // Monetary (computed)
      display_type: false, // 'line_section' | 'line_note' | false
    }])
  }

  const updateLine = (lineId, key, val) => {
    const updated = lines.map(l => {
      if (l.id !== lineId) return l
      const nl = { ...l, [key]: val }
      // Recompute price_subtotal from product_uom_qty * price_unit
      if (key === 'product_uom_qty' || key === 'price_unit') {
        nl.price_subtotal = Number(key === 'product_uom_qty' ? val : nl.product_uom_qty)
                          * Number(key === 'price_unit' ? val : nl.price_unit)
        nl.price_subtotal = Math.round(nl.price_subtotal * 1000) / 1000
      }
      return nl
    })
    setField('order_line', updated)
  }

  const selectProduct = async (lineId, productId) => {
    const { getRecord } = await import('@data/db.js')
    const prod = await getRecord('product.template', productId)
    if (!prod) return
    updateLine(lineId, 'product_id', productId)
    const updated = lines.map(l => l.id === lineId ? {
      ...l,
      product_id: productId,
      name: prod.name,
      price_unit: prod.list_price || 0,
      product_uom: prod.uom_id || 'unit',
      price_subtotal: (prod.list_price || 0) * l.product_uom_qty,
    } : l)
    setField('order_line', updated)
  }

  const removeLine = (lineId) => setField('order_line', lines.filter(l => l.id !== lineId))

  if (loading) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>

  const stageIdx = STATE_STAGE_IDX[record?.state] ?? 0
  const filteredPartners = partnerQ
    ? partners.filter(p => p.name?.toLowerCase().includes(partnerQ.toLowerCase()))
    : partners.slice(0, 8)
  const selectedPartner = partners.find(p => p.id === record?.partner_id)
  const selectedPayTerm = PAYMENT_TERMS.find(t => t.id === record?.payment_term_id)

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

      {/* Action bar */}
      <div style={{ height:46, background:'var(--surface)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', padding:'0 12px', gap:6, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12, color:'var(--teal)', background:'none', border:'none', cursor:'pointer', padding:0 }} onClick={() => navigate('/erp/sales/quotations')}>Quotations</button>
        <span style={{ color:'var(--text3)', fontSize:12 }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{record?.name || 'New'}</span>
        {isDirty && <><span style={{ fontSize:13, color:'var(--text3)', cursor:'pointer' }}>💾</span><span style={{ fontSize:13, color:'var(--danger)', cursor:'pointer', marginLeft:4 }} onClick={() => {}}>✕</span></>}

        {/* Action buttons */}
        <div style={{ display:'flex', gap:6, marginLeft:16 }}>
          {record?.state !== 'sale' && record?.state !== 'done' && (
            <button className="btn btn-primary btn-sm" onClick={handleSend}>Send</button>
          )}
          <button className="btn btn-secondary btn-sm">Print</button>
          {record?.state === 'draft' || record?.state === 'sent' ? (
            <button className="btn btn-primary btn-sm" onClick={handleConfirm}>Confirm</button>
          ) : null}
          <button className="btn btn-secondary btn-sm">Preview</button>
          {record?.state && record.state !== 'cancel' && (
            <button className="btn btn-secondary btn-sm">Cancel</button>
          )}
        </div>

        {/* Stage pills (Quotation → Quotation Sent → Sales Order) */}
        <div style={{ marginLeft:'auto', display:'flex', gap:0 }}>
          {STAGES.map((s, i) => {
            const isActive = i === stageIdx
            const isPast   = i < stageIdx
            return (
              <div key={s} style={{
                padding:'3px 16px 3px 14px', fontSize:12, fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--surface3)' : 'transparent',
                border:`1px solid ${isActive ? 'var(--teal)' : 'var(--border2)'}`,
                borderRadius: i===0 ? '20px 0 0 20px' : i===STAGES.length-1 ? '0 20px 20px 0' : 0,
                color: isActive ? 'var(--teal)' : isPast ? 'var(--text2)' : 'var(--text3)',
                marginLeft: i > 0 ? -1 : 0,
              }}>
                {s} {i < STAGES.length-1 ? '›' : ''}
              </div>
            )
          })}
        </div>

        {/* Chatter buttons */}
        <div style={{ display:'flex', gap:4, marginLeft:16 }}>
          {['Send message','Log note','Activity'].map(t => (
            <button key={t} className="btn btn-primary btn-sm" style={{ fontSize:11, padding:'2px 8px' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* Form (65%) */}
        <div style={{ flex:'0 0 65%', overflowY:'auto', padding:'20px 24px' }}>

          <h1 style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:20 }}>
            {record?.name || 'New'}
          </h1>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 40px', marginBottom:24 }}>
            {/* Left */}
            <div>
              {/* partner_id */}
              <div style={{ marginBottom:10 }}>
                <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500, display:'block', marginBottom:2 }}>Customer</label>
                <div style={{ position:'relative' }}>
                  <input className="o-input" placeholder="Type to find a customer..."
                    value={partnerQ || selectedPartner?.name || ''}
                    onChange={e => { setPartnerQ(e.target.value); setPartnerDrop(true) }}
                    onFocus={() => setPartnerDrop(true)}
                  />
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
                    {[selectedPartner.street, selectedPartner.city && `${selectedPartner.city} ${selectedPartner.state_id || ''} ${selectedPartner.zip || ''}`.trim(), selectedPartner.country_id === 'US' ? 'United States' : selectedPartner.country_id].filter(Boolean).join('\n')}
                  </div>
                )}
              </div>
            </div>

            {/* Right — validity_date, pricelist_id, payment_term_id */}
            <div>
              <FieldRow label="Expiration">
                <input type="date" className="o-input" value={record?.validity_date || ''}
                  onChange={e => setField('validity_date', e.target.value)} style={{ colorScheme:'dark' }} />
              </FieldRow>

              <FieldRow label="Pricelist">
                <select className="o-input"><option>Default (JOD)</option></select>
              </FieldRow>

              {/* payment_term_id */}
              <div style={{ position:'relative', marginBottom:10 }}>
                <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'center', gap:8 }}>
                  <label style={{ fontSize:12, color:'var(--text2)', fontWeight:500 }}>Payment Terms</label>
                  <div style={{ position:'relative' }}>
                    <input className="o-input" value={selectedPayTerm?.name || 'Immediate Payment'} readOnly
                      onClick={() => setPayTermDrop(o => !o)} style={{ cursor:'pointer' }} />
                    {payTermDrop && (
                      <>
                        <div onClick={() => setPayTermDrop(false)} style={{ position:'fixed', inset:0, zIndex:50 }} />
                        <div style={{ position:'absolute', top:'105%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:6, zIndex:200, boxShadow:'var(--shadow-md)', maxHeight:220, overflowY:'auto' }}>
                          {PAYMENT_TERMS.map(t => (
                            <div key={t.id} onClick={() => { setField('payment_term_id', t.id); setPayTermDrop(false) }}
                              style={{ padding:'7px 12px', fontSize:13, cursor:'pointer', color:'var(--text)', background: t.id === record?.payment_term_id ? 'var(--surface2)' : '' }}
                              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                              onMouseLeave={e=>e.currentTarget.style.background=''}>
                              {t.name}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Order Lines | Other Info */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:0 }}>
            {[['lines','Order Lines'],['other','Other Info']].map(([k,label]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={{
                padding:'8px 16px', background:'none', border:'none', fontFamily:'inherit',
                borderBottom: activeTab===k ? '2px solid var(--teal)' : '2px solid transparent',
                color: activeTab===k ? 'var(--text)' : 'var(--text2)',
                fontSize:13, fontWeight: activeTab===k ? 600 : 400, cursor:'pointer', marginBottom:-1,
              }}>{label}</button>
            ))}
          </div>

          {/* Order Lines tab */}
          {activeTab === 'lines' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>
                    <th style={{ width:24, padding:'7px 8px' }} />
                    {/* sale.order.line column headers */}
                    {['Product','Quantity','Unit Price','Taxes','Amount'].map((h, i) => (
                      <th key={h} style={{ padding:'7px 10px', textAlign:i>=1?'right':'left', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.3px' }}>{h}</th>
                    ))}
                    <th style={{ width:30 }} />
                  </tr>
                </thead>
                <tbody>
                  {lines.map(line => (
                    <OrderLineRow
                      key={line.id}
                      line={line}
                      onUpdate={(key, val) => updateLine(line.id, key, val)}
                      onSelectProduct={(pid) => selectProduct(line.id, pid)}
                      onRemove={() => removeLine(line.id)}
                    />
                  ))}
                </tbody>
              </table>

              {/* Add links */}
              <div style={{ padding:'8px 10px', display:'flex', gap:16 }}>
                {['Add a product','Add a section','Add a note','Catalog'].map(label => (
                  <button key={label} onClick={label === 'Add a product' ? addLine : undefined}
                    style={{ background:'none', border:'none', color:'var(--teal)', fontSize:12, cursor:'pointer', fontFamily:'inherit', padding:0 }}
                    onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                    onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>{label}</button>
                ))}
              </div>

              {/* note (terms and conditions) */}
              <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border)' }}>
                <input className="o-input" style={{ background:'none', border:'none', outline:'none', color:'var(--text3)', fontSize:12 }}
                  placeholder="Terms and conditions..."
                  value={record?.note || ''} onChange={e => setField('note', e.target.value)} />
              </div>

              {/* Totals */}
              <div style={{ padding:'12px 16px', display:'flex', justifyContent:'flex-end' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:260 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text2)' }}>
                    <span>Untaxed Amount:</span><span>{untaxed.toFixed(3)} د.ا</span>
                  </div>
                  {taxAmount > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--text2)' }}>
                      <span>Tax 0%:</span><span>{taxAmount.toFixed(3)} د.ا</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, color:'var(--text)', borderTop:'1px solid var(--border)', paddingTop:6, marginTop:4 }}>
                    <span>Total:</span><span>{total.toFixed(3)} د.ا</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'other' && (
            <div style={{ border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 6px 6px', padding:16 }}>
              <FieldRow label="Customer Ref">
                <input className="o-input" value={record?.client_order_ref||''} onChange={e=>setField('client_order_ref',e.target.value)} />
              </FieldRow>
              <FieldRow label="Source Document">
                <input className="o-input" value={record?.origin||''} onChange={e=>setField('origin',e.target.value)} />
              </FieldRow>
            </div>
          )}
        </div>

        {/* Chatter (35%) */}
        <div style={{ flex:'0 0 35%', borderLeft:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <Chatter modelName="sale.order" recordId={record?.id} messages={messages}
            onSend={msg => setMessages(m => [...m, msg])} />
        </div>
      </div>
    </div>
  )
}

// ── Order line row ────────────────────────────────────────────────
function OrderLineRow({ line, onUpdate, onSelectProduct, onRemove }) {
  const [prodDrop, setProdDrop] = useState(false)
  const [products, setProducts] = useState([])
  const [query,    setQuery]    = useState(line.name || '')

  const loadProducts = async () => {
    const recs = await (await import('@data/db.js')).listRecords('product.template', { filter: r => r.active !== false && r.sale_ok !== false })
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
            onFocus={loadProducts}
            style={{ fontSize:13 }}
          />
          {prodDrop && products.length > 0 && (
            <>
              <div onClick={() => setProdDrop(false)} style={{ position:'fixed', inset:0, zIndex:50 }} />
              <div style={{ position:'absolute', top:'105%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:6, zIndex:200, boxShadow:'var(--shadow-md)', maxHeight:200, overflowY:'auto' }}>
                {filtered.map(p => (
                  <div key={p.id} onClick={() => { setQuery(p.name); onSelectProduct(p.id); setProdDrop(false) }}
                    style={{ padding:'7px 12px', fontSize:13, cursor:'pointer', color:'var(--text)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <div style={{ fontWeight:500 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>{p.default_code || ''} | {(p.list_price || 0).toFixed(2)} د.ا</div>
                  </div>
                ))}
                <div style={{ padding:'7px 12px', fontSize:12, color:'var(--teal)', cursor:'pointer' }}>
                  Create "{query}"...
                </div>
              </div>
            </>
          )}
        </div>
      </td>
      {/* product_uom_qty */}
      <td style={{ padding:'6px 10px', textAlign:'right' }}>
        <input type="number" className="o-input" value={line.product_uom_qty}
          onChange={e => onUpdate('product_uom_qty', parseFloat(e.target.value) || 0)}
          style={{ textAlign:'right', width:70 }} />
      </td>
      {/* price_unit */}
      <td style={{ padding:'6px 10px', textAlign:'right' }}>
        <input type="number" className="o-input" value={line.price_unit}
          onChange={e => onUpdate('price_unit', parseFloat(e.target.value) || 0)}
          style={{ textAlign:'right', width:80 }} />
      </td>
      {/* tax_id badge */}
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
