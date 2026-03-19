/**
 * ERPLauncher.jsx
 * Mounted at /erp/launch — reads a URL param and auto-starts the matching lesson.
 *
 * URL patterns accepted:
 *   /erp/launch?title=Activities         — match by lesson title (fuzzy)
 *   /erp/launch?lesson=3                 — match by lesson_id directly
 *   /erp/launch                          — no param → redirect to /erp/lessons
 *
 * After starting the lesson it navigates to the first step's screen.
 * Shows a brief "Launching…" splash while matching.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTaskEngine, ALL_LESSONS } from './useTaskEngine.js'
import { SCREEN_ROUTES } from './taskRoutes.js'

function normalise(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function findLesson(titleParam, lessonParam) {
  // Direct id match
  if (lessonParam) {
    const id = parseInt(lessonParam)
    const found = ALL_LESSONS.find(l => l.lesson_id === id)
    if (found) return found
  }

  if (!titleParam) return null
  const norm = normalise(titleParam)

  // Exact match
  let found = ALL_LESSONS.find(l => normalise(l.lesson_title) === norm)
  if (found) return found

  // Substring match
  found = ALL_LESSONS.find(l =>
    normalise(l.lesson_title).includes(norm) || norm.includes(normalise(l.lesson_title))
  )
  if (found) return found

  // First word match
  const firstWord = norm.split(' ')[0]
  found = ALL_LESSONS.find(l => normalise(l.lesson_title).startsWith(firstWord))
  return found || null
}

export default function ERPLauncher() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const { startLesson } = useTaskEngine()
  const [status, setStatus] = useState('matching')  // matching | found | not_found

  const titleParam  = params.get('title')
  const lessonParam = params.get('lesson')

  useEffect(() => {
    const lesson = findLesson(titleParam, lessonParam)

    if (!lesson) {
      setStatus('not_found')
      // Redirect to lesson library after 1.5s
      setTimeout(() => navigate('/erp/lessons'), 1500)
      return
    }

    setStatus('found')

    // Always start at home — step 1 of every lesson is a navigate action
    // that highlights the correct app icon and guides the user there.
    const route = '/erp/home'

    // Short delay so the route has time to render before engine starts watching
    setTimeout(() => {
      navigate(route)
      setTimeout(() => startLesson(lesson.lesson_id), 300)
    }, 600)
  }, [])

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', gap: 16,
    }}>
      {status === 'matching' || status === 'found' ? (
        <>
          {/* Spinner */}
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid var(--surface3)',
            borderTopColor: 'var(--teal)',
            animation: 'erp-spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes erp-spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            {status === 'found'
              ? `Launching simulation…`
              : 'Finding lesson…'}
          </div>
          {titleParam && (
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>{titleParam}</div>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: 32 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Lesson not found
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            Opening lesson library…
          </div>
        </>
      )}
    </div>
  )
}