/**
 * StepHighlighter.jsx
 * Finds the DOM element with data-erp="<selector>" and renders
 * an animated highlight ring around it using a portal.
 * Repositions on scroll/resize.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function StepHighlighter({ selector }) {
  const [rect, setRect] = useState(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!selector) { setRect(null); return }

    function measure() {
      const el = document.querySelector(`[data-erp="${selector}"]`)
      if (!el) { setRect(null); return }
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) { setRect(null); return }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }

    // Poll every 300ms to handle dynamic content / route changes
    measure()
    const interval = setInterval(measure, 300)

    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [selector])

  if (!rect) return null

  const PAD = 6

  return createPortal(
    <>
      {/* Darkened overlay with cut-out around target */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 8998 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left - PAD} y={rect.top - PAD}
              width={rect.width + PAD * 2} height={rect.height + PAD * 2}
              rx="7" fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.35)" mask="url(#spotlight-mask)" />
      </svg>

      {/* Glowing highlight ring */}
      <div style={{
        position:  'fixed',
        top:       rect.top  - PAD,
        left:      rect.left - PAD,
        width:     rect.width  + PAD * 2,
        height:    rect.height + PAD * 2,
        borderRadius: 7,
        border:    '2.5px solid #00b5b5',
        boxShadow: '0 0 0 3px rgba(0,181,181,0.25), 0 0 20px rgba(0,181,181,0.4)',
        pointerEvents: 'none',
        zIndex:    8999,
        animation: 'erp-pulse 1.6s ease-in-out infinite',
      }} />

      {/* Arrow pointer from overlay toward element */}
      <style>{`
        @keyframes erp-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(0,181,181,0.25), 0 0 16px rgba(0,181,181,0.35); }
          50%      { box-shadow: 0 0 0 6px rgba(0,181,181,0.15), 0 0 28px rgba(0,181,181,0.55); }
        }
      `}</style>
    </>,
    document.body
  )
}
