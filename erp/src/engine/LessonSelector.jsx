/**
 * LessonSelector.jsx  — v2
 * Full lesson library with:
 *  - Completion checkmarks from IndexedDB
 *  - Resume button for in-progress lessons
 *  - Progress stats per section
 *  - Search + expand all on search
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskEngine, ALL_LESSONS } from './useTaskEngine.js'
import { SCREEN_ROUTES } from './taskRoutes.js'

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
  'Odoo Essentials + Studio + General Settings': '⚙️',
  'Finance':            '💰',
  'Sales':              '🤝',
  'Websites':           '🌐',
  'Supply Chain':       '🏭',
  'Human Resources':    '👥',
  'Marketing':          '📣',
  'Services':           '🛠️',
  'Productivity':       '📊',
}

export default function LessonSelector() {
  const navigate = useNavigate()
  const {
    startLesson, resumeLesson, stopLesson,
    activeLesson, completedLessonIds, inProgressLesson, hydrated,
  } = useTaskEngine()

  const [search,       setSearch]       = useState('')
  const [expandedSecs, setExpandedSecs] = useState({})

  // Expand first section by default once hydrated
  useEffect(() => {
    if (!hydrated) return
    const groups = groupBySectionName(ALL_LESSONS)
    const first  = Object.keys(groups)[0]
    if (first) setExpandedSecs({ [first]: true })
  }, [hydrated])

  // Expand all when searching
  useEffect(() => {
    if (search) {
      const all = {}
      const groups = groupBySectionName(ALL_LESSONS)
      for (const k of Object.keys(groups)) all[k] = true
      setExpandedSecs(all)
    }
  }, [search])

  const filtered = search
    ? ALL_LESSONS.filter(l => l.lesson_title.toLowerCase().includes(search.toLowerCase()))
    : ALL_LESSONS

  const groups = groupBySectionName(filtered)

  function handleStart(lessonId) {
    const lesson = ALL_LESSONS.find(l => l.lesson_id === lessonId)
    if (!lesson) return
    const firstStep = lesson.steps[0]
    const route     = firstStep ? (SCREEN_ROUTES[firstStep.odoo_screen_target] || '/erp/home') : '/erp/home'
    navigate(route)
    setTimeout(() => startLesson(lessonId), 200)
  }

  function handleResume(lessonId, stepIndex) {
    const lesson = ALL_LESSONS.find(l => l.lesson_id === lessonId)
    if (!lesson) return
    const step  = lesson.steps[stepIndex] || lesson.steps[0]
    const route = SCREEN_ROUTES[step?.odoo_screen_target] || '/erp/home'
    navigate(route)
    setTimeout(() => resumeLesson(lessonId, stepIndex), 200)
  }

  const totalCompleted = completedLessonIds.size

  if (!hydrated) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 14 }}>
        Loading lessons…
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>📋 Lesson Library</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text3)' }}>
            {ALL_LESSONS.length} lessons · {totalCompleted} completed
          </p>
        </div>
        {/* Overall progress pill */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '6px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 80, height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round(totalCompleted / ALL_LESSONS.length * 100)}%`, background: 'var(--teal)', borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', whiteSpace: 'nowrap' }}>
            {Math.round(totalCompleted / ALL_LESSONS.length * 100)}%
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, maxWidth: 420 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search lessons…"
          style={{
            width: '100%', padding: '9px 14px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)', fontSize: 13,
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Active lesson banner */}
      {activeLesson && (
        <div style={{
          padding: '10px 16px', background: 'rgba(0,181,181,0.1)',
          border: '1px solid rgba(0,181,181,0.3)', borderRadius: 8, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 13, color: '#00b5b5', fontWeight: 600, flex: 1 }}>
            ▶ Active: {activeLesson.lesson_title}
          </span>
          <button onClick={stopLesson}
            style={{ padding: '3px 12px', background: 'transparent', border: '1px solid rgba(0,181,181,0.4)', borderRadius: 5, color: '#00b5b5', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Stop
          </button>
        </div>
      )}

      {/* In-progress resume banner */}
      {inProgressLesson && !activeLesson && (
        <div style={{
          padding: '10px 16px', background: 'rgba(113,75,103,0.12)',
          border: '1px solid rgba(113,75,103,0.3)', borderRadius: 8, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 600 }}>
              ⏸ Resume where you left off
            </span>
            <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>
              Lesson {inProgressLesson.lessonId} — step {inProgressLesson.stepIndex + 1}
            </span>
          </div>
          <button
            onClick={() => handleResume(inProgressLesson.lessonId, inProgressLesson.stepIndex)}
            style={{ padding: '5px 14px', background: 'var(--purple)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Resume →
          </button>
        </div>
      )}

      {/* Sections */}
      {Object.entries(groups).map(([section, lessons]) => {
        const sectionTotal     = ALL_LESSONS.filter(l => l.section_name === section).length
        const sectionCompleted = lessons.filter(l => completedLessonIds.has(l.lesson_id)).length
        const isExpanded       = !!expandedSecs[section]

        return (
          <div key={section} style={{ marginBottom: 14 }}>
            {/* Section header */}
            <button
              onClick={() => setExpandedSecs(p => ({ ...p, [section]: !p[section] }))}
              style={{
                width: '100%', padding: '10px 16px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: isExpanded ? '8px 8px 0 0' : 8,
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
            >
              <span style={{ fontSize: 18 }}>{SECTION_ICONS[section] || '📚'}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{section}</span>
              {/* Section progress */}
              <span style={{ fontSize: 11, color: sectionCompleted === sectionTotal ? 'var(--success)' : 'var(--text3)', fontWeight: 600 }}>
                {sectionCompleted}/{sectionTotal}
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 14, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>

            {/* Lessons */}
            {isExpanded && (
              <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {lessons.map((lesson, i) => {
                  const isCompleted  = completedLessonIds.has(lesson.lesson_id)
                  const isActive     = activeLesson?.lesson_id === lesson.lesson_id
                  const isInProgress = inProgressLesson?.lessonId === lesson.lesson_id && !isCompleted

                  return (
                    <div key={lesson.lesson_id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 16px',
                        background: isActive
                          ? 'rgba(0,181,181,0.07)'
                          : isCompleted
                          ? 'rgba(40,167,69,0.04)'
                          : i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
                        borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                        transition: 'background var(--t)',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface2)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isCompleted ? 'rgba(40,167,69,0.04)' : i % 2 === 0 ? 'var(--bg)' : 'var(--surface)' }}
                    >
                      {/* Status icon */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: isCompleted ? 'rgba(40,167,69,0.15)' : isActive ? 'rgba(0,181,181,0.15)' : 'var(--surface3)',
                        border: `1.5px solid ${isCompleted ? 'var(--success)' : isActive ? 'var(--teal)' : 'transparent'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isCompleted ? 13 : 10, fontWeight: 700,
                        color: isCompleted ? 'var(--success)' : isActive ? 'var(--teal)' : 'var(--text3)',
                        flexShrink: 0,
                      }}>
                        {isCompleted ? '✓' : lesson.lesson_id}
                      </div>

                      {/* Title + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 500,
                          color: isCompleted ? 'var(--text2)' : 'var(--text)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          textDecorationColor: 'var(--border2)',
                        }}>
                          {lesson.lesson_title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                          {lesson.steps.length} steps
                          {isInProgress && (
                            <span style={{ marginLeft: 8, color: 'var(--purple)', fontWeight: 600 }}>
                              · Step {inProgressLesson.stepIndex + 1}/{lesson.steps.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      {isActive ? (
                        <button onClick={stopLesson}
                          style={{ padding: '4px 12px', background: 'transparent', border: '1px solid rgba(0,181,181,0.4)', borderRadius: 6, color: '#00b5b5', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ■ Stop
                        </button>
                      ) : isInProgress ? (
                        <button onClick={() => handleResume(lesson.lesson_id, inProgressLesson.stepIndex)}
                          style={{ padding: '5px 12px', background: 'var(--purple)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                          Resume →
                        </button>
                      ) : (
                        <button onClick={() => handleStart(lesson.lesson_id)}
                          style={{
                            padding: '5px 14px',
                            background: isCompleted ? 'transparent' : 'var(--teal)',
                            border: isCompleted ? '1px solid var(--border)' : 'none',
                            borderRadius: 6,
                            color: isCompleted ? 'var(--text3)' : '#fff',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'inherit', whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          {isCompleted ? 'Redo' : 'Start'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 14 }}>
          No lessons match "{search}"
        </div>
      )}
    </div>
  )
}
