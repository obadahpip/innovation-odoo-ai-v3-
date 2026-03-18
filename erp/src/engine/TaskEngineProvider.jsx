/**
 * TaskEngineProvider.jsx
 * Wrap the ERP app with this to enable the task engine.
 * Responsibilities:
 *  1. Inject the router's navigate function into the store
 *  2. Watch for step changes and start the verifier
 *  3. Render TaskOverlay and StepHighlighter
 */
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTaskEngine } from './useTaskEngine.js'
import { watchStep, stopWatching } from './taskVerifier.js'
import TaskOverlay from './TaskOverlay.jsx'
import StepHighlighter from './StepHighlighter.jsx'
import { SCREEN_ROUTES } from './taskRoutes.js'

export default function TaskEngineProvider({ children }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const {
    setNavigate, activeLesson, currentStepIndex,
    status, completeStep, highlightSelector,
  } = useTaskEngine()

  /* ── 1. Inject navigate once ─────────────────────────────────── */
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  /* ── 2. When step changes, restart verifier ──────────────────── */
  useEffect(() => {
    if (!activeLesson || status !== 'running') {
      stopWatching()
      return
    }
    const step = activeLesson.steps[currentStepIndex]
    if (!step) return
    watchStep(step, completeStep)
    return () => stopWatching()
  }, [activeLesson, currentStepIndex, status])

  /* ── 3. Screen guard: if current step requires a different screen,
          navigate there when we detect we're on the wrong page ──── */
  useEffect(() => {
    if (!activeLesson || status !== 'running') return
    const step = activeLesson.steps[currentStepIndex]
    if (!step || step.action_type === 'navigate') return

    const expectedRoute = SCREEN_ROUTES[step.odoo_screen_target]
    if (!expectedRoute) return

    // Check if current location starts with expected route base
    const expectedBase = expectedRoute.split('/').slice(0, 3).join('/')  // e.g. /erp/crm
    const currentBase  = location.pathname.split('/').slice(0, 3).join('/')

    if (currentBase !== expectedBase) {
      navigate(expectedRoute)
    }
  }, [currentStepIndex])

  return (
    <>
      {children}
      <TaskOverlay />
      <StepHighlighter selector={highlightSelector} />
    </>
  )
}
