/**
 * CRMPipeline.jsx — Odoo 19.0
 * Views: kanban (full), list (full), calendar/pivot/graph/activity/map (placeholder)
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionBar from '@shell/ActionBar.jsx'
import { useRecordList } from '@data/useRecord.js'
import { createRecord } from '@data/db.js'

export default function CRMPipeline() {
  const navigate  = useNavigate()
  const [view,   setView]   = useState('kanban')
  const [search, setSearch] = useState('')
  const [quickAddStage, setQuickAddStage] = useState(null)

  const { records: stages } = useRecordList('crm.stage', { sortKey: 'sequence' })
  const { records, reload } = useRecordList('crm.lead', {
    filter: r => r.active !== false && r.type !== 'lead',
    sortKey: '__createdAt', sortDir: 'desc',
  })

  const filtered = records.filter(r =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.partner_name?.toLowerCase().includes(search.toLowerCase())
  )

  const getStageRecords = (stageId) =>
    filtered.filter(r => r.stage_id === stageId)

  const getStageSum = (stageId) =>
    getStageRecords(stageId).reduce((s, r) => s + (Number(r.expected_revenue) || 0), 0)

  const handleStageChange = async (leadId, newStageId) => {
    const { updateRecord } = await import('@data/db.js')
    await updateRecord('crm.lead', leadId, { stage_id: newStageId })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/crm/leads/new')}
        title="Pipeline" showGear
        searchValue={search} onSearchChange={setSearch}
        activeFilters={[{ label: 'My Pipeline', onRemove: () => {} }]}
        views={['kanban', 'list', 'calendar', 'pivot', 'graph', 'activity', 'map']}
        activeView={view} onViewChange={setView}
        totalCount={filtered.length}
      />

      {/* ── Kanban view ─────────────────────────────────────────── */}
      {view === 'kanban' && (
        <div style={{
          flex: 1, display: 'flex', gap: 8,
          padding: '12px 16px',
          overflowX: 'auto', overflowY: 'hidden',
          alignItems: 'flex-start',
          minHeight: 0,
        }}>
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
      )}

      {/* ── List view ────────────────────────────────────────────── */}
      {view === 'list' && (
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={TH}><input type="checkbox" /></th>
                <th style={TH}>Reference</th>
                <th style={TH}>Opportunity</th>
                <th style={TH}>Contact</th>
                <th style={TH}>Stage</th>
                <th style={TH}>Priority</th>
                <th style={TH} align="right">Expected Revenue</th>
                <th style={TH}>Salesperson</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                    No records found
                  </td>
                </tr>
              )}
              {filtered.map(lead => {
                const stage = stages.find(s => s.id === lead.stage_id)
                const stars = parseInt(lead.priority || '0')
                return (
                  <tr key={lead.id}
                    onClick={() => navigate(`/erp/crm/leads/${lead.id}`)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={TD} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" />
                    </td>
                    <td style={{ ...TD, color: 'var(--teal)', fontWeight: 600 }}>
                      {lead.id?.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ ...TD, fontWeight: 500, color: 'var(--text)' }}>
                      {lead.name || '—'}
                    </td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>
                      {lead.partner_name || lead.contact_name || '—'}
                    </td>
                    <td style={TD}>
                      {stage ? (
                        <span style={{
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 11,
                          color: 'var(--text2)',
                        }}>
                          {stage.name}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={TD}>
                      <span style={{ color: '#f0ad4e', letterSpacing: 1 }}>
                        {[0,1,2,3].map(s => s < stars ? '★' : '☆').join('')}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign: 'right', color: 'var(--text2)' }}>
                      {lead.expected_revenue > 0
                        ? Number(lead.expected_revenue).toLocaleString() + ' د.ا'
                        : '—'}
                    </td>
                    <td style={TD}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'var(--purple)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, color: '#fff',
                      }}>O</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Placeholder views ────────────────────────────────────── */}
      {!['kanban', 'list'].includes(view) && (
        <ViewPlaceholder view={view} />
      )}
    </div>
  )
}

/* ── Table cell styles ──────────────────────────────────────────── */
const TH = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
}
const TD = {
  padding: '9px 12px',
  color: 'var(--text)',
  verticalAlign: 'middle',
}

/* ── Placeholder for unbuilt views ─────────────────────────────── */
function ViewPlaceholder({ view }) {
  const icons = { calendar: '🗓', pivot: '⊕', graph: '📊', activity: '⏱', map: '📍' }
  const labels = {
    calendar: 'Calendar View',
    pivot: 'Pivot Table',
    graph: 'Graph View',
    activity: 'Activity View',
    map: 'Map View',
  }
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, color: 'var(--text3)',
      minHeight: 0,
    }}>
      <span style={{ fontSize: 40 }}>{icons[view] || '📋'}</span>
      <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text2)' }}>
        {labels[view] || view} — coming in a future batch
      </span>
      <span style={{ fontSize: 12 }}>Switch to Kanban or List to see your pipeline</span>
    </div>
  )
}

/* ── KanbanColumn ────────────────────────────────────────────────── */
function KanbanColumn({ stage, records, sum, quickAdding, onQuickAdd, onCancelQuickAdd, onCardClick, onStageChange, onCreated }) {
  const [dragOver, setDragOver] = useState(false)
  const [dragId,   setDragId]   = useState(null)

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDrop={() => { if (dragId) { onStageChange(dragId, stage.id); setDragId(null) }; setDragOver(false) }}
      onDragLeave={() => setDragOver(false)}
      style={{
        minWidth: 240, width: 240, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        background: dragOver ? 'rgba(0,181,181,0.06)' : 'var(--surface)',
        border: `1px solid ${dragOver ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius: 8, overflow: 'hidden',
        maxHeight: 'calc(100vh - 130px)',
        transition: 'border-color var(--t)',
      }}>

      {/* Column header */}
      <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{stage.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text2)' }}>{records.length}</span>
            <button onClick={onQuickAdd}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>+</button>
          </div>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--surface3)' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(stage.probability || 10, 100)}%`,
            background: `hsl(${(stage.probability || 10) * 1.2},70%,50%)`,
            borderRadius: 2, transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>{records.length}</span>
          {sum > 0 && <span style={{ fontSize: 10, color: 'var(--text2)' }}>{sum.toLocaleString()} د.ا</span>}
        </div>
      </div>

      {quickAdding && (
        <QuickAddCard stageId={stage.id} onCreated={onCreated} onCancel={onCancelQuickAdd} />
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
        {records.map(r => (
          <LeadCard key={r.id} lead={r}
            onClick={() => onCardClick(r.id)}
            onDragStart={() => setDragId(r.id)} />
        ))}
      </div>
    </div>
  )
}

/* ── QuickAddCard ────────────────────────────────────────────────── */
function QuickAddCard({ stageId, onCreated, onCancel }) {
  const [partners,     setPartners]     = useState([])
  const [partnerQuery, setPartnerQuery] = useState('')
  const [showDrop,     setShowDrop]     = useState(false)
  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [revenue,      setRevenue]      = useState('0.000')
  const [priority,     setPriority]     = useState('0')

  useEffect(() => {
    import('@data/db.js').then(db => db.listRecords('res.partner').then(setPartners))
  }, [])

  const filteredPartners = partnerQuery
    ? partners.filter(p => p.name?.toLowerCase().includes(partnerQuery.toLowerCase()))
    : partners.slice(0, 8)

  const handleAdd = async () => {
    await createRecord('crm.lead', {
      name:             name || `${partnerQuery || 'New'}'s opportunity`,
      partner_name:     partnerQuery,
      contact_name:     partnerQuery,
      email_from:       email,
      phone,
      stage_id:         stageId,
      type:             'opportunity',
      priority,
      expected_revenue: parseFloat(revenue.replace(',', '.')) || 0,
      probability:      10,
      active:           true,
    })
    onCreated()
  }

  return (
    <div style={{ margin: '0 8px 8px', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 6, padding: 10, flexShrink: 0 }}>
      <div style={{ position: 'relative', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderBottom: '1px solid var(--teal)' }}>
          <span style={{ fontSize: 11, opacity: 0.5 }}>👤</span>
          <input value={partnerQuery}
            onChange={e => { setPartnerQuery(e.target.value); setShowDrop(true) }}
            onFocus={() => setShowDrop(true)}
            placeholder="Contact Name"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }} />
        </div>
        {showDrop && filteredPartners.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 4, zIndex: 200, boxShadow: 'var(--shadow-md)' }}>
            {filteredPartners.map(p => (
              <div key={p.id}
                onClick={() => { setPartnerQuery(p.name); setEmail(p.email || ''); setPhone(p.phone || ''); setShowDrop(false) }}
                style={{ padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--text)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {[
        { val: name,  set: setName,  icon: '📋', ph: 'Opportunity Name' },
        { val: email, set: setEmail, icon: '✉️', ph: 'Email' },
        { val: phone, set: setPhone, icon: '📱', ph: 'Phone' },
      ].map(({ val, set, icon, ph }) => (
        <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>{icon}</span>
          <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }} />
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>💰</span>
          <input value={revenue} onChange={e => setRevenue(e.target.value)}
            style={{ width: 70, background: 'none', border: 'none', borderBottom: '1px solid var(--border)', outline: 'none', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }} />
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>د.ا</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0, 1, 2, 3].map(s => (
            <span key={s} onClick={() => setPriority(String(s))}
              style={{ fontSize: 14, cursor: 'pointer', color: s <= parseInt(priority) ? '#f0ad4e' : 'var(--border2)' }}>★</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add</button>
          <button className="btn btn-secondary btn-sm">Edit</button>
        </div>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 16 }}>✕</button>
      </div>
    </div>
  )
}

/* ── LeadCard ────────────────────────────────────────────────────── */
function LeadCard({ lead, onClick, onDragStart }) {
  const [hover, setHover] = useState(false)
  const stars    = parseInt(lead.priority || '0')
  const initials = (lead.partner_name || lead.contact_name || lead.name || '?')[0].toUpperCase()

  return (
    <div draggable onDragStart={onDragStart} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface3)' : 'var(--surface2)',
        border: '1px solid var(--border)', borderRadius: 6, padding: 10,
        cursor: 'pointer', marginBottom: 6,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all var(--t)',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal)' }}>{lead.id?.slice(-6).toUpperCase()}</span>
        {lead.expected_revenue > 0 && (
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>{Number(lead.expected_revenue).toLocaleString()} د.ا</span>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {lead.name || 'Unnamed opportunity'}
      </div>
      {(lead.partner_name || lead.contact_name) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lead.partner_name || lead.contact_name}
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 1 }}>
          {[0, 1, 2, 3].map(s => (
            <span key={s} style={{ fontSize: 12, color: s < stars ? '#f0ad4e' : 'var(--border2)' }}>{s < stars ? '★' : '☆'}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>⏱</span>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>O</div>
        </div>
      </div>
    </div>
  )
}
