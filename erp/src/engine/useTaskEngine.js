/**
 * useTaskEngine.js  — v2
 * Central Zustand store for the guided task engine.
 *
 * New in v2:
 *  - Calls progressBridge.reportLessonComplete() on lesson finish
 *  - Calls progressBridge.reportLessonProgress() every few steps
 *  - Persists completed lessons + in-progress state via enginePersistence
 *  - Exposes resumeLesson() to restore a partially-done lesson
 *  - Loads persisted completedLessonIds on first import
 */
import { create } from 'zustand'
import { SCREEN_ROUTES, APP_SELECTOR_ROUTES } from './taskRoutes.js'
import allStepsRaw from './allSteps.json'
import { reportLessonComplete, reportLessonProgress } from './progressBridge.js'
import {
  loadCompletedLessons,
  saveCompletedLessons,
  markLessonComplete,
  loadInProgressLesson,
  saveInProgressLesson,
  clearInProgressLesson,
} from './enginePersistence.js'

// ── Index lessons by id ────────────────────────────────────────
const LESSONS_BY_ID = {}
for (const lesson of allStepsRaw) {
  LESSONS_BY_ID[lesson.lesson_id] = lesson
}

export const ALL_LESSONS = allStepsRaw

// ── Store ─────────────────────────────────────────────────────
export const useTaskEngine = create((set, get) => ({
  // State
  activeLesson:       null,
  currentStepIndex:   0,
  status:             'idle',          // idle | running | step_complete | lesson_complete
  waitingForAction:   false,
  highlightSelector:  null,
  navigateFn:         null,
  completedLessonIds: new Set(),       // loaded from IndexedDB on init
  inProgressLesson:   null,            // { lessonId, stepIndex } or null
  hydrated:           false,           // true once persistence is loaded

  // ── Hydrate from storage on first use ─────────────────────────
  hydrate: async () => {
    if (get().hydrated) return
    const [completed, inProgress] = await Promise.all([
      loadCompletedLessons(),
      loadInProgressLesson(),
    ])
    set({
      completedLessonIds: completed,
      inProgressLesson:   inProgress,
      hydrated:           true,
    })
  },

  // ── Inject navigate fn ─────────────────────────────────────────
  setNavigate: (fn) => set({ navigateFn: fn }),

  // ── Start a lesson ─────────────────────────────────────────────
  startLesson: (lessonId) => {
    const lesson = LESSONS_BY_ID[lessonId]
    if (!lesson) { console.warn('Lesson not found:', lessonId); return }

    set({
      activeLesson:      lesson,
      currentStepIndex:  0,
      status:            'running',
      waitingForAction:  true,
      highlightSelector: lesson.steps[0]?.highlight_selector || null,
    })

    // Save in-progress state
    saveInProgressLesson(lessonId, 0)

    get()._navigateToStep(lesson.steps[0])
  },

  // ── Resume a partially-completed lesson ────────────────────────
  resumeLesson: (lessonId, fromStepIndex = 0) => {
    const lesson = LESSONS_BY_ID[lessonId]
    if (!lesson) return
    const idx  = Math.min(fromStepIndex, lesson.steps.length - 1)
    const step = lesson.steps[idx]

    set({
      activeLesson:      lesson,
      currentStepIndex:  idx,
      status:            'running',
      waitingForAction:  true,
      highlightSelector: step?.highlight_selector || null,
    })

    saveInProgressLesson(lessonId, idx)
    get()._navigateToStep(step)
  },

  // ── Stop / exit ────────────────────────────────────────────────
  stopLesson: () => {
    clearInProgressLesson()
    set({
      activeLesson:      null,
      currentStepIndex:  0,
      status:            'idle',
      waitingForAction:  false,
      highlightSelector: null,
      inProgressLesson:  null,
    })
  },

  // ── Complete current step ──────────────────────────────────────
  completeStep: () => {
    const { activeLesson, currentStepIndex, completedLessonIds } = get()
    if (!activeLesson) return

    const nextIndex = currentStepIndex + 1
    const isLast    = nextIndex >= activeLesson.steps.length

    if (isLast) {
      // ── LESSON COMPLETE ──────────────────────────────────────
      const newCompleted = new Set(completedLessonIds)
      newCompleted.add(activeLesson.lesson_id)

      set({
        completedLessonIds: newCompleted,
        status:             'lesson_complete',
        waitingForAction:   false,
        highlightSelector:  null,
        inProgressLesson:   null,
      })

      // Persist + report to backend (both non-blocking)
      markLessonComplete(activeLesson.lesson_id)
      clearInProgressLesson()
      reportLessonComplete(activeLesson.lesson_id)

    } else {
      // ── ADVANCE TO NEXT STEP ─────────────────────────────────
      const nextStep = activeLesson.steps[nextIndex]

      set({
        currentStepIndex:  nextIndex,
        status:            'running',
        waitingForAction:  true,
        highlightSelector: nextStep.highlight_selector || null,
      })

      // Persist progress every 3 steps to avoid excessive writes
      if (nextIndex % 3 === 0) {
        saveInProgressLesson(activeLesson.lesson_id, nextIndex)
        reportLessonProgress(activeLesson.lesson_id, nextIndex)
      }

      get()._navigateToStep(nextStep)
    }
  },

  // ── Skip current step ──────────────────────────────────────────
  skipStep: () => {
    const { activeLesson, currentStepIndex } = get()
    if (!activeLesson) return
    const nextIndex = currentStepIndex + 1
    if (nextIndex >= activeLesson.steps.length) {
      // Treat skip on last step as completion
      get().completeStep()
      return
    }
    const nextStep = activeLesson.steps[nextIndex]
    set({
      currentStepIndex:  nextIndex,
      status:            'running',
      waitingForAction:  true,
      highlightSelector: nextStep.highlight_selector || null,
    })
    get()._navigateToStep(nextStep)
  },

  // ── Internal: navigate to step's screen ───────────────────────
  _navigateToStep: (step) => {
    const { navigateFn } = get()
    if (!navigateFn || !step) return

    if (step.action_type === 'navigate') {
      if (step.highlight_selector && APP_SELECTOR_ROUTES[step.highlight_selector]) {
        navigateFn(APP_SELECTOR_ROUTES[step.highlight_selector])
        return
      }
      const route = SCREEN_ROUTES[step.odoo_screen_target]
      if (route) navigateFn(route)
    }
  },

  // ── Helpers ────────────────────────────────────────────────────
  getCurrentStep: () => {
    const { activeLesson, currentStepIndex } = get()
    if (!activeLesson) return null
    return activeLesson.steps[currentStepIndex] || null
  },

  getProgress: () => {
    const { activeLesson, currentStepIndex } = get()
    if (!activeLesson) return 0
    return Math.round((currentStepIndex / activeLesson.steps.length) * 100)
  },

  isCompleted: (lessonId) => {
    return get().completedLessonIds.has(Number(lessonId))
  },
}))

// ── Auto-hydrate on import ─────────────────────────────────────
useTaskEngine.getState().hydrate()
