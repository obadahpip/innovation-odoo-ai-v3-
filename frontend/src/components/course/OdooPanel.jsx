/**
 * OdooPanel.jsx  — V3
 *
 * Right-side task panel in the split-view practical screen.
 * The Odoo iframe lives in CoursePage (left side).
 * This panel handles:
 *   1. Task instructions
 *   2. "Task Done" → calls onDone()
 *   3. "Need Help" → opens AI description checker
 *
 * Props:
 *   fileId   {string|number}  — LearningFile id for the assess endpoint
 *   odooTask {string}         — plain-text task description from admin
 *   onDone   {function}       — called when user clicks Task Done
 */

import { useState, useRef, useEffect } from 'react';
import api from '../../api/client';

const PURPLE = '#714B67';

export default function OdooPanel({ fileId, odooTask, onDone }) {
  const [showCheck,       setShowCheck]       = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [feedback,        setFeedback]        = useState('');
  const [assessing,       setAssessing]       = useState(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (feedback) feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feedback]);

  const handleAssess = async () => {
    if (!userDescription.trim()) return;
    setAssessing(true);
    setFeedback('');
    try {
      const res = await api.post('/content/task/assess/', {
        file_id:          fileId,
        user_description: userDescription,
      });
      setFeedback(res.data.feedback);
    } catch {
      setFeedback('Could not get feedback right now. Please try again.');
    } finally {
      setAssessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100"
        style={{ background: `${PURPLE}12` }}>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
          Practice Task
        </div>
        <div className="font-bold text-gray-900 text-sm leading-snug">
          Complete the task in Odoo
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Task description */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
          <div className="text-xs font-semibold text-purple-700 mb-1.5">🎯 Your task</div>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
            {odooTask ||
              'Explore this Odoo module. Navigate through the interface and familiarise yourself with its features.'}
          </p>
        </div>

        {/* Hint text */}
        <p className="text-xs text-gray-400 leading-relaxed">
          Work through the task in the Odoo window on the left.
          Click <strong className="text-gray-600">Task Done</strong> when finished,
          or <strong className="text-gray-600">Need Help</strong> for AI guidance.
        </p>

        {/* ── AI help section (toggled) ──────────────────────────────────── */}
        {showCheck && (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-gray-600">🤖 Describe what you did</div>
            <textarea
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              rows={4}
              placeholder="e.g. I opened CRM, clicked New, filled in customer name and expected revenue, then scheduled a follow-up activity…"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-xs resize-none focus:outline-none"
              style={{ lineHeight: '1.6' }}
              onFocus={(e) => {
                e.target.style.borderColor = PURPLE;
                e.target.style.boxShadow = `0 0 0 2px ${PURPLE}22`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleAssess}
              disabled={assessing || !userDescription.trim()}
              className="w-full py-2 rounded-lg text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: PURPLE }}
            >
              {assessing ? 'Checking…' : 'Check my work ✓'}
            </button>

            {feedback && (
              <div
                ref={feedbackRef}
                className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-line"
              >
                <div className="font-semibold text-green-700 mb-1 uppercase tracking-wide text-[10px]">
                  AI Feedback
                </div>
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={onDone}
          className="w-full min-h-[44px] rounded-xl font-semibold text-sm text-white transition hover:opacity-90 flex items-center justify-center gap-2"
          style={{ backgroundColor: PURPLE }}
        >
          ✅ Task Done
        </button>
        <button
          onClick={() => setShowCheck((v) => !v)}
          className="w-full min-h-[44px] rounded-xl font-semibold text-sm border-2 transition hover:opacity-80 flex items-center justify-center gap-2"
          style={{ color: PURPLE, borderColor: PURPLE, background: `${PURPLE}08` }}
        >
          {showCheck ? 'Hide Help ▲' : '🙋 Need Help'}
        </button>
      </div>

    </div>
  );
}