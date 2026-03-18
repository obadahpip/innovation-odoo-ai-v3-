/**
 * TaskKanban.jsx — project.task kanban
 * Odoo 19.0 fields: name, description, project_id, stage_id, user_ids,
 *   date_deadline, priority ('0'|'1'), kanban_state, tag_ids, active
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, updateRecord } from '@data/db.js'
import ActionBar from '@shell/ActionBar.jsx'

export default function TaskKanban() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [view,   setView]   = useState('kanban')

  // project.task.type — Kanban stages
  const { records: stages } = useRecordList('project.task.type', { sortKey:'sequence' })

  // project.task records
  const { records: tasks, reload } = useRecordList('project.task', {
    filter: r => r.active !== false,
    sortKey: '__createdAt', sortDir: 'desc',
  })

  const stageTasks = stageId => tasks.filter(t =>
    t.stage_id === stageId &&
    (!search || t.name?.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDrop = async (taskId, newStageId) => {
    await updateRecord('project.task', taskId, { stage_id: newStageId })
  }

  const addTask = async (stageId) => {
    const name = prompt('Task name:')
    if (!name) return
    await createRecord('project.task', { name, stage_id: stageId, priority:'0', kanban_state:'normal', active:true })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => navigate('/erp/project/tasks/new')}
        title="All Tasks" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={tasks.length} pageSize={80}
        views={['kanban','list','activity','calendar','pivot','graph']}
        activeView={view} onViewChange={setView}
      />
      <div style={{ flex:1, display:'flex', gap:8, padding:'12px 16px', overflowX:'auto', overflowY:'hidden', alignItems:'flex-start' }}>
        {stages.map(stage => {
          const stageTsk = stageTasks(stage.id)
          return (
            <KanbanCol key={stage.id} stage={stage} tasks={stageTsk}
              onCardClick={id => navigate(`/erp/project/tasks/${id}`)}
              onDrop={handleDrop}
              onAdd={() => addTask(stage.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function KanbanCol({ stage, tasks, onCardClick, onDrop, onAdd }) {
  const [dragOver, setDragOver] = useState(false)
  const [dragId, setDragId] = useState(null)
  const KANBAN_COLORS = { normal:'#aaa', done:'var(--success)', blocked:'var(--danger)' }

  return (
    <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDrop={()=>{if(dragId)onDrop(dragId,stage.id);setDragId(null);setDragOver(false)}} onDragLeave={()=>setDragOver(false)}
      style={{ minWidth:230,width:230,flexShrink:0,display:'flex',flexDirection:'column',background:dragOver?'rgba(0,181,181,0.05)':'var(--surface)',border:`1px solid ${dragOver?'var(--teal)':'var(--border)'}`,borderRadius:8,overflow:'hidden',maxHeight:'calc(100vh-130px)',transition:'border-color var(--t)' }}>
      <div style={{ padding:'10px 10px 6px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)' }}>
        <span style={{ fontSize:13,fontWeight:600,color:'var(--text)' }}>{stage.name}</span>
        <div style={{ display:'flex',gap:6,alignItems:'center' }}>
          <span style={{ fontSize:11,color:'var(--text2)' }}>{tasks.length}</span>
          <button onClick={onAdd} style={{ background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:18,lineHeight:1,padding:'0 2px' }} onMouseEnter={e=>e.currentTarget.style.color='var(--teal)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>+</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:'auto',padding:'8px' }}>
        {tasks.map(task => (
          <div key={task.id} draggable onDragStart={()=>setDragId(task.id)} onClick={()=>onCardClick(task.id)}
            style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,padding:10,cursor:'pointer',marginBottom:6,transition:'box-shadow var(--t)' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'} onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
            {/* priority star */}
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
              <span style={{ fontSize:12,color:task.priority==='1'?'#f0ad4e':'var(--border2)' }}>{task.priority==='1'?'★':'☆'}</span>
              <div style={{ width:8,height:8,borderRadius:'50%',background:KANBAN_COLORS[task.kanban_state||'normal'] }} title={task.kanban_state}/>
            </div>
            <div style={{ fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:6 }}>{task.name}</div>
            {task.date_deadline && (
              <div style={{ fontSize:11,color:new Date(task.date_deadline)<new Date()?'var(--danger)':'var(--text3)' }}>
                📅 {new Date(task.date_deadline).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
