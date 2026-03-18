/**
 * Departments.jsx — Odoo 19.0 hr.department fields:
 *   name, manager_id, parent_id, company_id, active
 */
import { useNavigate } from 'react-router-dom'
import { useRecordList } from '@data/useRecord.js'
import ActionBar from '@shell/ActionBar.jsx'
import { useState } from 'react'

const ACCENT_COLORS = ['#00b5b5','#e07a5f','#714b67','#81b29a','#457b9d','#2a9d8f']

export default function Departments() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // hr.department — Odoo 19 model
  const { records: depts }  = useRecordList('hr.department', { sortKey:'name' })
  const { records: emps   } = useRecordList('hr.employee', {})

  const empCount = deptId => emps.filter(e => e.department_id === deptId && e.active !== false).length

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <ActionBar
        showNew onNew={() => {}}
        title="Departments" showGear
        searchValue={search} onSearchChange={setSearch}
        currentPage={1} totalCount={depts.length} pageSize={80}
        views={['kanban','list','hierarchy']} activeView="kanban"
      />
      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
          {depts
            .filter(d => !search || d.name?.toLowerCase().includes(search.toLowerCase()))
            .map((dept, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length]
              const count  = empCount(dept.id)
              return (
                <div key={dept.id} style={{
                  width:320, minHeight:130, borderRadius:8,
                  background:'var(--surface)', border:'1px solid var(--border)',
                  borderLeft:`4px solid ${accent}`,
                  padding:'16px 20px', cursor:'pointer',
                  transition:'box-shadow var(--t)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                onClick={() => navigate('/erp/employees')}>
                  <div style={{ fontSize:15, fontWeight:700, color:accent, marginBottom:12 }}>{dept.name}</div>
                  <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate('/erp/employees') }}>
                    {count} Employees
                  </button>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
