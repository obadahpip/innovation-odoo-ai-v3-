/**
 * LessonSelector.jsx
 * Shows all 81 lessons grouped by section.
 * Rendered on the /dashboard or /erp/home route.
 * Clicking "Start" launches the task engine for that lesson.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskEngine, ALL_LESSONS } from './useTaskEngine.js'
import { SCREEN_ROUTES } from './taskRoutes.js'

/* ── Group lessons by section_name ─────────────────────────────── */
function groupBySectionName(lessons) {
  const groups = {}
  for (const lesson of lessons) {
    const sec = lesson.section_name || 'General'
    if (!groups[sec]) groups[sec] = []
    groups[sec].push(lesson)
  }
  return groups
}

const SECTION_ICONS = {
  'Odoo Essentials + Studio + General Settings': '⚙',
  'Finance':       '💰',
  'Sales':         '🤝',
  'Websites':      '🌐',
  'Supply Chain':  '🏭',
  'Human Resources': '👥',
  'Marketing':     '📣',
  'Services':      '🛠',
  'Productivity':  '📊',
}

export default function LessonSelector() {
  const navigate    = useNavigate()
  const { startLesson, activeLesson } = useTaskEngine()
  const [search, setSearch] = useState('')
  const [expandedSec, setExpandedSec] = useState(null)

  const filtered = search
    ? ALL_LESSONS.filter(l => l.lesson_title.toLowerCase().includes(search.toLowerCase()))
    : ALL_LESSONS

  const groups = groupBySectionName(filtered)

  function handleStart(lessonId) {
    const lesson = ALL_LESSONS.find(l => l.lesson_id === lessonId)
    if (!lesson) return
    // Always start at home — step 1 highlights the correct app icon
    navigate('/erp/home')
    setTimeout(() => startLesson(lessonId), 200)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
          📋 Lesson Library
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text3)' }}>
          {ALL_LESSONS.length} lessons across 9 sections · Click Start to begin a guided walkthrough
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, maxWidth: 400 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search lessons..."
          style={{
            width: '100%', padding: '9px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)',
            fontSize: 13, fontFamily: 'inherit', outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Active lesson banner */}
      {activeLesson && (
        <div style={{
          padding: '10px 16px', background: 'rgba(0,181,181,0.12)',
          border: '1px solid rgba(0,181,181,0.3)', borderRadius: 8,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 13, color: '#00b5b5', fontWeight: 600 }}>
            ▶ Currently active: {activeLesson.lesson_title}
          </span>
          <button
            onClick={() => useTaskEngine.getState().stopLesson()}
            style={{ marginLeft: 'auto', padding: '3px 12px', background: 'transparent', border: '1px solid rgba(0,181,181,0.4)', borderRadius: 5, color: '#00b5b5', fontSize: 12, cursor: 'pointer' }}>
            Stop
          </button>
        </div>
      )}

      {/* Sections */}
      {Object.entries(groups).map(([section, lessons]) => (
        <div key={section} style={{ marginBottom: 16 }}>
          {/* Section header */}
          <button
            onClick={() => setExpandedSec(expandedSec === section ? null : section)}
            style={{
              width: '100%', padding: '10px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: expandedSec === section ? '8px 8px 0 0' : 8,
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              transition: 'background var(--t)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            <span style={{ fontSize: 18 }}>{SECTION_ICONS[section] || '📚'}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{section}</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>{lessons.length} lessons</span>
            <span style={{ color: 'var(--text3)', fontSize: 14, transition: 'transform 0.2s', transform: expandedSec === section ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>

          {/* Lessons list */}
          {(expandedSec === section || search) && (
            <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
              {lessons.map((lesson, i) => (
                <div key={lesson.lesson_id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    transition: 'background var(--t)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg)' : 'var(--surface)'}
                >
                  {/* Lesson number */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--surface3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--text3)', flexShrink: 0,
                  }}>
                    {lesson.lesson_id}
                  </div>

                  {/* Title + step count */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lesson.lesson_title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                      {lesson.steps.length} steps · {[...new Set(lesson.steps.map(s => s.odoo_screen_target))].join(', ')}
                    </div>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={() => handleStart(lesson.lesson_id)}
                    style={{
                      padding: '5px 16px',
                      background: activeLesson?.lesson_id === lesson.lesson_id ? 'var(--success)' : 'var(--teal)',
                      border: 'none', borderRadius: 6,
                      color: '#fff', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
                      transition: 'opacity var(--t)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {activeLesson?.lesson_id === lesson.lesson_id ? '▶ Active' : 'Start'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 14 }}>
          No lessons match "{search}"
        </div>
      )}
    </div>
  )
}