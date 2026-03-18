/**
 * progressBridge.js
 * Bridges the ERP task engine (lesson_id 1–81) with the Django
 * backend (file_id integer from LearningFile table).
 *
 * Strategy:
 *  1. Fetch GET /api/progress/dashboard/ once — it returns all files
 *     with their real file_id and title.
 *  2. Build a title-based lookup: normalised(title) → file_id.
 *  3. Match each lesson_title from all_steps.json to a file_id.
 *  4. Cache the map in localStorage so we only fetch once per session.
 *  5. When a lesson completes, POST /api/progress/update/ with
 *     { file_id, completed: true }.
 */

import allSteps from './allSteps.json'

const API_BASE  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const CACHE_KEY = 'erp_lesson_file_map_v1'

/* ── Normalise a string for fuzzy matching ─────────────────────── */
function normalise(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/* ── Build lesson_id → file_id map ────────────────────────────── */
let _mapPromise = null

export async function getLessonFileMap() {
  // Return cached map if already built this session
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) return JSON.parse(cached)
  } catch {}

  if (_mapPromise) return _mapPromise

  _mapPromise = _buildMap()
  return _mapPromise
}

async function _buildMap() {
  const token = localStorage.getItem('access_token')
  if (!token) return {}

  let files = []
  try {
    const res = await fetch(`${API_BASE}/api/progress/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('dashboard fetch failed')
    const data = await res.json()
    // data.sections[].files[].{ id, title }
    for (const section of (data.sections || [])) {
      for (const file of (section.files || [])) {
        files.push({ id: file.id, title: file.title })
      }
    }
  } catch (err) {
    console.warn('[progressBridge] Could not fetch dashboard:', err.message)
    return {}
  }

  // Build normalised title → file_id lookup
  const titleMap = {}
  for (const f of files) {
    titleMap[normalise(f.title)] = f.id
  }

  // Match each lesson_id to a file_id
  const map = {}    // lesson_id (number) → file_id (number)

  for (const lesson of allSteps) {
    const lessonNorm = normalise(lesson.lesson_title)

    // 1. Exact match
    if (titleMap[lessonNorm] !== undefined) {
      map[lesson.lesson_id] = titleMap[lessonNorm]
      continue
    }

    // 2. Substring match (lesson title inside file title, or vice versa)
    let best = null
    for (const [fileTitle, fileId] of Object.entries(titleMap)) {
      if (fileTitle.includes(lessonNorm) || lessonNorm.includes(fileTitle)) {
        best = fileId
        break
      }
    }
    if (best !== null) {
      map[lesson.lesson_id] = best
      continue
    }

    // 3. First-word match (e.g. "Inventory" matches "Inventory Management")
    const firstWord = lessonNorm.split(' ')[0]
    for (const [fileTitle, fileId] of Object.entries(titleMap)) {
      if (fileTitle.startsWith(firstWord)) {
        best = fileId
        break
      }
    }
    if (best !== null) {
      map[lesson.lesson_id] = best
    }
  }

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(map))
  } catch {}

  console.info(`[progressBridge] Mapped ${Object.keys(map).length} / ${allSteps.length} lessons to file IDs`)
  return map
}

/* ── Report a completed lesson to the backend ─────────────────── */
export async function reportLessonComplete(lessonId) {
  const token = localStorage.getItem('access_token')
  if (!token) return   // not logged in — ERP used standalone

  try {
    const map    = await getLessonFileMap()
    const fileId = map[lessonId]

    if (!fileId) {
      console.warn(`[progressBridge] No file_id for lesson_id ${lessonId}`)
      return
    }

    const res = await fetch(`${API_BASE}/api/progress/update/`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_id:   fileId,
        completed: true,
      }),
    })

    if (res.ok) {
      console.info(`[progressBridge] ✓ Reported lesson ${lessonId} (file ${fileId}) as complete`)
    } else {
      console.warn(`[progressBridge] Report failed: ${res.status}`)
    }
  } catch (err) {
    console.warn('[progressBridge] Report error:', err.message)
  }
}

/* ── Report in-progress (slide tracking) ─────────────────────── */
export async function reportLessonProgress(lessonId, stepIndex) {
  const token = localStorage.getItem('access_token')
  if (!token) return

  try {
    const map    = await getLessonFileMap()
    const fileId = map[lessonId]
    if (!fileId) return

    await fetch(`${API_BASE}/api/progress/update/`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_id:     fileId,
        slide_index: stepIndex,
        completed:   false,
      }),
    })
  } catch {}
}

/* ── Prefetch the map on module load (non-blocking) ──────────────*/
getLessonFileMap().catch(() => {})
