/**
 * SurveysPage.jsx — Surveys
 * Odoo 19.0 model: survey.survey
 * Route base: /erp/surveys
 * Sub-nav: ['Surveys', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'open':{label:'In Progress',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'closed':{label:'Closed',color:'var(--text2)',bg:'var(--surface3)'},
  'cancel':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'title',label:'Survey',width:'28%'},
  {key:'question_count',label:'Questions',width:'12%'},
  {key:'user_input_count',label:'Answers',width:'12%'},
  {key:'avg_score',label:'Avg Score',width:'12%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'open',label:'In Progress'},
  {value:'closed',label:'Closed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function SurveysPage() {
  return (
    <GenericList
      model="survey.survey"
      title="Surveys"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/surveys/new"
      formPath="/erp/surveys/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📊"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SurveysForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="survey.survey" id={id}
      defaults={DEFAULTS}
      title="Survey"
      backPath="/erp/surveys" backLabel="Surveys"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Survey Title'><input className='o-input' value={record?.title||''} onChange={e=>setField('title',e.target.value)}/></FieldRow>
          <FieldRow label='Description'><textarea className='o-input' rows={3} value={record?.description||''} onChange={e=>setField('description',e.target.value)}/></FieldRow>
          <FieldRow label='Survey Type'><select className='o-input' value={record?.survey_type||''} onChange={e=>setField('survey_type',e.target.value)}><option value='survey'>Survey</option><option value='live_session'>Live Session</option><option value='assessment'>Assessment</option><option value='custom'>Custom</option></select></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SurveysPage
