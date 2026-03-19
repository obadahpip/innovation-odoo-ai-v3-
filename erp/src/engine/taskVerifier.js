/**
 * taskVerifier.js
 * Watches DOM interactions and calls engine.completeStep()
 * when the user's action matches the current step's requirements.
 *
 * Action types:
 *  - 'navigate'  → waits for user to CLICK the highlighted app selector
 *                  (e.g. app-crm, app-contacts). This keeps the user on
 *                  the home screen and lets them actually click the app icon.
 *  - 'click'     → completes when user clicks any element matching highlight_selector
 *  - 'type'      → completes when user types into any field matching highlight_selector
 *  - 'observe'   → auto-completes after 1.8s (no user action required)
 */

let _unsubscribe = null

/**
 * Start watching. Called by TaskEngineProvider on each new step.
 * @param {object} step   — the current step
 * @param {function} done — call this to advance to next step
 */
export function watchStep(step, done) {
  stopWatching()
  if (!step) return

  const sel    = step.highlight_selector   // e.g. "app-crm", "new-button"
  const action = step.action_type          // navigate | click | type | observe

  // ── observe: auto-complete after delay ────────────────────────
  if (action === 'observe') {
    const timer = setTimeout(done, 1800)
    _unsubscribe = () => clearTimeout(timer)
    return
  }

  // ── navigate: wait for user to CLICK the highlighted app icon ──
  // This is intentional — step 1 always navigates to an app from home.
  // We highlight the app icon and wait for the user to click it.
  // Do NOT auto-advance: the user should see home and click the icon themselves.
  if (action === 'navigate') {
    const handler = (e) => {
      if (sel) {
        // Accept click on the highlighted element or any ancestor/descendant
        const matched =
          e.target.closest(`[data-erp="${sel}"]`) ||
          e.target.getAttribute?.('data-erp') === sel

        if (matched) {
          done()
          return
        }

        // Also accept clicking a button/link inside an element with data-erp matching sel
        const targets = document.querySelectorAll(`[data-erp="${sel}"]`)
        for (const t of targets) {
          if (t.contains(e.target)) {
            done()
            return
          }
        }
      } else {
        // No selector — accept any button/link click (fallback)
        const tag = e.target.tagName.toLowerCase()
        if (['button', 'a'].includes(tag)) done()
      }
    }
    document.addEventListener('click', handler, true)
    _unsubscribe = () => document.removeEventListener('click', handler, true)
    return
  }

  // ── click / type: watch for matching element interaction ────────
  function findTargets() {
    if (!sel) return document.querySelectorAll('button, input, select, textarea, [data-erp]')
    return document.querySelectorAll(`[data-erp="${sel}"]`)
  }

  // ── click ──────────────────────────────────────────────────────
  if (action === 'click') {
    const handler = (e) => {
      if (sel) {
        const matched =
          e.target.closest(`[data-erp="${sel}"]`) ||
          e.target.getAttribute?.('data-erp') === sel

        if (matched) { done(); return }

        const targets = findTargets()
        for (const t of targets) {
          if (t.contains(e.target)) { done(); return }
        }
      } else {
        // No selector — accept any meaningful click
        const tag = e.target.tagName.toLowerCase()
        if (['button', 'a', 'input', 'select'].includes(tag)) done()
      }
    }
    document.addEventListener('click', handler, true)
    _unsubscribe = () => document.removeEventListener('click', handler, true)
    return
  }

  // ── type (input/change) ────────────────────────────────────────
  if (action === 'type') {
    let debounceTimer = null

    const handler = (e) => {
      const target  = e.target
      const dataErp = target.getAttribute?.('data-erp')

      const directMatch   = sel && dataErp === sel
      const openMatch     = !sel && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      const ancestorMatch = sel && target.closest?.(`[data-erp="${sel}"]`)

      if (directMatch || openMatch || ancestorMatch) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(done, 600)
      }
    }

    document.addEventListener('input',  handler, true)
    document.addEventListener('change', handler, true)
    _unsubscribe = () => {
      clearTimeout(debounceTimer)
      document.removeEventListener('input',  handler, true)
      document.removeEventListener('change', handler, true)
    }
    return
  }

  // ── fallback: complete on any click ───────────────────────────
  const handler = (e) => {
    const tag = e.target.tagName.toLowerCase()
    if (['button', 'a', 'input', 'select'].includes(tag)) done()
  }
  document.addEventListener('click', handler, true)
  _unsubscribe = () => document.removeEventListener('click', handler, true)
}

export function stopWatching() {
  if (_unsubscribe) {
    _unsubscribe()
    _unsubscribe = null
  }
}