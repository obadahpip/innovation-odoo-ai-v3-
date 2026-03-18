/**
 * TaskForm.jsx — project.task form
 * Odoo 19.0 fields: name, description, project_id, stage_id, user_ids,
 *   date_deadline, priority ('0'|'1'), kanban_state, tag_ids, active
 */
import { useNavigate, useParams } from 'react-router-dom'
import { useRecord, useRecordList } from '@data/useRecord.js'
import Chatter from '@shell/Chatter.jsx'
import { useState } from 'react'

const DEFAULTS = {
  name:'', description:'', project_id:null, stage_id:'stage-todo',
  user_ids:[], date_deadline:'', priority:'0', kanban_state:'normal',
  tag_ids:[], active:true,
}

export default function TaskForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { record, loading, isDirty, setField, save } = useRecord('project.task', !id||id==='new'?null:id, DEFAULTS)
  const { records: projects } = useRecordList('project.project', {})
  const { records: stages }   = useRecordList('project.task.type', { sortKey:'sequence' })

  const handleSave = async () => {
    const s = await save()
    if (!id||id==='new') navigate(`/erp/project/tasks/${s.id}`, { replace:true })
  }

  if (loading) return <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner"/></div>

  return (
    <div style={{ display:'flex',flexDirection:'column',flex:1,overflow:'hidden' }}>
      <div style={{ height:46,background:'var(--surface)',borderBottom:'1px solid var(--border2)',display:'flex',alignItems:'center',padding:'0 12px',gap:8,flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
        <button style={{ fontSize:12,color:'var(--teal)',background:'none',border:'none',cursor:'pointer',padding:0 }} onClick={()=>navigate('/erp/project/tasks')}>Tasks</button>
        <span style={{ color:'var(--text3)' }}>›</span>
        <span style={{ fontSize:13,fontWeight:600,color:'var(--text)' }}>{record?.name||'New Task'}</span>
        {isDirty && <button className="btn btn-primary btn-sm" style={{ marginLeft:8 }} onClick={handleSave}>Save</button>}

        {/* Stage pills */}
        <div style={{ marginLeft:'auto',display:'flex',gap:3 }}>
          {stages.map((s,i) => {
            const isActive = record?.stage_id===s.id || (!record?.stage_id && i===0)
            return (
              <button key={s.id} onClick={()=>setField('stage_id',s.id)} style={{
                padding:'3px 10px',borderRadius:20,fontSize:11,cursor:'pointer',fontFamily:'inherit',
                border:`1px solid ${isActive?'var(--teal)':'var(--border2)'}`,
                background:isActive?'var(--surface3)':'transparent',
                color:isActive?'var(--teal)':'var(--text3)',fontWeight:isActive?600:400,
              }}>{s.name}</button>
            )
          })}
        </div>
      </div>

      <div style={{ flex:1,display:'flex',overflow:'hidden' }}>
        <div style={{ flex:1,overflowY:'auto',padding:'20px 24px' }}>
          {/* name */}
          <input value={record?.name||''} onChange={e=>setField('name',e.target.value)}
            placeholder="Task title..."
            style={{ fontSize:20,fontWeight:700,color:'var(--text)',background:'none',border:'none',borderBottom:'1px solid var(--teal)',outline:'none',width:'100%',padding:'4px 0',fontFamily:'inherit',marginBottom:16 }}/>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 40px' }}>
            <div>
              <FR label="Project">
                <select className="o-input" value={record?.project_id||''} onChange={e=>setField('project_id',e.target.value)}>
                  <option value="">—</option>
                  {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </FR>
              <FR label="Deadline">
                <input type="datetime-local" className="o-input" value={(record?.date_deadline||'').slice(0,16)} onChange={e=>setField('date_deadline',e.target.value)} style={{colorScheme:'dark'}}/>
              </FR>
              <FR label="Priority">
                <div style={{display:'flex',gap:4}}>
                  {[['0','Normal'],['1','High']].map(([v,l])=>(
                    <button key={v} onClick={()=>setField('priority',v)} style={{
                      padding:'3px 10px',borderRadius:20,fontSize:12,cursor:'pointer',fontFamily:'inherit',
                      border:`1px solid ${record?.priority===v?'#f0ad4e':'var(--border2)'}`,
                      background:record?.priority===v?'rgba(240,173,78,0.15)':'transparent',
                      color:record?.priority===v?'#f0ad4e':'var(--text3)',fontWeight:record?.priority===v?600:400,
                    }}>{v==='1'?'★':''} {l}</button>
                  ))}
                </div>
              </FR>
            </div>
            <div>
              <FR label="Kanban State">
                <select className="o-input" value={record?.kanban_state||'normal'} onChange={e=>setField('kanban_state',e.target.value)}>
                  <option value="normal">In Progress</option>
                  <option value="done">Ready for Next Stage</option>
                  <option value="blocked">Blocked</option>
                </select>
              </FR>
            </div>
          </div>

          {/* description */}
          <div style={{ marginTop:16 }}>
            <label style={{ fontSize:12,fontWeight:600,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.3px',display:'block',marginBottom:4 }}>Description</label>
            <textarea className="o-input" rows={5} value={record?.description||''} onChange={e=>setField('description',e.target.value)} placeholder="Add a description..."/>
          </div>
        </div>

        <div style={{ width:320,borderLeft:'1px solid var(--border)',overflow:'hidden',display:'flex',flexDirection:'column' }}>
          <Chatter modelName="project.task" recordId={record?.id} messages={[{author:'obadah abuodah',body:'Task created.',date:new Date().toISOString(),type:'note'}]}/>
        </div>
      </div>
    </div>
  )
}

function FR({ label, children }) {
  return (
    <div style={{ display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'center',gap:8,marginBottom:10 }}>
      <label style={{ fontSize:12,color:'var(--text2)',fontWeight:500 }}>{label}</label>
      <div>{children}</div>
    </div>
  )
}
