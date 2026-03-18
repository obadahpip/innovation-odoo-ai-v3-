/**
 * enginePersistence.js
 * Persists task engine state across page refreshes using IndexedDB.
 *
 * Stores:
 *  - completedLessonIds: Set<number>  — lessons fully completed
 *  - inProgressLesson:   { lessonId, stepIndex } | null
 *
 * Uses idb (already a project dependency from the inventory module).
 * Falls back to localStorage if IndexedDB is unavailable.
 */

const DB_NAME    = 'erp-task-engine'
const DB_VERSION = 1
const STORE      = 'engine-state'
const KEY_COMPLETED   = 'completedLessons'
const KEY_IN_PROGRESS = 'inProgressLesson'

/* ── Open DB ────────────────────────────────────────────────────── */
let _dbPromise = null

async function getDB() {
  if (_dbPromise) return _dbPromise
  _dbPromise = (async () => {
    if (typeof window === 'undefined') return null
    try {
      const { openDB } = await import('idb')
      return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE)
          }
        },
      })
    } catch {
      return null   // IDB unavailable — will use localStorage fallback
    }
  })()
  return _dbPromise
}

/* ── Generic get/set with localStorage fallback ────────────────── */
async function persist(key, value) {
  try {
    const db = await getDB()
    if (db) {
      await db.put(STORE, value, key)
    } else {
      localStorage.setItem(`erp_engine_${key}`, JSON.stringify(value))
    }
  } catch (err) {
    try {
      localStorage.setItem(`erp_engine_${key}`, JSON.stringify(value))
    } catch {}
  }
}

async function retrieve(key) {
  try {
    const db = await getDB()
    if (db) {
      return await db.get(STORE, key)
    }
    const raw = localStorage.getItem(`erp_engine_${key}`)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    try {
      const raw = localStorage.getItem(`erp_engine_${key}`)
      return raw ? JSON.parse(raw) : undefined
    } catch {
      return undefined
    }
  }
}

/* ── Public API ─────────────────────────────────────────────────── */

/** Load completed lesson IDs from storage */
export async function loadCompletedLessons() {
  const stored = await retrieve(KEY_COMPLETED)
  if (Array.isArray(stored)) return new Set(stored)
  return new Set()
}

/** Save completed lesson IDs to storage */
export async function saveCompletedLessons(completedSet) {
  await persist(KEY_COMPLETED, [...completedSet])
}

/** Mark a single lesson as completed */
export async function markLessonComplete(lessonId) {
  const current = await loadCompletedLessons()
  current.add(Number(lessonId))
  await saveCompletedLessons(current)
}

/** Load last in-progress lesson (to offer "resume") */
export async function loadInProgressLesson() {
  return retrieve(KEY_IN_PROGRESS) ?? null
}

/** Save current lesson progress */
export async function saveInProgressLesson(lessonId, stepIndex) {
  await persist(KEY_IN_PROGRESS, { lessonId: Number(lessonId), stepIndex: Number(stepIndex) })
}

/** Clear in-progress state (called on lesson complete or stop) */
export async function clearInProgressLesson() {
  await persist(KEY_IN_PROGRESS, null)
}

/** Check if a lesson has been completed */
export async function isLessonCompleted(lessonId) {
  const set = await loadCompletedLessons()
  return set.has(Number(lessonId))
}

/** Get all completed lesson IDs as an array */
export async function getCompletedLessonIds() {
  const set = await loadCompletedLessons()
  return [...set]
}

/** Clear all progress (for testing / reset) */
export async function clearAllProgress() {
  await persist(KEY_COMPLETED, [])
  await persist(KEY_IN_PROGRESS, null)
}
