/**
 * EmployeeKanban.jsx — Odoo 19.0 field names
 *
 * hr.employee fields: name, job_title, department_id, work_email,
 *   work_phone, mobile_phone, category_ids, image_1920, active, user_id
 * hr.department fields: name, id
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'

const COLORS = ['#714b67','#e07a5f','#3d405b','#81b29a','#457b9d','#2a9d8f','#e63946','#f4a261']
const colorFor = name => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]

export default function EmployeeKanban() {
  const navigate = useNavigate()
  const [search,      setSearch]     = useState('')
  const [activeDept,  setActiveDept] = useState('all')
  const [view,        setView]       = useState('kanban')

  // hr.employee — Odoo 19 model
  const { records } = useRecordList('hr.employee', {
    filter: r => r.active !== false,
    sortKey: 'name',
  })

  // hr.department — Odoo 19 model
  const { records: depts } = useRecordList('hr.department', {})

  const filtered = records.filter(r => {
    if (activeDept !== 'all' && r.department_id !== activeDept) return false
    if (search && !r.name?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const deptCount = deptId => records.filter(r => r.department_id === deptId).length

  return (
    <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

      {/* Department sidebar */}
      <div style={{ width:182, background:'var(--bg)', borderRight:'1px solid var(--border)', flexShrink:0, padding:'12px 0', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 14px 8px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          <span>DEPARTMENT</span>
          <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:14 }}>◨</button>
        </div>

        {/* All + individual departments */}
        {[
          { id:'all', name:'All', count: records.length },
          ...depts.map(d => ({ id: d.id, name: d.name, count: deptCount(d.id) })),
        ].map(dept => (
          <button key={dept.id} onClick={() => setActiveDept(dept.id)} style={{
            width:'100%', padding:'6px 14px',
            background: activeDept === dept.id ? 'var(--surface3)' : 'none',
            border: 'none',
            borderLeft: activeDept === dept.id ? '3px solid var(--teal)' : '3px solid transparent',
            color: activeDept === dept.id ? 'var(--teal)' : 'var(--text2)',
            fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'inherit',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            fontWeight: activeDept === dept.id ? 600 : 400,
          }}>
            <span>{dept.name}</span>
            {dept.count > 0 && dept.id !== 'all' && (
              <span style={{ fontSize:11, color:'var(--text3)' }}>{dept.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <ActionBar
          showNew onNew={() => navigate('/erp/employees/new')}
          title="Employees" showGear
          searchValue={search} onSearchChange={setSearch}
          currentPage={1} totalCount={filtered.length} pageSize={80}
          views={['kanban','list','hierarchy','activity','graph','pivot']}
          activeView={view} onViewChange={setView}
        />

        <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
            {filtered.map(emp => (
              <EmployeeCard key={emp.id} emp={emp} onClick={() => navigate(`/erp/employees/${emp.id}`)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize:40, opacity:0.2 }}>👤</div>
              <h3>No employees found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmployeeCard({ emp, onClick }) {
  const [hover, setHover] = useState(false)

  // category_ids (Tags) — Odoo 19 field name
  const tags    = emp.category_ids || []
  const bgColor = colorFor(emp.name)
  const initials = emp.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width:220, borderRadius:8, overflow:'hidden', cursor:'pointer',
        background: hover ? 'var(--surface3)' : 'var(--surface2)',
        border:'1px solid var(--border)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition:'all var(--t)', position:'relative',
      }}>

      {/* image_1920 / photo area */}
      <div style={{ height:110, background:bgColor, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
        {emp.image_1920 ? (
          <img src={emp.image_1920} alt={emp.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ fontSize:36, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{initials}</div>
        )}
        {/* Online status dot */}
        <div style={{ position:'absolute', top:8, right:8, width:10, height:10, borderRadius:'50%', background:'#aaa', border:'2px solid var(--surface2)' }} />
      </div>

      {/* Info */}
      <div style={{ padding:'10px 10px 8px' }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {emp.name}
        </div>
        {/* job_title — Odoo 19 field */}
        {emp.job_title && (
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
            <span style={{ fontSize:11, color:'var(--purple3)' }}>🏢</span>
            <span style={{ fontSize:12, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.job_title}</span>
          </div>
        )}
        {/* work_email — Odoo 19 field (not just 'email') */}
        {emp.work_email && (
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
            <span style={{ fontSize:11, color:'var(--purple3)' }}>✉️</span>
            <span style={{ fontSize:11, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.work_email}</span>
          </div>
        )}
        {/* work_phone — Odoo 19 field */}
        {emp.work_phone && (
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
            <span style={{ fontSize:11, color:'var(--purple3)' }}>📞</span>
            <span style={{ fontSize:12, color:'var(--text2)' }}>{emp.work_phone}</span>
          </div>
        )}

        {/* category_ids — Tags (Odoo 19 field name) */}
        {tags.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:6 }}>
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} style={{ background:'var(--surface3)', color:'var(--text2)', padding:'1px 6px', borderRadius:3, fontSize:11 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: activity icon */}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <span style={{ fontSize:14, color:'var(--text3)' }}>⏱</span>
        </div>
      </div>
    </div>
  )
}
