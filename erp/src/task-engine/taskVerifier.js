/**
 * taskVerifier.js
 * 
 * Calls the Anthropic API with the student's action log
 * and gets back structured pass/fail feedback.
 * 
 * Uses the same API key the parent app uses (passed via prop or env).
 */

const MODEL = 'claude-sonnet-4-20250514'

/**
 * Verify a completed lesson task against its expected steps.
 * 
 * @param {Object} summary - from useTaskEngine.buildSummary()
 * @param {Array}  steps   - the full step list for the lesson
 * @returns {Object} { passed, score, feedback, details }
 */
export async function verifyTask(summary, steps) {
  const systemPrompt = `You are an Odoo ERP training evaluator. You review a student's actions in an Odoo simulation and give concise, constructive feedback.

You will receive:
1. The lesson task steps (what the student was supposed to do)  
2. The student's actual action log (what they did)

Respond ONLY with valid JSON in this exact format:
{
  "passed": true | false,
  "score": 0-100,
  "feedback": "One clear paragraph of feedback (2-4 sentences).",
  "details": [
    { "step": 1, "ok": true, "note": "brief note" },
    { "step": 2, "ok": false, "note": "what was missing or wrong" }
  ]
}

Be encouraging but accurate. If the student completed most steps correctly, pass them.`

  const userPrompt = `LESSON: ${summary.lesson_title} (ID: ${summary.lesson_id})

EXPECTED STEPS:
${steps.map((s, i) => `${i + 1}. [${s.action_type.toUpperCase()}] ${s.instruction_text}`).join('\n')}

STUDENT ACTIONS (${summary.actions?.length ?? 0} actions recorded):
${summary.actions?.length > 0
  ? summary.actions.map(a => `- ${a.action} on ${a.model}.${a.field || '(record)'} = ${a.value || '(clicked)'}`).join('\n')
  : 'No actions recorded in the log.'
}

Steps completed: ${summary.completed_steps} / ${summary.total_steps}

Evaluate whether the student successfully completed the lesson task.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)

    const data = await response.json()
    const text = data.content?.find(b => b.type === 'text')?.text ?? ''

    // Strip any markdown fences
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)

  } catch (err) {
    console.error('taskVerifier error:', err)
    // Graceful fallback — don't block the student
    return {
      passed:   summary.completed_steps >= Math.ceil(summary.total_steps * 0.6),
      score:    Math.round((summary.completed_steps / Math.max(summary.total_steps, 1)) * 100),
      feedback: `You completed ${summary.completed_steps} of ${summary.total_steps} steps. Keep practicing to master this workflow!`,
      details:  [],
    }
  }
}
