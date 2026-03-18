/**
 * DataCleaningPage.jsx — Data Cleaning module
 * Lesson 78: Data Cleaning
 * Selectors: app-configuration, app-deduplication, confirm-button, field-type,
 *            kanban-card, list-row, merge-button, new-button, status-bar
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecord, listRecords, updateRecord } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

const TH = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const TD = { padding: '9px 12px', color: 'var(--text)', verticalAlign: 'middle' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

async function seedDataCleaning() {
  const [dedups, rules] = await Promise.all([
    listRecords('data.merge.dedup'),
    listRecords('data.cleaning.rule'),
  ])

  if (dedups.length === 0) {
    for (const d of [
      { res_model_id: 'res.partner', name: 'Contacts Deduplication', state: 'draft',  duplicate_count: 8,  rule_type: 'name_email' },
      { res_model_id: 'res.partner', name: 'Companies Dedup',        state: 'running', duplicate_count: 3, rule_type: 'name' },
      { res_model_id: 'crm.lead',    name: 'CRM Leads Dedup',        state: 'done',   duplicate_count: 0,  rule_type: 'email_phone' },
    ]) await createRecord('data.merge.dedup', d)
  }

  if (rules.length === 0) {
    for (const r of [
      { name: 'Contacts — Email format',   res_model_id: 'res.partner', rule_type: 'field_format', state: 'active',   records_to_fix: 12 },
      { name: 'Contacts — Phone format',   res_model_id: 'res.partner', rule_type: 'field_format', state: 'active',   records_to_fix: 7  },
      { name: 'Products — Missing category',res_model_id: 'product.template', rule_type: 'missing_field', state: 'active', records_to_fix: 4 },
      { name: 'Leads — Missing email',     res_model_id: 'crm.lead',    rule_type: 'missing_field', state: 'inactive', records_to_fix: 0  },
    ]) await createRecord('data.cleaning.rule', r)
  }
}

/* ── Data Cleaning shell ────────────────────────────────────────── */
function DataCleaningShell({ children, activeTab, onTab }) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Sidebar */}
      <div style={{ width: 210, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ padding: '8px 0' }}>
          <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>DATA CLEANING</div>
          {[
            { id: 'deduplication', label: 'Deduplication', icon: '🔀', dataErp: 'app-deduplication' },
            { id: 'rules',         label: 'Cleaning Rules', icon: '🧹', dataErp: 'app-configuration' },
          ].map(item => (
            <button key={item.id}
              data-erp={item.dataErp}
              onClick={() => onTab(item.id)}
              style={{
                width: '100%', padding: '8px 14px',
                background: activeTab === item.id ? 'var(--surface3)' : 'transparent',
                border: 'none',
                borderLeft: activeTab === item.id ? '3px solid var(--teal)' : '3px solid transparent',
                textAlign: 'left', fontSize: 13,
                color: activeTab === item.id ? 'var(--teal)' : 'var(--text2)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all var(--t)',
              }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'var(--surface2)' }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent' }}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DATA CLEANING PAGE
═══════════════════════════════════════════════════════════════ */
export function DataCleaningPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('deduplication')
  const { records: dedups, reload: reloadDedups } = useRecordList('data.merge.dedup', { sortKey: 'name' })
  const { records: rules,  reload: reloadRules }  = useRecordList('data.cleaning.rule', { sortKey: 'name' })
  const [selectedRows, setSelectedRows] = useState(new Set())

  useEffect(() => { seedDataCleaning().then(() => { reloadDedups(); reloadRules() }) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', running: 'var(--teal)', done: 'var(--success)', error: 'var(--danger)' }
  const RULE_COLOR  = { active: 'var(--success)', inactive: 'var(--text3)' }

  const handleConfirm = async (dedup) => {
    await updateRecord('data.merge.dedup', dedup.id, { state: 'running' })
    reloadDedups()
  }

  const handleMerge = async (dedup) => {
    await updateRecord('data.merge.dedup', dedup.id, { state: 'done', duplicate_count: 0 })
    reloadDedups()
  }

  const toggleRow = id => {
    const s = new Set(selectedRows)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelectedRows(s)
  }

  return (
    <DataCleaningShell activeTab={tab} onTab={setTab}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* ── Status bar / header ────────────────────────────── */}
        <div data-erp="status-bar" style={{
          padding: '10px 20px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          {/* Tab switcher acts as status bar for task engine */}
          {[
            { id: 'deduplication', label: 'Deduplication' },
            { id: 'rules',         label: 'Cleaning Rules' },
          ].map(t => (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '4px 14px', borderRadius: 20,
                border: `1px solid ${tab === t.id ? 'var(--teal)' : 'transparent'}`,
                background: tab === t.id ? 'var(--teal)' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text3)',
                fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >{t.label}</button>
          ))}
          <span style={{ flex: 1 }} />
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => {}}>+ New</button>
        </div>

        {/* ── DEDUPLICATION TAB ────────────────────────────── */}
        {tab === 'deduplication' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Kanban of dedup jobs */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {dedups.map(dedup => (
                  <div key={dedup.id}
                    data-erp="kanban-card"
                    style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '16px',
                      transition: 'box-shadow var(--t)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{dedup.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>{dedup.res_model_id}</div>
                      </div>
                      <Badge label={dedup.state} color={STATE_COLOR[dedup.state] || 'var(--text3)'} />
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: 'var(--text2)' }}>
                      <span>🔁 {dedup.duplicate_count} duplicates</span>
                      <span>🔑 Rule: {dedup.rule_type}</span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {dedup.state === 'draft' && (
                        <button data-erp="confirm-button"
                          onClick={() => handleConfirm(dedup)}
                          style={{ padding: '5px 12px', background: 'var(--teal)', border: 'none', borderRadius: 5, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Confirm
                        </button>
                      )}
                      {dedup.state === 'running' && dedup.duplicate_count > 0 && (
                        <button data-erp="merge-button"
                          onClick={() => handleMerge(dedup)}
                          style={{ padding: '5px 12px', background: 'var(--purple)', border: 'none', borderRadius: 5, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                          🔀 Merge All
                        </button>
                      )}
                      {dedup.state === 'done' && (
                        <span style={{ fontSize: 12, color: 'var(--success)' }}>✅ Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RULES TAB ────────────────────────────────────── */}
        {tab === 'rules' && (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {/* Filter selector */}
            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontSize: 12, color: 'var(--text2)' }}>Model:</label>
              <select data-erp="field-type"
                style={{ padding: '5px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>
                <option value="">All models</option>
                <option value="res.partner">Contacts</option>
                <option value="crm.lead">CRM Leads</option>
                <option value="product.template">Products</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={TH}><input type="checkbox" /></th>
                {['Rule Name', 'Model', 'Type', 'Records to Fix', 'Status'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} data-erp="list-row"
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => toggleRow(rule.id)}>
                    <td style={TD} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedRows.has(rule.id)} onChange={() => toggleRow(rule.id)} />
                    </td>
                    <td style={{ ...TD, fontWeight: 500, color: 'var(--teal)' }}>{rule.name}</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>{rule.res_model_id}</td>
                    <td style={TD}><Badge label={rule.rule_type} color="#17a2b8" /></td>
                    <td style={{ ...TD, color: rule.records_to_fix > 0 ? 'var(--warning)' : 'var(--text2)' }}>
                      {rule.records_to_fix > 0 ? `⚠ ${rule.records_to_fix}` : '✓ Clean'}
                    </td>
                    <td style={TD}><Badge label={rule.state} color={RULE_COLOR[rule.state] || 'var(--text3)'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedRows.size > 0 && (
              <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '10px 20px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{selectedRows.size} selected</span>
                <button data-erp="merge-button" className="btn btn-primary btn-sm">🧹 Fix Selected</button>
                <button data-erp="confirm-button" className="btn btn-secondary btn-sm">Validate Rules</button>
              </div>
            )}
          </div>
        )}
      </div>
    </DataCleaningShell>
  )
}
