/**
 * ProjectsList.jsx — project.project list
 * Odoo 19.0 fields: name, user_id, partner_id, date, date_start,
 *   last_update_status, task_count, active, allow_timesheets
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'
import { createRecord } from '@data/db.js'

const STATUS_MAP = {
  on_track:  { label:'On Track',  color:'var(--success)', bg:'rgba(46,204,113,0.15)' },
  at_risk:   { label:'At Risk',   color:'var(--warning)', bg:'rgba(240,173,78,0.15)' },
  off_track: { label:'Off Track', color:'var(--danger)',  bg:'rgba(231,76,60,0.15)' },
  on_hold:   { label:'On Hold',   color:'var(--text3)',   bg:'var(--surface3)' },
  done:      { label:'Done',      color:'var(--success)', bg:'rgba(46,204,113,0.2)' },
}

const PROJ_COLORS = ['#00b5b5','#e07a5f','#714b67','#81b29a','#457b9d','#2a9d8f','#e63946','#f4a261']

export default function ProjectsList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [view, setView] = useState('kanban')

  const { records, loading, reload } = useRecordList('project.project', {
    filter: r => r.active !== false,
    sortKey: 'name',
    search, searchFields: ['name'],
  })

  const handleNew = async () => {
    const name = prompt('Project name:')
    if (!name) return
    const p = await createRecord('project.project', { name, last_update_status:'on_track', task_count:0, active:true, allow_timesheets:true })
    navigate(`/erp/project/tasks?project=${p.id}`)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={handleNew}
        title="Projects" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={records.length} pageSize={80}
        views={['kanban','list','activity']} activeView={view} onViewChange={setView}
      />
      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
          {records.map((proj, i) => {
            const status = STATUS_MAP[proj.last_update_status] || STATUS_MAP.on_track
            const color  = PROJ_COLORS[i % PROJ_COLORS.length]
            return (
              <div key={proj.id} style={{ width:280, borderRadius:8, overflow:'hidden', background:'var(--surface)', border:'1px solid var(--border)', cursor:'pointer', transition:'box-shadow var(--t)' }}
                onClick={() => navigate(`/erp/project/tasks`)}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                {/* Color header */}
                <div style={{ height:6, background:color }}/>
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{proj.name}</div>
                    <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600, background:status.bg, color:status.color, flexShrink:0, marginLeft:8 }}>
                      {status.label}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text2)', marginBottom:12 }}>
                    {proj.date_start ? `From ${new Date(proj.date_start).toLocaleDateString()}` : ''}
                    {proj.date ? ` — ${new Date(proj.date).toLocaleDateString()}` : ''}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <button onClick={e => { e.stopPropagation(); navigate('/erp/project/tasks') }} className="btn btn-primary btn-sm">
                      {proj.task_count || 0} Tasks
                    </button>
                    <span style={{ fontSize:20, opacity:0.3 }}>⋮</span>
                  </div>
                </div>
              </div>
            )
          })}
          {/* New project tile */}
          <div onClick={handleNew} style={{ width:280, height:100, borderRadius:8, border:'2px dashed var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text3)', transition:'border-color var(--t), color var(--t)' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--teal)';e.currentTarget.style.color='var(--teal)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text3)'}}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:28 }}>+</div>
              <div style={{ fontSize:13 }}>New Project</div>
            </div>
          </div>
        </div>
        {records.length === 0 && !loading && (
          <div className="empty-state"><div style={{fontSize:40,opacity:0.2}}>📋</div><h3>No projects yet</h3></div>
        )}
      </div>
    </div>
  )
}
