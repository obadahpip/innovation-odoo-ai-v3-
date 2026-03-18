/**
 * useActionLog.js
 * Records user actions to IndexedDB for AI verification.
 * Model names match Odoo 19.0 exactly.
 */
import { createRecord, listRecords } from './db.js'

const SESSION_ID = `session-${Date.now()}`

export function useActionLog({ module, model, lessonId } = {}) {

  const log = async (action, extras = {}) => {
    try {
      await createRecord('action_log', {
        timestamp:  new Date().toISOString(),
        session_id: SESSION_ID,
        lesson_id:  lessonId || null,
        module:     module  || null,
        model:      model   || null,
        action,
        ...extras,
      })
    } catch (e) {
      console.warn('[ActionLog] Failed to log:', action, e)
    }
  }

  return {
    logNavigate:     (path)                    => log('navigate',     { path }),
    logCreate:       (recordId)                => log('create',       { record_id: recordId }),
    logSave:         (recordId)                => log('save',         { record_id: recordId }),
    logEdit:         (recordId, field, oldVal, newVal) => log('edit', { record_id: recordId, field, old_value: oldVal, new_value: newVal }),
    logDelete:       (recordId)                => log('delete',       { record_id: recordId }),
    logStageChange:  (recordId, fromStage, toStage) => log('stage_change', { record_id: recordId, from: fromStage, to: toStage }),
    logButtonClick:  (button, recordId)        => log('button_click', { button, record_id: recordId }),
    logFieldChange:  (recordId, field, oldVal, newVal) => log('field_change', { record_id: recordId, field, old_value: oldVal, new_value: newVal }),
    logSearch:       (query)                   => log('search',       { query }),
    logFilter:       (filter)                  => log('filter',       { filter }),
    logTabChange:    (tab)                     => log('tab_change',   { tab }),
    logModalOpen:    (modal)                   => log('modal_open',   { modal }),
    logModalClose:   (modal, action)           => log('modal_close',  { modal, action }),

    // For AI verification — get all logs for a lesson session
    getLessonActions: async (lid) => {
      const all = await listRecords('action_log', { filter: r => lid ? r.lesson_id === lid : true })
      return all.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    },

    // Build a summary for Claude API
    buildActionSummary: async (lid) => {
      const actions = await listRecords('action_log', { filter: r => lid ? r.lesson_id === lid : r.session_id === SESSION_ID })
      const sorted  = actions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      return sorted.map(a =>
        `[${a.timestamp}] ${a.action}${a.record_id ? ` record:${a.record_id}` : ''}${a.field ? ` field:${a.field}` : ''}${a.new_value != null ? ` value:${JSON.stringify(a.new_value)}` : ''}`
      ).join('\n')
    },

    clearLessonActions: async (lid) => {
      // We can't delete by filter in IndexedDB easily, so we log a clear event
      await log('clear_lesson', { lesson_id: lid })
    },
  }
}
