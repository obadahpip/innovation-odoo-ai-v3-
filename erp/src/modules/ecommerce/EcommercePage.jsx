/**
 * EcommercePage.jsx — eCommerce Products
 * Odoo 19.0 model: product.template
 * Route base: /erp/ecommerce
 * Sub-nav: ['Products', 'Orders', 'eCommerce', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'published':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'unpublished':{label:'Unpublished',color:'var(--text3)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'name',label:'Product',width:'28%'},
  {key:'list_price',label:'Sales Price',width:'14%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'standard_price',label:'Cost',width:'12%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'qty_available',label:'On Hand',width:'10%'},
  {key:'website_published',label:'Online',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = null

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function EcommercePage() {
  return (
    <GenericList
      model="product.template"
      title="eCommerce Products"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/ecommerce/new"
      formPath="/erp/ecommerce/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🛒"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function EcommerceForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="product.template" id={id}
      defaults={DEFAULTS}
      title="eCommerce Product"
      backPath="/erp/ecommerce" backLabel="eCommerce Products"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Product Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Sales Price'><input type='number' className='o-input' value={record?.list_price||0} onChange={e=>setField('list_price',parseFloat(e.target.value)||0)}/></FieldRow>
          <FieldRow label='Cost'><input type='number' className='o-input' value={record?.standard_price||0} onChange={e=>setField('standard_price',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default EcommercePage
