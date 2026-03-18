/**
 * FormView.jsx
 * Generic form view: header status bar, tabbed sections, field grid, chatter.
 *
 * Props:
 *  record      — the record object
 *  setField    — (field, value) => void
 *  isDirty     — bool
 *  readonly    — bool
 *  tabs        — [{ key, label, content: (record, setField, readonly) => JSX }]
 *  stages      — [{ id, name }] for status bar
 *  stageField  — string, e.g. 'stage_id'
 *  onStageClick
 *  messages    — [] for chatter
 *  activities  — [] for chatter
 *  modelName   — string
 */
import { useState } from 'react'
import StatusBar from './StatusBar.jsx'
import Chatter from './Chatter.jsx'

export default function FormView({
  record = {},
  setField,
  isDirty = false,
  readonly = false,
  tabs = [],
  stages,
  stageField = 'stage_id',
  onStageClick,
  messages = [],
  activities = [],
  modelName,
  hideChatter = false,
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? null)

  const activeStage = stages
    ? (typeof record[stageField]==='object' ? record[stageField]?.id : record[stageField])
    : null

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

      {/* ── Status bar (pipeline stages) ──────────────────── */}
      {stages && stages.length > 0 && (
        <StatusBar
          stages={stages}
          activeStage={activeStage}
          onStageClick={s => { setField?.(stageField, s.id); onStageClick?.(s) }}
          readonly={readonly}
        />
      )}

      {/* ── Scrollable form body ──────────────────────────── */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* ── Tab strip ───────────────────────────────────── */}
        {tabs.length > 1 && (
          <div style={{
            display:'flex', borderBottom:'1px solid var(--border)',
            background:'var(--bg)', padding:'0 20px', gap:0,
            position:'sticky', top:0, zIndex:2,
          }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding:'10px 16px', background:'none', border:'none',
                  borderBottom: activeTab===tab.key ? '2px solid var(--teal)' : '2px solid transparent',
                  color: activeTab===tab.key ? 'var(--text)' : 'var(--text2)',
                  fontSize:13, fontWeight: activeTab===tab.key ? 600 : 400,
                  cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit',
                  transition:'color var(--t)',
                }}
                onMouseEnter={e=>{ if(activeTab!==tab.key) e.currentTarget.style.color='var(--text)' }}
                onMouseLeave={e=>{ if(activeTab!==tab.key) e.currentTarget.style.color='var(--text2)' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab content ──────────────────────────────────── */}
        <div style={{ padding:'20px 24px' }}>
          {tabs.length === 0 && (
            <div style={{ color:'var(--text3)', fontSize:13 }}>No form defined for this module yet.</div>
          )}
          {tabs.map(tab => (
            <div key={tab.key} style={{ display: activeTab===tab.key ? 'block' : 'none' }}>
              {tab.content(record, setField, readonly)}
            </div>
          ))}
        </div>

        {/* ── Chatter ──────────────────────────────────────── */}
        {!hideChatter && (
          <Chatter
            modelName={modelName}
            recordId={record?.id}
            messages={messages}
            activities={activities}
          />
        )}
      </div>
    </div>
  )
}

/* ── FormRow — 2-col label+field layout ─────────────────────────── */
export function FormRow({ label, children, required, half, full }) {
  return (
    <div style={{
      display:'contents',
      gridColumn: full ? '1/-1' : half ? 'auto' : 'auto',
    }}>
      <div style={{
        gridColumn: full ? '1/-1' : undefined,
        display:'grid',
        gridTemplateColumns: '160px 1fr',
        alignItems:'start',
        gap:8,
        marginBottom:10,
      }}>
        <label style={{
          fontSize:12, color:'var(--text2)', paddingTop:5,
          fontWeight:500, lineHeight:1.4,
        }}>
          {label}{required && <span style={{ color:'var(--danger)' }}> *</span>}
        </label>
        <div>{children}</div>
      </div>
    </div>
  )
}

/* ── FormSection — titled group of fields ────────────────────────── */
export function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      {title && (
        <div style={{
          fontSize:11, fontWeight:700, color:'var(--text3)',
          textTransform:'uppercase', letterSpacing:'0.5px',
          marginBottom:12, paddingBottom:6,
          borderBottom:'1px solid var(--border)',
        }}>
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

/* ── FormGrid — 2-column responsive grid ─────────────────────────── */
export function FormGrid({ children, cols=2 }) {
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:`repeat(${cols}, 1fr)`,
      gap:'0 32px',
    }}>
      {children}
    </div>
  )
}
