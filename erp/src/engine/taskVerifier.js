/**
 * taskVerifier.js
 * Watches DOM interactions and calls engine.completeStep()
 * when the user's action matches the current step's requirements.
 *
 * Strategy:
 *  - 'navigate'  → completes automatically when _navigateToStep fires
 *  - 'click'     → completes when user clicks any element matching highlight_selector
 *  - 'type'      → completes when user types into any field matching highlight_selector
 *  - 'observe'   → auto-completes after 1.5s (no user action required)
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

  const sel    = step.highlight_selector   // e.g. "new-button", "field-name"
  const action = step.action_type          // navigate | click | type | observe

  // ── observe: auto-complete ─────────────────────────────────────
  if (action === 'observe') {
    const timer = setTimeout(done, 1800)
    _unsubscribe = () => clearTimeout(timer)
    return
  }

  // ── navigate: complete immediately (navigation already triggered) ─
  if (action === 'navigate') {
    const timer = setTimeout(done, 400)
    _unsubscribe = () => clearTimeout(timer)
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
      // Accept click on element with matching data-erp, or on ancestor/descendant
      const targets = findTargets()
      for (const t of targets) {
        if (t.contains(e.target) || e.target.closest(`[data-erp="${sel}"]`)) {
          done()
          return
        }
      }
      // If no selector, accept any meaningful click
      if (!sel) {
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

      // Match: element has data-erp matching selector
      const directMatch = sel && dataErp === sel
      // Match: selector absent — any input/textarea/select is fine
      const openMatch   = !sel && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      // Match: ancestor has data-erp matching selector (e.g. field inside a wrapper)
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

  // ── fallback: complete on any click after 500ms ────────────────
  const timer = setTimeout(done, 500)
  _unsubscribe = () => clearTimeout(timer)
}

export function stopWatching() {
  if (_unsubscribe) {
    _unsubscribe()
    _unsubscribe = null
  }
}
