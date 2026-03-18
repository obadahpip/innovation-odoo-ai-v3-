/**
 * lessonLoader.js
 * 
 * Loads lesson_N.json by lesson ID.
 * Uses Vite's dynamic import() so the JSON files are lazy-loaded
 * only when a specific lesson is opened.
 * 
 * Falls back to all_steps.json for the flat step list.
 */

// Cache so we don't reload on every re-render
const cache = {}

/**
 * Load full lesson detail (screens + elements) from lesson_N.json
 * Returns the lesson object or null if not found.
 */
export async function loadLesson(lessonId) {
  const id = parseInt(lessonId)
  if (cache[id]) return cache[id]

  try {
    // Vite resolves these at build time using dynamic import glob
    const module = await import(`../../../public/lessons/lesson_${id}.json`)
    const lesson = module.default ?? module
    cache[id] = lesson
    return lesson
  } catch {
    // lesson_N.json not found — fall back to all_steps.json entry
    try {
      const all = await import('../../../public/lessons/all_steps.json')
      const data = all.default ?? all
      const entry = Array.isArray(data) ? data.find(l => l.lesson_id === id) : null
      if (entry) { cache[id] = entry; return entry }
    } catch {}
    return null
  }
}

/**
 * Extract flat ordered step list from a lesson object.
 * Works with both lesson_N.json format (screens_needed) and
 * all_steps.json format (steps array directly).
 */
export function extractSteps(lesson) {
  if (!lesson) return []

  // all_steps.json format: { lesson_id, steps: [...] }
  if (Array.isArray(lesson.steps)) {
    return lesson.steps.sort((a, b) => a.step_order - b.step_order)
  }

  // lesson_N.json format: { screens_needed: [{ elements: [{ related_steps }] }] }
  if (Array.isArray(lesson.screens_needed)) {
    const flat = []
    for (const screen of lesson.screens_needed) {
      for (const el of screen.elements ?? []) {
        for (const step of el.related_steps ?? []) {
          flat.push({
            ...step,
            element_id:          el.element_id,
            highlight_selector:  el.element_id,   // element_id IS the selector
            odoo_screen_target:  screen.screen_key,
            element_label:       el.label,
            element_type:        el.type,
          })
        }
      }
    }
    return flat.sort((a, b) => a.step_order - b.step_order)
  }

  return []
}

/**
 * Load all_steps.json (used for lesson index / navigation)
 */
let _allSteps = null
export async function loadAllSteps() {
  if (_allSteps) return _allSteps
  try {
    const m = await import('../../../public/lessons/all_steps.json')
    _allSteps = m.default ?? m
    return _allSteps
  } catch {
    return []
  }
}
