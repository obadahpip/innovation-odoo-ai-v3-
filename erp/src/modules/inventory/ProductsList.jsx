/**
 * ProductsList.jsx — product.template list
 * Odoo 19.0 fields: name, type, list_price, standard_price, qty_available,
 *   uom_id, active, default_code, sale_ok, purchase_ok, tracking
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

const TYPE_MAP = {
  product: { label:'Storable',    color:'var(--teal)',    bg:'rgba(0,181,181,0.15)' },
  consu:   { label:'Consumable',  color:'var(--info)',    bg:'rgba(52,152,219,0.15)' },
  service: { label:'Service',     color:'var(--success)', bg:'rgba(46,204,113,0.15)' },
}

export default function ProductsList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 80

  const { records, total, loading } = useRecordList('product.template', {
    filter: r => r.active !== false,
    sortKey: 'name',
    search, searchFields: ['name', 'default_code'],
    page, pageSize,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/inventory/products/new')}
        title="Products" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={page} totalCount={total} pageSize={pageSize}
        onPrev={() => setPage(p => Math.max(1, p-1))}
        onNext={() => setPage(p => p+1)}
        views={['list','kanban']} activeView="list"
      />
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, background:'var(--bg)', zIndex:2 }}>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th style={{ width:40, padding:'8px 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></th>
              {[['Product','30%'],['Reference','14%'],['Sales Price','13%'],['Cost','12%'],['Type','12%'],['On Hand','10%']].map(([h,w])=>(
                <th key={h} style={{ padding:'8px 10px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.4px', width:w, textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const typeStyle = TYPE_MAP[r.type] || TYPE_MAP.consu
              return (
                <tr key={r.id} style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{ padding:'0 12px' }}><div style={{ width:15, height:15, borderRadius:3, border:'1.5px solid var(--border2)' }}/></td>
                  <td style={{ padding:'8px 10px' }}>
                    <div style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{r.name}</div>
                    {r.description_sale && <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{r.description_sale.slice(0,60)}...</div>}
                  </td>
                  <td style={{ padding:'8px 10px', fontSize:12, color:'var(--text3)' }}>{r.default_code||'—'}</td>
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text)', textAlign:'right' }}>{(r.list_price||0).toFixed(3)} د.ا</td>
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)', textAlign:'right' }}>{(r.standard_price||0).toFixed(3)} د.ا</td>
                  <td style={{ padding:'8px 10px' }}>
                    <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:typeStyle.bg, color:typeStyle.color }}>
                      {typeStyle.label}
                    </span>
                  </td>
                  <td style={{ padding:'8px 10px', fontSize:13, color:'var(--text2)', textAlign:'right' }}>{r.qty_available||0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="empty-state"><div style={{fontSize:40,opacity:0.2}}>📦</div><h3>No products found</h3></div>
        )}
      </div>
    </div>
  )
}
