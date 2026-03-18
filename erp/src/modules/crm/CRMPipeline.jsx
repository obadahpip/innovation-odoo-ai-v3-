/**
 * CRMPipeline.jsx — Odoo 19.0 field names
 * 
 * crm.lead fields used:
 *   name, partner_id, partner_name, contact_name, email_from, phone,
 *   stage_id (Many2one crm.stage), user_id, type, priority (0-3),
 *   probability, expected_revenue, active, tag_ids, date_deadline
 *
 * crm.stage fields: name, sequence, probability, fold
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionBar from '@shell/ActionBar.jsx'
import { useRecordList } from '@data/useRecord.js'
import { createRecord } from '@data/db.js'

export default function CRMPipeline() {
  const navigate  = useNavigate()
  const [view, setView]   = useState('kanban')
  const [search, setSearch] = useState('')
  const [quickAddStage, setQuickAddStage] = useState(null)

  // crm.stage — real Odoo 19 model
  const { records: stages } = useRecordList('crm.stage', { sortKey:'sequence' })

  // crm.lead — real Odoo 19 model
  const { records, reload } = useRecordList('crm.lead', {
    filter: r => r.active !== false && r.type !== 'lead',
    sortKey: '__createdAt', sortDir: 'desc',
  })

  const getStageRecords = (stageId) =>
    records.filter(r =>
      (r.stage_id === stageId) &&
      (!search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.partner_name?.toLowerCase().includes(search.toLowerCase()))
    )

  const getStageSum = (stageId) =>
    getStageRecords(stageId).reduce((s, r) => s + (Number(r.expected_revenue) || 0), 0)

  const handleStageChange = async (leadId, newStageId) => {
    const { updateRecord } = await import('@data/db.js')
    await updateRecord('crm.lead', leadId, { stage_id: newStageId })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/crm/leads/new')}
        title="Pipeline" showGear
        searchValue={search} onSearchChange={setSearch}
        activeFilters={[{ label:'My Pipeline', onRemove:()=>{} }]}
        views={['kanban','list','calendar','pivot','graph','activity','map']}
        activeView={view} onViewChange={setView}
      />

      <div style={{ flex:1, display:'flex', gap:8, padding:'12px 16px', overflowX:'auto', overflowY:'hidden', alignItems:'flex-start' }}>
        {stages.map(stage => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            records={getStageRecords(stage.id)}
            sum={getStageSum(stage.id)}
            quickAdding={quickAddStage === stage.id}
            onQuickAdd={() => setQuickAddStage(stage.id)}
            onCancelQuickAdd={() => setQuickAddStage(null)}
            onCardClick={id => navigate(`/erp/crm/leads/${id}`)}
            onStageChange={handleStageChange}
            onCreated={() => { reload(); setQuickAddStage(null) }}
          />
        ))}
      </div>
    </div>
  )
}

function KanbanColumn({ stage, records, sum, quickAdding, onQuickAdd, onCancelQuickAdd, onCardClick, onStageChange, onCreated }) {
  const [dragOver, setDragOver] = useState(false)
  const [dragId,   setDragId]   = useState(null)

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDrop={() => { if (dragId) { onStageChange(dragId, stage.id); setDragId(null) }; setDragOver(false) }}
      onDragLeave={() => setDragOver(false)}
      style={{
        minWidth:240, width:240, flexShrink:0, display:'flex', flexDirection:'column',
        background: dragOver ? 'rgba(0,181,181,0.06)' : 'var(--surface)',
        border:`1px solid ${dragOver ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius:8, overflow:'hidden', maxHeight:'calc(100vh - 130px)',
        transition:'border-color var(--t)',
      }}>

      {/* Column header */}
      <div style={{ padding:'10px 10px 6px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{stage.name}</span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color:'var(--text2)' }}>{records.length}</span>
            <button onClick={onQuickAdd} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:18, lineHeight:1, padding:'0 2px' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--teal)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>+</button>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:4, borderRadius:2, background:'var(--surface3)' }}>
          <div style={{ height:'100%', width:`${Math.min(stage.probability || 10, 100)}%`, background:`hsl(${(stage.probability||10)*1.2},70%,50%)`, borderRadius:2, transition:'width 0.3s' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:3 }}>
          <span style={{ fontSize:10, color:'var(--text3)' }}>{records.length}</span>
          {sum > 0 && <span style={{ fontSize:10, color:'var(--text2)' }}>{sum.toLocaleString()} د.ا</span>}
        </div>
      </div>

      {/* Quick add form */}
      {quickAdding && (
        <QuickAddCard stageId={stage.id} onCreated={onCreated} onCancel={onCancelQuickAdd} />
      )}

      {/* Cards */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 8px 8px' }}>
        {records.map(r => (
          <LeadCard key={r.id} lead={r} onClick={() => onCardClick(r.id)} onDragStart={() => setDragId(r.id)} />
        ))}
      </div>
    </div>
  )
}

function QuickAddCard({ stageId, onCreated, onCancel }) {
  const [partners, setPartners] = useState([])
  const [partnerQuery, setPartnerQuery] = useState('')
  const [showDrop, setShowDrop]   = useState(false)
  const [name,     setName]       = useState('')
  const [email,    setEmail]      = useState('')
  const [phone,    setPhone]      = useState('')
  const [revenue,  setRevenue]    = useState('0.000')
  const [priority, setPriority]   = useState('0')

  useEffect(() => {
    import('@data/db.js').then(db => db.listRecords('res.partner').then(setPartners))
  }, [])

  const filtered = partnerQuery
    ? partners.filter(p => p.name?.toLowerCase().includes(partnerQuery.toLowerCase()))
    : partners.slice(0, 8)

  const handleAdd = async () => {
    // crm.lead uses: name, partner_name, contact_name, email_from, phone,
    //   stage_id, type, priority, expected_revenue, active
    await createRecord('crm.lead', {
      name: name || `${partnerQuery || 'New'}'s opportunity`,
      partner_name: partnerQuery,
      contact_name: partnerQuery,
      email_from:   email,
      phone:        phone,
      stage_id:     stageId,
      type:         'opportunity',
      priority:     priority,
      expected_revenue: parseFloat(revenue.replace(',','.')) || 0,
      probability:  10,
      active:       true,
    })
    onCreated()
  }

  return (
    <div style={{ margin:'0 8px 8px', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:6, padding:10, flexShrink:0 }}>
      {/* Contact (partner_name in crm.lead) */}
      <div style={{ position:'relative', marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 6px', borderBottom:'1px solid var(--teal)' }}>
          <span style={{ fontSize:11, opacity:0.5 }}>👤</span>
          <input value={partnerQuery} onChange={e => { setPartnerQuery(e.target.value); setShowDrop(true) }} onFocus={() => setShowDrop(true)}
            placeholder="Contact Name" style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit' }} />
        </div>
        {showDrop && filtered.length > 0 && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:4, zIndex:200, boxShadow:'var(--shadow-md)' }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => { setPartnerQuery(p.name); setEmail(p.email||''); setPhone(p.phone||''); setShowDrop(false) }}
                style={{ padding:'6px 10px', fontSize:12, cursor:'pointer', color:'var(--text)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}>
                {p.name}
              </div>
            ))}
            <div style={{ padding:'6px 10px', fontSize:12, color:'var(--teal)', cursor:'pointer' }}>Search more...</div>
          </div>
        )}
      </div>

      {/* name (opportunity title) */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 6px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
        <span style={{ fontSize:11, opacity:0.4 }}>📋</span>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Opportunity Name"
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit' }} />
      </div>

      {/* email_from */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 6px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
        <span style={{ fontSize:11, opacity:0.4 }}>✉️</span>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit' }} />
      </div>

      {/* phone */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 6px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
        <span style={{ fontSize:11, opacity:0.4 }}>📱</span>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone"
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit' }} />
      </div>

      {/* expected_revenue + priority (stars) */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 6px', marginTop:4 }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:11, opacity:0.4 }}>💰</span>
          <input value={revenue} onChange={e=>setRevenue(e.target.value)} style={{ width:70, background:'none', border:'none', borderBottom:'1px solid var(--border)', outline:'none', color:'var(--text)', fontSize:12, fontFamily:'inherit' }} />
          <span style={{ fontSize:11, color:'var(--text3)' }}>د.ا</span>
        </div>
        <div style={{ display:'flex', gap:2 }}>
          {[0,1,2,3].map(s => (
            <span key={s} onClick={() => setPriority(String(s))} style={{ fontSize:14, cursor:'pointer', color: s <= parseInt(priority) ? '#f0ad4e' : 'var(--border2)' }}>★</span>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:6, marginTop:8, justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:6 }}>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add</button>
          <button className="btn btn-secondary btn-sm">Edit</button>
        </div>
        <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:16 }}>✕</button>
      </div>
    </div>
  )
}

function LeadCard({ lead, onClick, onDragStart }) {
  const [hover, setHover] = useState(false)
  const stars    = parseInt(lead.priority || '0')
  const initials = (lead.partner_name || lead.contact_name || lead.name || '?')[0].toUpperCase()

  return (
    <div draggable onDragStart={onDragStart} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface3)' : 'var(--surface2)',
        border:'1px solid var(--border)', borderRadius:6, padding:'10px',
        cursor:'pointer', marginBottom:6,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition:'all var(--t)',
      }}>

      {/* ref + expected_revenue */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:11, fontWeight:600, color:'var(--teal)' }}>{lead.id?.slice(-6).toUpperCase()}</span>
        {lead.expected_revenue > 0 && (
          <span style={{ fontSize:11, color:'var(--text2)' }}>{Number(lead.expected_revenue).toLocaleString()} د.ا</span>
        )}
      </div>

      {/* name (opportunity title) */}
      <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {lead.name || 'Unnamed opportunity'}
      </div>

      {/* partner_name / contact_name */}
      {(lead.partner_name || lead.contact_name) && (
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
          <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>
            {initials}
          </div>
          <span style={{ fontSize:12, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {lead.partner_name || lead.contact_name}
          </span>
        </div>
      )}

      {/* priority (stars) + activity + user */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:1 }}>
          {[0,1,2,3].map(s => (
            <span key={s} style={{ fontSize:12, color: s < stars ? '#f0ad4e' : 'var(--border2)' }}>{s < stars ? '★' : '☆'}</span>
          ))}
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'var(--text3)' }}>⏱</span>
          <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>O</div>
        </div>
      </div>
    </div>
  )
}
