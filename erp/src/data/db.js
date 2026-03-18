/**
 * db.js — IndexedDB layer (v4) with all 130+ Odoo 19.0 model stores
 */
import { openDB } from 'idb'

const DB_NAME    = 'innovation-erp'
const DB_VERSION = 4   // bump triggers store migration

import { ALL_STORES } from './db_extension.js'

// ── DB singleton ──────────────────────────────────────────────────
let _db = null

export async function getDB() {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      for (const store of ALL_STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' })
        }
      }
    },
  })
  return _db
}

// ── Event bus ─────────────────────────────────────────────────────
export function emitChanged(model, action = 'write') {
  window.dispatchEvent(new CustomEvent('erp:changed', { detail: { model, action } }))
}
export function onChanged(model, callback) {
  const handler = (e) => {
    if (!model || e.detail.model === model) callback(e.detail)
  }
  window.addEventListener('erp:changed', handler)
  return () => window.removeEventListener('erp:changed', handler)
}

// ── ID generator ──────────────────────────────────────────────────
export function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

// ── CRUD ──────────────────────────────────────────────────────────
export async function listRecords(model, options = {}) {
  try {
    const db = await getDB()
    let records = await db.getAll(model)
    if (options.filter)   records = records.filter(options.filter)
    if (options.sortKey) {
      const dir = options.sortDir === 'desc' ? -1 : 1
      records.sort((a, b) => {
        const av = a[options.sortKey] ?? ''
        const bv = b[options.sortKey] ?? ''
        return av < bv ? -dir : av > bv ? dir : 0
      })
    }
    if (options.limit)    records = records.slice(0, options.limit)
    return records
  } catch { return [] }
}

export async function getRecord(model, id) {
  try {
    const db = await getDB()
    return (await db.get(model, id)) ?? null
  } catch { return null }
}

export async function createRecord(model, data) {
  try {
    const db  = await getDB()
    const rec = { ...data, id: data.id || generateId(), __createdAt: Date.now() }
    await db.put(model, rec)
    emitChanged(model, 'create')
    return rec
  } catch (e) { console.error('createRecord failed:', model, e); throw e }
}

export async function updateRecord(model, id, data) {
  try {
    const db      = await getDB()
    const current = (await db.get(model, id)) || { id }
    const updated = { ...current, ...data, id, __updatedAt: Date.now() }
    await db.put(model, updated)
    emitChanged(model, 'update')
    return updated
  } catch (e) { console.error('updateRecord failed:', model, id, e); throw e }
}

export async function upsertRecord(model, data) {
  const db  = await getDB()
  const rec = { ...data, __updatedAt: Date.now() }
  if (!rec.id) rec.id = generateId()
  await db.put(model, rec)
  emitChanged(model, 'upsert')
  return rec
}

export async function deleteRecord(model, id) {
  try {
    const db = await getDB()
    await db.delete(model, id)
    emitChanged(model, 'delete')
  } catch (e) { console.error('deleteRecord failed:', model, id, e) }
}

export async function batchCreate(model, items) {
  try {
    const db   = await getDB()
    const tx   = db.transaction(model, 'readwrite')
    const recs = []
    for (const item of items) {
      const rec = { ...item, id: item.id || generateId(), __createdAt: Date.now() }
      tx.store.put(rec)
      recs.push(rec)
    }
    await tx.done
    emitChanged(model, 'batch')
    return recs
  } catch (e) { console.error('batchCreate failed:', model, e); return [] }
}

export async function batchUpdate(model, updates) {
  const db = await getDB()
  const tx = db.transaction(model, 'readwrite')
  for (const { id, data } of updates) {
    const current = (await tx.store.get(id)) || { id }
    tx.store.put({ ...current, ...data, id, __updatedAt: Date.now() })
  }
  await tx.done
  emitChanged(model, 'batch')
}

export async function clearAllStores() {
  const db = await getDB()
  for (const store of ALL_STORES.filter(s => s !== 'action_log')) {
    try { await db.clear(store) } catch {}
  }
}

export async function queryByIndex(model, indexName, value) {
  try {
    const db = await getDB()
    return (await db.getAllFromIndex(model, indexName, value)) ?? []
  } catch { return [] }
}
