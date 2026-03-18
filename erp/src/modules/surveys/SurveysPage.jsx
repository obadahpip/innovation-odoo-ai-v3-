/**
 * SurveysPage.jsx — Surveys module
 * Lesson 63: Surveys
 * Selectors: field-name, kanban-card, new-button,
 *            see-results-button, share-button, start-live-session-button, test-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecord, getRecord, updateRecord, listRecords } from '@data/db.js'
import { useRecordList } from '@data/useRecord.js'

const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color var(--t)' }

function Badge({ label, color = 'var(--teal)' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + '22', border: `1px solid ${color}44`, color }}>{label}</span>
}

function SurveysSidebar({ children }) {
  const navigate = useNavigate()
  const items = [
    { label: 'Surveys',       path: '/erp/surveys',          icon: '📊' },
    { label: 'Configuration', path: '/erp/surveys/config',   icon: '⚙' },
  ]
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ width: 180, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '8px 0' }}>
        <div style={{ padding: '4px 14px 2px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>SURVEYS</div>
        {items.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ width: '100%', padding: '7px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

async function seedSurveys() {
  const existing = await listRecords('survey.survey')
  if (existing.length > 0) return
  for (const s of [
    { name: 'Customer Satisfaction 2025',  state: 'open',   answer_count: 47, question_count: 8,  certification: false, access_mode: 'public'  },
    { name: 'Employee Engagement Survey',  state: 'open',   answer_count: 23, question_count: 12, certification: false, access_mode: 'invite'  },
    { name: 'Product Knowledge Test',      state: 'closed', answer_count: 89, question_count: 15, certification: true,  access_mode: 'public'  },
    { name: 'NPS Survey — Q1 2025',       state: 'draft',  answer_count: 0,  question_count: 3,  certification: false, access_mode: 'public'  },
    { name: 'Onboarding Feedback',         state: 'open',   answer_count: 12, question_count: 6,  certification: false, access_mode: 'invite'  },
  ]) await createRecord('survey.survey', s)
}

/* ═══════════════════════════════════════════════════════════════
   SURVEYS KANBAN
═══════════════════════════════════════════════════════════════ */
export function SurveysPage() {
  const navigate  = useNavigate()
  const { records, reload } = useRecordList('survey.survey', { sortKey: 'name' })
  useEffect(() => { seedSurveys().then(reload) }, [])

  const STATE_COLOR = { draft: 'var(--text3)', open: 'var(--success)', closed: 'var(--warning)' }
  const STATE_LABEL = { draft: 'Draft', open: 'Open', closed: 'Closed' }

  return (
    <SurveysSidebar>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>Surveys</span>
          <button data-erp="new-button" className="btn btn-primary btn-sm" onClick={() => navigate('/erp/surveys/new')}>
            + New
          </button>
        </div>

        {/* Kanban */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {records.map(survey => (
              <div
                key={survey.id}
                data-erp="kanban-card"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, overflow: 'hidden',
                  transition: 'box-shadow var(--t)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                onClick={() => navigate(`/erp/surveys/${survey.id}`)}
              >
                {/* Color bar */}
                <div style={{ height: 4, background: STATE_COLOR[survey.state] || 'var(--teal)' }} />

                <div style={{ padding: '14px 16px' }}>
                  {/* Title + badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, paddingRight: 8 }}>{survey.name}</div>
                    <Badge label={STATE_LABEL[survey.state] || survey.state} color={STATE_COLOR[survey.state] || 'var(--text3)'} />
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: 'var(--text2)' }}>
                    <span>❓ {survey.question_count} questions</span>
                    <span>📝 {survey.answer_count} answers</span>
                    {survey.certification && <span>🏆 Certification</span>}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                    <button
                      data-erp="test-button"
                      onClick={() => navigate(`/erp/surveys/${survey.id}`)}
                      style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      🧪 Test
                    </button>
                    <button
                      data-erp="share-button"
                      onClick={() => alert('Share link copied!')}
                      style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      🔗 Share
                    </button>
                    <button
                      data-erp="see-results-button"
                      onClick={() => navigate(`/erp/surveys/${survey.id}/results`)}
                      style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      📊 See Results
                    </button>
                    {survey.state === 'open' && (
                      <button
                        data-erp="start-live-session-button"
                        onClick={() => alert('Live session started!')}
                        style={{ padding: '4px 10px', background: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 5, color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        ▶ Live Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SurveysSidebar>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SURVEY FORM
═══════════════════════════════════════════════════════════════ */
export function SurveysForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({ name: '', access_mode: 'public', state: 'draft', certification: false, scoring_type: 'no_scoring', description: '' })
  const [tab, setTab]   = useState('Questions')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (!isNew) getRecord('survey.survey', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('survey.survey', vals)
    else       await updateRecord('survey.survey', id, vals)
    navigate('/erp/surveys')
  }

  const addQuestion = () => setQuestions(q => [...q, { id: Date.now(), text: '', type: 'text_box' }])

  const fields = [
    { key: 'name',        label: 'Survey Title',   required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'access_mode', label: 'Access',         type: 'select', options: ['public', 'invite', 'token'] },
    { key: 'state',       label: 'Status',         type: 'select', options: ['draft', 'open', 'closed'] },
    { key: 'scoring_type',label: 'Scoring',        type: 'select', options: ['no_scoring', 'scoring', 'scoring_time_limit'] },
    { key: 'description', label: 'Thank You Message', type: 'textarea', dataErp: 'field-description', fullWidth: true },
  ]

  return (
    <SurveysSidebar>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button data-erp="save-button"    className="btn btn-primary btn-sm"   onClick={handleSave}>Save</button>
          <button data-erp="discard-button" className="btn btn-secondary btn-sm" onClick={() => navigate('/erp/surveys')}>Discard</button>
          <span style={{ flex: 1 }} />
          <button data-erp="test-button" className="btn btn-secondary btn-sm">🧪 Test</button>
          <button data-erp="share-button" className="btn btn-secondary btn-sm">🔗 Share</button>
          <button data-erp="start-live-session-button" className="btn btn-primary btn-sm" style={{ background: 'var(--teal)', borderColor: 'var(--teal)' }}>▶ Start Live</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 20px', flexShrink: 0 }}>
          {['Questions', 'Options', 'Description'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 16px', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--teal)' : '2px solid transparent', color: tab === t ? 'var(--teal)' : 'var(--text2)', fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: '20px 24px', maxWidth: 900, flex: 1 }}>
          {tab === 'Questions' && (
            <div>
              {/* Survey title quick edit */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Survey Title *</label>
                <input data-erp="field-name" value={vals.name} onChange={e => setVals(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter survey title..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>

              {/* Questions list */}
              {questions.map((q, i) => (
                <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)', minWidth: 20 }}>Q{i + 1}</span>
                    <input value={q.text} onChange={e => setQuestions(qs => qs.map(qq => qq.id === q.id ? { ...qq, text: e.target.value } : qq))}
                      placeholder="Type your question..." style={{ ...inputStyle, flex: 1 }} />
                    <select value={q.type} onChange={e => setQuestions(qs => qs.map(qq => qq.id === q.id ? { ...qq, type: e.target.value } : qq))}
                      style={{ width: 140, padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }}>
                      <option value="text_box">Text Box</option>
                      <option value="char_box">Single Line</option>
                      <option value="numerical_box">Number</option>
                      <option value="date">Date</option>
                      <option value="simple_choice">Multiple Choice</option>
                      <option value="multiple_choice">Checkboxes</option>
                      <option value="matrix">Matrix</option>
                    </select>
                    <button onClick={() => setQuestions(qs => qs.filter(qq => qq.id !== q.id))}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                </div>
              ))}
              <button data-erp="create-button"
                onClick={addQuestion}
                style={{ width: '100%', padding: '10px', background: 'transparent', border: '2px dashed var(--border)', borderRadius: 8, color: 'var(--teal)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                + Add a Question
              </button>
            </div>
          )}

          {tab === 'Options' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              {fields.filter(f => !['name','description'].includes(f.key)).map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <select value={vals[f.key] || ''} onChange={e => setVals(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          {tab === 'Description' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Thank You Message</label>
              <textarea rows={6} data-erp="field-description" value={vals.description || ''} onChange={e => setVals(p => ({ ...p, description: e.target.value }))}
                placeholder="Message shown after survey completion..." style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          )}
        </div>
      </div>
    </SurveysSidebar>
  )
}
