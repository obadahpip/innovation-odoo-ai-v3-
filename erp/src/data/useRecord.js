/**
 * useRecord.js — Reactive hooks for IndexedDB
 *
 * useRecordList — auto-refetches on erp:changed events
 * useRecord     — single record with dirty tracking + save/discard
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  listRecords, getRecord, createRecord, updateRecord,
  onChanged, generateId,
} from './db.js'

// ── useRecordList ─────────────────────────────────────────────────
export function useRecordList(model, options = {}) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [total,   setTotal]   = useState(0)
  const optsRef = useRef(options)
  optsRef.current = options

  const fetch = useCallback(async () => {
    if (!model) return
    setLoading(true)
    try {
      const opts = optsRef.current
      let data   = await listRecords(model, {
        filter:   opts.filter,
        sortKey:  opts.sortKey,
        sortDir:  opts.sortDir,
      })

      // Client-side search
      if (opts.search && opts.searchFields?.length) {
        const q = opts.search.toLowerCase()
        data = data.filter(r =>
          opts.searchFields.some(f => String(r[f] || '').toLowerCase().includes(q))
        )
      }

      setTotal(data.length)

      // Pagination
      if (opts.page && opts.pageSize) {
        const start = (opts.page - 1) * opts.pageSize
        data = data.slice(start, start + opts.pageSize)
      } else if (opts.limit) {
        data = data.slice(0, opts.limit)
      }

      setRecords(data)
    } catch (err) {
      console.warn('[useRecordList] error for', model, err)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [model])

  // Fetch on mount + when search/page changes
  useEffect(() => {
    fetch()
  }, [fetch, options.page, options.search])

  // ── Reactive: re-fetch whenever a write touches this model ──────
  useEffect(() => {
    const unsub = onChanged(model, () => fetch())
    return unsub
  }, [model, fetch])

  return { records, loading, total, reload: fetch }
}

// ── useRecord ─────────────────────────────────────────────────────
export function useRecord(model, id, defaults = {}) {
  const [record,   setRecord]   = useState(null)
  const [original, setOriginal] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [isDirty,  setIsDirty]  = useState(false)

  // Load on mount / id change
  useEffect(() => {
    if (!id) {
      // New record
      const blank = { ...defaults, id: generateId(), __isNew: true }
      setRecord(blank)
      setOriginal(blank)
      setIsDirty(false)
      setLoading(false)
      return
    }
    setLoading(true)
    getRecord(model, id).then(r => {
      if (r) {
        setRecord(r)
        setOriginal(r)
        setIsDirty(false)
      } else {
        // Fallback: treat as new
        const blank = { ...defaults, id, __isNew: true }
        setRecord(blank)
        setOriginal(blank)
        setIsDirty(false)
      }
      setLoading(false)
    })
  }, [model, id]) // eslint-disable-line

  const setField = useCallback((key, value) => {
    setRecord(r => ({ ...r, [key]: value }))
    setIsDirty(true)
  }, [])

  const setFields = useCallback((fields) => {
    setRecord(r => ({ ...r, ...fields }))
    setIsDirty(true)
  }, [])

  const save = useCallback(async () => {
    if (!record) return null
    let saved
    if (record.__isNew) {
      const { __isNew, ...data } = record
      saved = await createRecord(model, data)
    } else {
      saved = await updateRecord(model, record.id, record)
    }
    setRecord(saved)
    setOriginal(saved)
    setIsDirty(false)
    return saved
  }, [model, record])

  const discard = useCallback(() => {
    setRecord(original)
    setIsDirty(false)
  }, [original])

  const reload = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const r = await getRecord(model, id)
    if (r) { setRecord(r); setOriginal(r); setIsDirty(false) }
    setLoading(false)
  }, [model, id])

  return { record, loading, isDirty, setField, setFields, save, discard, reload }
}
