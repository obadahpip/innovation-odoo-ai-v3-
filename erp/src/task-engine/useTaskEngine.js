/**
 * useTaskEngine.js
 * 
 * The brain of the task system.
 * 
 * Responsibilities:
 *  - Load lesson steps from lesson_N.json
 *  - Track current step index
 *  - Watch action_log (IndexedDB) for actions matching current step
 *  - Auto-advance on matching action OR wait for manual Next
 *  - Route ERP to the correct screen when step changes
 *  - Collect completed action log for AI verification
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadLesson, extractSteps } from './lessonLoader.js'
import { getRouteForScreen } from './screenRoutes.js'
import { listRecords } from '@data/db.js'

const AUTO_ADVANCE_TYPES = ['navigate', 'observe']  // these auto-advance; click/type require user confirmation

export function useTaskEngine(lessonId) {
  const navigate = useNavigate()

  const [lesson,      setLesson]      = useState(null)
  const [steps,       setSteps]       = useState([])
  const [stepIndex,   setStepIndex]   = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [completed,   setCompleted]   = useState(false)
  const [actionLog,   setActionLog]   = useState([])
  const [hint,        setHint]        = useState(null)
  const [stepDone,    setStepDone]    = useState(false)   // current step manually confirmed

  const pollRef   = useRef(null)
  const indexRef  = useRef(0)
  indexRef.current = stepIndex

  // ── Load lesson on mount ────────────────────────────────────────
  useEffect(() => {
    if (!lessonId) return
    setLoading(true)
    loadLesson(lessonId).then(data => {
      setLesson(data)
      const extracted = extractSteps(data)
      setSteps(extracted)
      setStepIndex(0)
      setCompleted(false)
      setLoading(false)
    })
  }, [lessonId])

  const currentStep = steps[stepIndex] ?? null

  // ── Navigate ERP to correct screen when step changes ──────────
  useEffect(() => {
    if (!currentStep?.odoo_screen_target) return
    const route = getRouteForScreen(currentStep.odoo_screen_target)
    if (route && route !== '/erp') {
      // Small delay so the overlay animation isn't interrupted
      const t = setTimeout(() => navigate(route), 300)
      return () => clearTimeout(t)
    }
  }, [stepIndex, currentStep?.odoo_screen_target, navigate])

  // ── Poll action_log for auto-advance (navigate / observe) ─────
  useEffect(() => {
    if (!currentStep) return
    if (!AUTO_ADVANCE_TYPES.includes(currentStep.action_type)) return

    // Auto-advance after a short delay for observe/navigate steps
    const t = setTimeout(() => {
      advanceStep()
    }, currentStep.action_type === 'observe' ? 2500 : 1200)

    return () => clearTimeout(t)
  }, [stepIndex, currentStep])

  // ── Watch action_log for click/type actions ───────────────────
  useEffect(() => {
    if (!currentStep) return
    if (AUTO_ADVANCE_TYPES.includes(currentStep.action_type)) return

    let active = true

    const poll = async () => {
      if (!active) return
      try {
        const logs = await listRecords('action_log', { sortKey: 'timestamp', sortDir: 'desc', limit: 50 })
        const relevant = logs.filter(l => {
          // Match by selector or by action type
          const selectorMatch = currentStep.highlight_selector &&
            (l.field === currentStep.highlight_selector ||
             l.context?.selector === currentStep.highlight_selector)
          const actionMatch = l.action === currentStep.action_type
          return actionMatch || selectorMatch
        })
        if (relevant.length > 0) {
          setStepDone(true)
        }
      } catch {}
    }

    const interval = setInterval(poll, 1000)
    return () => { active = false; clearInterval(interval) }
  }, [stepIndex, currentStep])

  // ── Advance to next step ────────────────────────────────────────
  const advanceStep = useCallback(async () => {
    setStepDone(false)
    setHint(null)

    // Collect action log for this step
    try {
      const logs = await listRecords('action_log', { sortKey: 'timestamp', sortDir: 'desc', limit: 100 })
      setActionLog(prev => [...prev, ...logs.slice(0, 5)])
    } catch {}

    const nextIndex = indexRef.current + 1
    if (nextIndex >= steps.length) {
      setCompleted(true)
    } else {
      setStepIndex(nextIndex)
    }
  }, [steps.length])

  // ── Skip step ────────────────────────────────────────────────────
  const skipStep = useCallback(() => {
    advanceStep()
  }, [advanceStep])

  // ── Go back to previous step ──────────────────────────────────
  const prevStep = useCallback(() => {
    setStepDone(false)
    setHint(null)
    setStepIndex(i => Math.max(0, i - 1))
  }, [])

  // ── Show hint ─────────────────────────────────────────────────
  const showHint = useCallback(() => {
    if (!currentStep) return
    const hints = {
      navigate: `Navigate to the highlighted section in the left sidebar or top menu.`,
      click:    `Find the highlighted element and click on it.`,
      type:     `Click on the highlighted field and type the required information.`,
      observe:  `Look at the highlighted area — no action needed here.`,
    }
    setHint(hints[currentStep.action_type] ?? 'Follow the instruction above.')
  }, [currentStep])

  // ── Reset lesson ──────────────────────────────────────────────
  const resetLesson = useCallback(() => {
    setStepIndex(0)
    setCompleted(false)
    setActionLog([])
    setHint(null)
    setStepDone(false)
  }, [])

  // ── Build action summary for AI verification ──────────────────
  const buildSummary = useCallback(async () => {
    const logs = await listRecords('action_log', { sortKey: 'timestamp', sortDir: 'asc', limit: 200 })
    return {
      lesson_id:    lessonId,
      lesson_title: lesson?.lesson_title,
      total_steps:  steps.length,
      completed_steps: stepIndex,
      actions:      logs.map(l => ({
        action:    l.action,
        model:     l.model,
        field:     l.field,
        value:     l.new_value,
        timestamp: l.timestamp,
      })),
    }
  }, [lessonId, lesson, steps, stepIndex])

  return {
    lesson,
    steps,
    currentStep,
    stepIndex,
    totalSteps:   steps.length,
    loading,
    completed,
    stepDone,
    hint,
    actionLog,
    advanceStep,
    prevStep,
    skipStep,
    showHint,
    resetLesson,
    buildSummary,
    progress: steps.length > 0 ? Math.round((stepIndex / steps.length) * 100) : 0,
  }
}
