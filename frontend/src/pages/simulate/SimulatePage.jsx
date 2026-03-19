/**
 * SimulatePage.jsx
 * Split-view simulation page:
 *  Left 65%  — ERP simulator in an iframe (auto-starts the lesson)
 *  Right 35% — Task panel: description, steps, Task Done / Need Help
 *
 * Route: /simulate/:fileId
 * Accessed from:
 *  - Method 2: "Try on Simulator" on completed lesson row in dashboard
 *  - Method 3: "Practice in Simulator →" on course completion screen
 *  - CoursePage TOC "Practice on simulation" sidebar link
 */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';

const PURPLE = '#714B67';

export default function SimulatePage() {
  const { fileId } = useParams();
  const navigate   = useNavigate();

  const [lesson,   setLesson]   = useState(null);
  const [steps,    setSteps]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [taskDone, setTaskDone] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const iframeRef = useRef(null);

  const erpBase = import.meta.env.VITE_ERP_URL || (window.location.origin + '/erp');

  useEffect(() => {
    Promise.all([
      api.get(`/content/files/${fileId}/`),
      api.get(`/content/files/${fileId}/steps/`).catch(() => ({ data: { steps: [] } })),
    ])
      .then(([lessonRes, stepsRes]) => {
        setLesson(lessonRes.data);
        const s = stepsRes.data?.steps || stepsRes.data || [];
        setSteps(Array.isArray(s) ? s : []);
      })
      .catch(() => {
        toast.error('Could not load lesson.');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [fileId]);

  const handleTaskDone = async () => {
    try {
      await api.post('/progress/update/', {
        file_id:   parseInt(fileId),
        completed: true,
      });
      toast.success('Great work! Lesson marked as complete.');
      setTaskDone(true);
    } catch {
      toast.error('Could not save progress. Please try again.');
    }
  };

  const iframeSrc = `${erpBase}/launch?title=${encodeURIComponent(lesson?.title || '')}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: PURPLE }} />
      </div>
    );
  }

  if (taskDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Task Complete!</h2>
          <p className="text-sm text-gray-500 mb-6">
            You've practised <strong>{lesson?.title}</strong> in the simulator.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full min-h-[44px]">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-4 flex-shrink-0 z-10">
        {/* Back */}
        <button onClick={() => navigate(`/course/${fileId}`)}
          className="text-sm text-gray-400 hover:text-gray-600 transition flex items-center gap-1">
          ← Back to lesson
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base flex-shrink-0">🖥</span>
          <span className="font-semibold text-gray-800 text-sm truncate">
            Simulator — {lesson?.title}
          </span>
        </div>

        {/* Step progress */}
        {steps.length > 0 && (
          <div className="text-xs text-gray-400 flex-shrink-0">
            Step {currentStep + 1} / {steps.length}
          </div>
        )}
      </div>

      {/* ── Main split ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — ERP simulator iframe */}
        <div className="flex-1 bg-gray-900 overflow-hidden relative" style={{ minWidth: 0 }}>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="Odoo Simulator"
            className="w-full h-full border-0"
            allow="same-origin"
          />
        </div>

        {/* Right — Task panel */}
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">

          {/* Panel header */}
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0"
            style={{ background: `${PURPLE}12` }}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              Practice Task
            </div>
            <div className="font-bold text-gray-900 text-sm leading-snug">
              {lesson?.title}
            </div>
          </div>

          {/* Task description */}
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 leading-relaxed">
              Follow the steps below in the simulator on the left.
              The simulator will guide you with highlighted elements.
            </p>
          </div>

          {/* Steps list */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-xs leading-relaxed">
                  Follow the guided steps in the simulator.
                  The highlighted elements will show you exactly what to click.
                </p>
              </div>
            ) : (
              <ol className="space-y-2">
                {steps.map((step, i) => {
                  const isDone    = i < currentStep;
                  const isActive  = i === currentStep;
                  const isPending = i > currentStep;

                  const ACTION_ICON = {
                    click:    '👆',
                    type:     '⌨️',
                    navigate: '🗺️',
                    observe:  '👁️',
                  };

                  return (
                    <li key={step.id || i}
                      onClick={() => setCurrentStep(i)}
                      className={`rounded-lg p-2.5 cursor-pointer transition-all text-xs leading-snug ${
                        isActive
                          ? 'border-2 text-gray-800'
                          : isDone
                          ? 'border border-gray-100 text-gray-400'
                          : 'border border-gray-100 text-gray-600 hover:bg-gray-50'
                      }`}
                      style={isActive ? { borderColor: PURPLE, background: `${PURPLE}08` } : {}}
                    >
                      <div className="flex items-start gap-2">
                        {/* Step number / check */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-green-100 text-green-600'
                            : isActive
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                          style={isActive ? { background: PURPLE } : {}}>
                          {isDone ? '✓' : i + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Action pill */}
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-[10px]">{ACTION_ICON[step.action_type] || '•'}</span>
                            <span className={`text-[9px] font-semibold uppercase tracking-wide ${
                              isActive ? 'text-purple-600' : 'text-gray-400'
                            }`}>
                              {step.action_type}
                            </span>
                          </div>
                          {/* Instruction */}
                          <p className={isDone ? 'line-through' : ''}>
                            {step.instruction_text}
                          </p>
                        </div>
                      </div>

                      {/* Mark step done button */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentStep(i + 1);
                          }}
                          className="mt-2 w-full text-[10px] font-semibold py-1 rounded transition hover:opacity-80 text-white"
                          style={{ background: PURPLE }}
                        >
                          ✓ Done — Next step
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Help panel */}
          {showHelp && (
            <div className="border-t border-gray-100 px-4 py-3 bg-amber-50 flex-shrink-0">
              <div className="text-xs font-semibold text-amber-800 mb-1">💡 Tip</div>
              <p className="text-xs text-amber-700 leading-relaxed">
                {steps[currentStep]?.instruction_text
                  ? `Focus on: "${steps[currentStep].instruction_text}"`
                  : 'Look for the highlighted (glowing teal border) element in the simulator and follow the overlay instructions.'}
              </p>
              <button onClick={() => setShowHelp(false)}
                className="text-[10px] text-amber-500 mt-1 underline">
                Close
              </button>
            </div>
          )}

          {/* Bottom action buttons */}
          <div className="px-3 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
            {/* Task Done */}
            <button
              onClick={handleTaskDone}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: PURPLE }}
            >
              Task Done ✓
            </button>

            {/* Need Help */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition hover:bg-gray-50"
              style={{ color: PURPLE, borderColor: PURPLE }}
            >
              Need Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
