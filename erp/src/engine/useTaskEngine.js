/**
 * useTaskEngine.js  — v3
 * Key fix: _navigateToStep no longer auto-navigates for 'navigate' action steps.
 * The user must click the highlighted app icon themselves — that click is what
 * completes the step and naturally takes them to the right screen.
 * skipStep still navigates when skipping a navigate step.
 */
import { create } from 'zustand'
import { SCREEN_ROUTES, APP_SELECTOR_ROUTES } from './taskRoutes.js'
import allStepsRaw from './allSteps.json'
import { reportLessonComplete, reportLessonProgress } from './progressBridge.js'
import {
  loadCompletedLessons,
  markLessonComplete,
  loadInProgressLesson,
  saveInProgressLesson,
  clearInProgressLesson,
} from './enginePersistence.js'

const LESSONS_BY_ID = {}
for (const lesson of allStepsRaw) {
  LESSONS_BY_ID[lesson.lesson_id] = lesson
}

export const ALL_LESSONS = allStepsRaw

export const useTaskEngine = create((set, get) => ({
  activeLesson:       null,
  currentStepIndex:   0,
  status:             'idle',
  waitingForAction:   false,
  highlightSelector:  null,
  navigateFn:         null,
  completedLessonIds: new Set(),
  inProgressLesson:   null,
  hydrated:           false,

  // ── Hydrate ────────────────────────────────────────────────────
  hydrate: async () => {
    if (get().hydrated) return
    const [completed, inProgress] = await Promise.all([
      loadCompletedLessons(),
      loadInProgressLesson(),
    ])
    set({ completedLessonIds: completed, inProgressLesson: inProgress, hydrated: true })
  },

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
      // Highlight step 0's selector so the user knows what to click
      highlightSelector: lesson.steps[0]?.highlight_selector || null,
    })

    saveInProgressLesson(lessonId, 0)
    // Do NOT call _navigateToStep here for step 0 — we already navigated
    // to /erp/home in ERPLauncher/LessonSelector. Just show the highlight.
  },

  // ── Resume ─────────────────────────────────────────────────────
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
    // For resume: navigate to the correct screen (user may be on wrong screen)
    get()._doNavigate(step)
  },

  // ── Stop ───────────────────────────────────────────────────────
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
      const newCompleted = new Set(completedLessonIds)
      newCompleted.add(activeLesson.lesson_id)
      set({
        completedLessonIds: newCompleted,
        status:             'lesson_complete',
        waitingForAction:   false,
        highlightSelector:  null,
        inProgressLesson:   null,
      })
      markLessonComplete(activeLesson.lesson_id)
      clearInProgressLesson()
      reportLessonComplete(activeLesson.lesson_id)
    } else {
      const nextStep = activeLesson.steps[nextIndex]
      set({
        currentStepIndex:  nextIndex,
        status:            'running',
        waitingForAction:  true,
        highlightSelector: nextStep.highlight_selector || null,
      })
      if (nextIndex % 3 === 0) {
        saveInProgressLesson(activeLesson.lesson_id, nextIndex)
        reportLessonProgress(activeLesson.lesson_id, nextIndex)
      }
      // For navigate steps: do NOT auto-navigate — let user click the highlighted element.
      // For non-navigate steps: screen guard in TaskEngineProvider handles it.
      // No call to _navigateToStep here intentionally.
    }
  },

  // ── Skip current step ──────────────────────────────────────────
  skipStep: () => {
    const { activeLesson, currentStepIndex } = get()
    if (!activeLesson) return

    const skippedStep = activeLesson.steps[currentStepIndex]
    const nextIndex   = currentStepIndex + 1

    if (nextIndex >= activeLesson.steps.length) {
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

    // When SKIPPING a navigate step: actually perform the navigation
    // so the user ends up on the right screen even though they didn't click.
    if (skippedStep?.action_type === 'navigate') {
      get()._doNavigate(skippedStep)
    }
  },

  // ── Internal: actually perform navigation ──────────────────────
  // Used only by resumeLesson and skipStep (not startLesson/completeStep).
  _doNavigate: (step) => {
    const { navigateFn } = get()
    if (!navigateFn || !step) return

    if (step.highlight_selector && APP_SELECTOR_ROUTES[step.highlight_selector]) {
      navigateFn(APP_SELECTOR_ROUTES[step.highlight_selector])
      return
    }
    const route = SCREEN_ROUTES[step.odoo_screen_target]
    if (route) navigateFn(route)
  },

  // ── Legacy alias (keep for TaskEngineProvider screen guard) ────
  _navigateToStep: (step) => {
    // Intentionally a no-op for navigate steps.
    // Non-navigate screen routing handled by TaskEngineProvider.
  },

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

  isCompleted: (lessonId) => get().completedLessonIds.has(Number(lessonId)),
}))

useTaskEngine.getState().hydrate()