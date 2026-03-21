/**
 * OdooPanel.jsx  — V3
 * Shows the practical Odoo task for a lesson.
 *
 * Three states:
 *  1. not-blocked  — real Odoo UI loads inside an iframe
 *  2. blocked      — X-Frame-Options blocked the iframe; show an "Open Odoo" link
 *  3. AI assessment — textarea + GPT-4o feedback, always visible below the iframe/fallback
 *
 * Props:
 *  fileId    {string|number}  — the LearningFile id, sent to the assess endpoint
 *  odooPath  {string}         — path appended to ODOO_BASE_URL, e.g. "/odoo/crm"
 *  odooTask  {string}         — plain-text description of what the student must do
 */

import { useState, useRef } from 'react';
import api from '../../api/client';
import { ODOO_BASE_URL } from '../../config';

const PURPLE = '#714B67';

export default function OdooPanel({ fileId, odooPath, odooTask }) {
  const [iframeBlocked,    setIframeBlocked]    = useState(false);
  const [userDescription,  setUserDescription]  = useState('');
  const [feedback,         setFeedback]         = useState('');
  const [assessing,        setAssessing]        = useState(false);
  const iframeRef = useRef(null);

  // Build the full URL.  odooPath is optional — fall back to the base dashboard.
  const odooUrl = odooPath
    ? `${ODOO_BASE_URL}${odooPath}`
    : ODOO_BASE_URL;

  // ── iframe detection ───────────────────────────────────────────────────────
  // When the iframe fires onLoad, try to access contentDocument.
  // Cross-origin + X-Frame-Options blocks will either:
  //   (a) throw a SecurityError, or
  //   (b) return a document that is empty / has no body
  // In both cases we fall back to the link button.
  const handleIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      // Empty or null document means it was blocked
      if (!doc || !doc.body || doc.body.innerHTML === '') {
        setIframeBlocked(true);
      }
    } catch {
      // SecurityError — cross-origin block confirmed
      setIframeBlocked(true);
    }
  };

  // ── AI assessment ──────────────────────────────────────────────────────────
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
    <div className="flex flex-col gap-4">

      {/* ── Task instructions ──────────────────────────────────────────────── */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <h3 className="font-semibold text-purple-800 mb-1 text-sm flex items-center gap-1.5">
          🎯 Your Task
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {odooTask || 'Explore this module in Odoo and familiarise yourself with its interface.'}
        </p>
      </div>

      {/* ── Odoo iframe or fallback ────────────────────────────────────────── */}
      {!iframeBlocked ? (
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '480px' }}>
          <iframe
            ref={iframeRef}
            src={odooUrl}
            title="Odoo"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={() => setIframeBlocked(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center gap-3">
          <div className="text-3xl">🔒</div>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Odoo can't be embedded here due to browser security restrictions.
            Open it in a new tab to complete your task — then come back and
            describe what you did below.
          </p>
          <a
            href={odooUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: PURPLE }}
          >
            Open Odoo ↗
          </a>
        </div>
      )}

      {/* ── AI Task Assessment ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-700 mb-1 text-sm flex items-center gap-1.5">
          🤖 Task Check
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Describe what you did in Odoo and get instant AI feedback on whether you completed the task correctly.
        </p>
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          rows={3}
          placeholder="e.g. I opened CRM, clicked New to create a lead, filled in the customer name and expected revenue, then saved it…"
          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': PURPLE }}
          onFocus={(e) => { e.target.style.borderColor = PURPLE; e.target.style.boxShadow = `0 0 0 2px ${PURPLE}33`; }}
          onBlur={(e)  => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          onClick={handleAssess}
          disabled={assessing || !userDescription.trim()}
          className="mt-2 w-full text-white text-sm font-semibold py-2.5 rounded-lg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: PURPLE }}
        >
          {assessing ? 'Checking…' : 'Check my work ✓'}
        </button>

        {feedback && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            <div className="font-semibold text-green-800 mb-1 text-xs uppercase tracking-wide">
              AI Feedback
            </div>
            {feedback}
          </div>
        )}
      </div>

    </div>
  );
}