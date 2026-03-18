/**
 * EcommercePage.jsx — eCommerce module
 * Lesson 35: eCommerce
 * Selectors: app-website, create-button, field-amount, field-name, list-row, save-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge, PublishToggle } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

async function seedProducts() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('product.template')
  if (existing.length > 0) return
  const products = [
    { name: 'Acoustic Bloc Screens',   list_price: 2950.00, qty_available: 48, is_published: true,  categ_id: 'All / Saleable', type: 'storable' },
    { name: 'Bin Cushion Cover',        list_price: 45.50,   qty_available: 120, is_published: true, categ_id: 'All / Saleable', type: 'storable' },
    { name: 'Corner Desk Right Sit',    list_price: 890.00,  qty_available: 15, is_published: true,  categ_id: 'All / Saleable', type: 'storable' },
    { name: 'Design Chair Black/White', list_price: 247.00,  qty_available: 32, is_published: false, categ_id: 'All / Saleable', type: 'storable' },
    { name: 'iPad Retina Display',      list_price: 2199.00, qty_available: 7,  is_published: true,  categ_id: 'All / Saleable', type: 'storable' },
    { name: 'VOIP Phone',              list_price: 129.99,  qty_available: 43, is_published: true,  categ_id: 'All / Saleable', type: 'storable' },
  ]
  for (const p of products) await createRecord('product.template', p)
}

export function EcommercePage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('product.template', { sortKey: 'name' })

  useEffect(() => { seedProducts().then(reload) }, [])

  const columns = [
    { key: 'name',          label: 'Product',    style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'list_price',    label: 'Price',      render: v => v ? `$${Number(v).toFixed(2)}` : '—' },
    { key: 'qty_available', label: 'On Hand',    style: { color: 'var(--text2)' } },
    { key: 'type',          label: 'Type',       render: v => <StatusBadge label={v || 'storable'} color="var(--info,#17a2b8)" /> },
    { key: 'is_published',  label: 'Published',  render: v => <StatusBadge label={v ? 'Yes' : 'No'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader
          title="Products"
          onNew={() => navigate('/erp/ecommerce/new')}
          extra={
            <button
              data-erp="app-website"
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => navigate('/erp/website')}
            >
              🌐 Go to Website
            </button>
          }
        />
        <GenericList
          columns={columns}
          rows={records}
          onRowClick={row => navigate(`/erp/ecommerce/${row.id}`)}
        />
      </div>
    </WebsiteShell>
  )
}

export function EcommerceForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', list_price: '', standard_price: '', type: 'storable',
    categ_id: '', description_sale: '', is_published: false,
    website_published: false,
  })
  const [published, setPublished] = useState(false)
  const [tab, setTab] = useState('General')

  useEffect(() => {
    if (!isNew) {
      getRecord('product.template', id).then(r => {
        if (r) { setVals(r); setPublished(r.is_published) }
      })
    }
  }, [id])

  const handleSave = async () => {
    const data = { ...vals, is_published: published }
    if (isNew) await createRecord('product.template', data)
    else       await updateRecord('product.template', id, data)
    navigate('/erp/ecommerce')
  }

  const generalFields = [
    { key: 'name',           label: 'Product Name',  required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'type',           label: 'Product Type',  type: 'select', options: ['storable','consumable','service'], dataErp: 'field-type' },
    { key: 'categ_id',       label: 'Category',      placeholder: 'All / Saleable' },
    { key: 'list_price',     label: 'Sales Price',   type: 'number', placeholder: '0.00', dataErp: 'field-amount' },
    { key: 'standard_price', label: 'Cost',          type: 'number', placeholder: '0.00', dataErp: 'field-amount' },
  ]
  const descFields = [
    { key: 'description_sale', label: 'Sales Description', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          fields={tab === 'General' ? generalFields : tab === 'Sales' ? descFields : []}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/ecommerce')}
          tabs={['General', 'Sales', 'Variants', 'eCommerce']}
          activeTab={tab}
          onTabChange={setTab}
          extra={
            <PublishToggle published={published} onToggle={() => setPublished(p => !p)} />
          }
        />
      </div>
    </WebsiteShell>
  )
}
