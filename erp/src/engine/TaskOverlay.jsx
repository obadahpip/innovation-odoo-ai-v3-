import { useState, useRef, useEffect } from 'react'
import { useTaskEngine } from './useTaskEngine.js'

const ACTION_ICON = {
  navigate: '🗺',
  click: '👆',
  type: '⌨',
  observe: '👁',
}

export default function TaskOverlay() {
  const {
    activeLesson, currentStepIndex, status,
    skipStep, stopLesson, getProgress,
  } = useTaskEngine()

  const [minimized, setMinimized] = useState(false)
  const [pos, setPos] = useState({ bottom: 24, right: 24 })
  const dragging = useRef(false)
  const dragStart = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current || !dragStart.current) return

      const dx = e.clientX - dragStart.current.mx
      const dy = e.clientY - dragStart.current.my

      setPos({
        right: dragStart.current.pos.right - dx,
        bottom: dragStart.current.pos.bottom - dy,
      })
    }

    function onUp() {
      dragging.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!activeLesson || status === 'idle') return null

  const step = activeLesson.steps[currentStepIndex]
  const progress = getProgress()
  const isDone = status === 'lesson_complete'
  const total = activeLesson.steps.length

  function onMouseDown(e) {
    if (e.target.closest('button')) return
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, pos: { ...pos } }
    e.preventDefault()
  }

  return (
    <div
      ref={overlayRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'fixed',
        bottom: pos.bottom,
        right: pos.right,
        width: minimized ? 52 : 340,
        background: '#1e1f2e',
        border: '1px solid rgba(0,181,181,0.35)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
        zIndex: 9000,
        overflow: 'hidden',
        transition: 'width 0.2s',
        userSelect: 'none',
        cursor: 'grab',
      }}
    >
      {minimized && (
        <button
          onClick={() => setMinimized(false)}
          style={{
            width: 52,
            height: 52,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
          title="Show task guide"
        >
          📋
        </button>
      )}

      {!minimized && (
        <>
          <div
            style={{
              padding: '10px 14px 8px',
              background: 'rgba(0,181,181,0.12)',
              borderBottom: '1px solid rgba(0,181,181,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#00b5b5',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              📋 {activeLesson.lesson_title}
            </span>

            <button
              onClick={() => setMinimized(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                padding: '0 2px',
              }}
              title="Minimise"
            >
              ─
            </button>

            <button
              onClick={stopLesson}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: 1,
                padding: '0 2px',
              }}
              title="Exit lesson"
            >
              ✕
            </button>
          </div>

          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#00b5b5',
                transition: 'width 0.4s',
              }}
            />
          </div>

          <div
            style={{
              padding: '6px 14px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              Step {currentStepIndex + 1} of {total}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {progress}% complete
            </span>
          </div>

          {isDone ? (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Lesson Complete!
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
                You finished <em>{activeLesson.lesson_title}</em>
              </div>
              <button
                onClick={stopLesson}
                style={{
                  padding: '7px 20px',
                  background: '#00b5b5',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back to Dashboard
              </button>
            </div>
          ) : step ? (
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#00b5b5',
                    background: 'rgba(0,181,181,0.12)',
                    border: '1px solid rgba(0,181,181,0.25)',
                    borderRadius: 20,
                    padding: '2px 8px',
                  }}
                >
                  {ACTION_ICON[step.action_type]} {step.action_type}
                </span>

                {step.highlight_selector && (
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'monospace',
                    }}
                  >
                    [{step.highlight_selector}]
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.88)',
                  minHeight: 52,
                }}
              >
                {step.instruction_text}
              </p>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                <button
                  onClick={skipStep}
                  style={{
                    padding: '5px 14px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 6,
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Skip
                </button>

                <button
                  onClick={() => useTaskEngine.getState().completeStep()}
                  style={{
                    padding: '5px 14px',
                    background: '#00b5b5',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Done →
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}