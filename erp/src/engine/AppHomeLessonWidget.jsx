/**
 * AppHomeLessonWidget.jsx
 * Drop-in widget rendered inside AppHome to give quick access
 * to the lesson library and show active lesson status.
 *
 * Import this in AppHome.jsx and render it near the top
 * of the module grid.
 */
import { useNavigate } from 'react-router-dom'
import { useTaskEngine, ALL_LESSONS } from '../engine/useTaskEngine.js'

export default function AppHomeLessonWidget() {
  const navigate = useNavigate()
  const { activeLesson, stopLesson } = useTaskEngine()

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,181,181,0.15) 0%, rgba(113,75,103,0.15) 100%)',
      border: '1px solid rgba(0,181,181,0.3)',
      borderRadius: 12, padding: '16px 20px',
      marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 36 }}>📋</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
          Innovation Odoo AI — Lesson Library
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          {ALL_LESSONS.length} guided lessons · Step-by-step walkthroughs of every Odoo module
        </div>
        {activeLesson && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#00b5b5', fontWeight: 600 }}>
            ▶ Active: {activeLesson.lesson_title}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {activeLesson && (
          <button onClick={stopLesson}
            style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Stop
          </button>
        )}
        <button onClick={() => navigate('/erp/lessons')}
          style={{
            padding: '8px 18px',
            background: '#00b5b5', border: 'none',
            borderRadius: 7, color: '#fff',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>
          Open Library
        </button>
      </div>
    </div>
  )
}
