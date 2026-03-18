/**
 * DiscussPage.jsx — Discuss module
 * Lesson 69: Discuss — selectors: field-name, list-row, new-button, status-bar
 * Lesson 80: WhatsApp — selectors: app-email, create-button, field-description, field-name, save-button, send-button, status-bar
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createRecord, listRecords } from '@data/db.js'

/* ── Seed data ──────────────────────────────────────────────────── */
async function seedDiscuss() {
  const [channels, msgs] = await Promise.all([
    listRecords('discuss.channel'),
    listRecords('discuss.message'),
  ])
  if (channels.length === 0) {
    for (const c of [
      { name: 'general',     channel_type: 'channel', description: 'Company-wide announcements' },
      { name: 'random',      channel_type: 'channel', description: 'Off-topic conversations' },
      { name: 'sales-team',  channel_type: 'channel', description: 'Sales team coordination' },
      { name: 'it-support',  channel_type: 'channel', description: 'IT support requests' },
    ]) await createRecord('discuss.channel', c)
    for (const d of [
      { name: 'Mitchell Admin', channel_type: 'dm', partner_id: 'Mitchell Admin' },
      { name: 'Marc Demo',      channel_type: 'dm', partner_id: 'Marc Demo' },
    ]) await createRecord('discuss.channel', d)
  }
  if (msgs.length === 0) {
    const ch = await listRecords('discuss.channel')
    const gen = ch.find(c => c.name === 'general')
    if (gen) {
      for (const m of [
        { channel_id: gen.id, author: 'Mitchell Admin', body: 'Welcome to the general channel! 👋', date: '2025-03-01 09:00' },
        { channel_id: gen.id, author: 'Marc Demo',      body: 'Thanks! Glad to be here.',           date: '2025-03-01 09:05' },
        { channel_id: gen.id, author: 'Mitchell Admin', body: 'Q1 results are looking great so far.', date: '2025-03-10 14:30' },
      ]) await createRecord('discuss.message', m)
    }
  }
}

/* ── Message bubble ─────────────────────────────────────────────── */
function MessageBubble({ msg, isOwn }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isOwn ? 'var(--teal)' : 'var(--purple)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff',
      }}>
        {(msg.author || '?')[0].toUpperCase()}
      </div>
      <div style={{ maxWidth: '70%' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3, textAlign: isOwn ? 'right' : 'left' }}>
          {msg.author} · {msg.date}
        </div>
        <div style={{
          background: isOwn ? 'var(--teal)' : 'var(--surface2)',
          border: `1px solid ${isOwn ? 'var(--teal)' : 'var(--border)'}`,
          borderRadius: isOwn ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          padding: '8px 12px',
          fontSize: 13, color: isOwn ? '#fff' : 'var(--text)',
          lineHeight: 1.5,
        }}>
          {msg.body}
        </div>
      </div>
    </div>
  )
}

/* ── Main Discuss layout ────────────────────────────────────────── */
export function DiscussPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [channels,  setChannels]  = useState([])
  const [activeId,  setActiveId]  = useState(null)
  const [messages,  setMessages]  = useState([])
  const [draft,     setDraft]     = useState('')
  const [showNew,   setShowNew]   = useState(false)
  const [newName,   setNewName]   = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    seedDiscuss().then(() => {
      listRecords('discuss.channel').then(ch => {
        setChannels(ch)
        if (!activeId && ch.length > 0) setActiveId(ch[0].id)
      })
    })
  }, [])

  useEffect(() => {
    if (activeId) {
      listRecords('discuss.message').then(msgs => {
        setMessages(msgs.filter(m => m.channel_id === activeId))
      })
    }
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeCh = channels.find(c => c.id === activeId)
  const chChannels = channels.filter(c => c.channel_type === 'channel')
  const chDMs      = channels.filter(c => c.channel_type === 'dm')

  const handleSend = async () => {
    if (!draft.trim() || !activeId) return
    await createRecord('discuss.message', {
      channel_id: activeId,
      author: 'Mitchell Admin',
      body: draft,
      date: new Date().toLocaleString(),
    })
    setDraft('')
    listRecords('discuss.message').then(msgs => setMessages(msgs.filter(m => m.channel_id === activeId)))
  }

  const handleNewChannel = async () => {
    if (!newName.trim()) return
    await createRecord('discuss.channel', { name: newName.replace('#',''), channel_type: 'channel', description: '' })
    setNewName(''); setShowNew(false)
    listRecords('discuss.channel').then(setChannels)
  }

  const SidebarSection = ({ label, items, onNew }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 2px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        {onNew && (
          <button data-erp="new-button" onClick={onNew}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
          >+</button>
        )}
      </div>
      {items.map(item => (
        <button key={item.id}
          data-erp="list-row"
          onClick={() => setActiveId(item.id)}
          style={{
            width: '100%', padding: '6px 14px',
            background: activeId === item.id ? 'var(--surface3)' : 'transparent',
            border: 'none',
            borderLeft: activeId === item.id ? '3px solid var(--teal)' : '3px solid transparent',
            textAlign: 'left', fontSize: 13,
            color: activeId === item.id ? 'var(--teal)' : 'var(--text2)',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all var(--t)',
          }}
          onMouseEnter={e => { if (activeId !== item.id) e.currentTarget.style.background = 'var(--surface2)' }}
          onMouseLeave={e => { if (activeId !== item.id) e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>
            {item.channel_type === 'dm' ? '👤' : '#'}
          </span>
          {item.name}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Search */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
          <input placeholder="🔍 Find or start..." style={{
            width: '100%', padding: '6px 10px',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 5, color: 'var(--text)', fontSize: 12,
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Inbox */}
        <button style={{ width: '100%', padding: '8px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
          <span>📥</span> Inbox
        </button>
        <button style={{ width: '100%', padding: '8px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
          <span>⭐</span> Starred
        </button>
        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

        <SidebarSection label="Channels" items={chChannels} onNew={() => setShowNew(true)} />
        {showNew && (
          <div style={{ padding: '0 10px 8px' }}>
            <input autoFocus data-erp="field-name" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNewChannel(); if (e.key === 'Escape') setShowNew(false) }}
              placeholder="Channel name"
              style={{ width: '100%', padding: '5px 8px', background: 'var(--bg)', border: '1px solid var(--teal)', borderRadius: 4, color: 'var(--text)', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 4 }} />
            <button className="btn btn-primary btn-sm" onClick={handleNewChannel} style={{ fontSize: 11 }}>Create</button>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
        <SidebarSection label="Direct Messages" items={chDMs} onNew={() => {}} />
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {activeCh && (
          <>
            {/* Channel header */}
            <div data-erp="status-bar" style={{
              padding: '10px 20px', background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
            }}>
              <span style={{ fontSize: 16, color: 'var(--text3)' }}>{activeCh.channel_type === 'dm' ? '👤' : '#'}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{activeCh.name}</div>
                {activeCh.description && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{activeCh.description}</div>}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>👥</button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>🔍</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', minHeight: 0 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: '40px 0' }}>
                  No messages yet. Start the conversation!
                </div>
              )}
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id || i} msg={msg} isOwn={msg.author === 'Mitchell Admin'} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message composer */}
            <div style={{
              padding: '10px 16px', background: 'var(--surface)',
              borderTop: '1px solid var(--border)', flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-end',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 12px',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--teal)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <textarea
                  data-erp="field-description"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={`Message #${activeCh.name}...`}
                  rows={1}
                  style={{
                    flex: 1, background: 'none', border: 'none',
                    outline: 'none', color: 'var(--text)', fontSize: 13,
                    fontFamily: 'inherit', resize: 'none', lineHeight: 1.5,
                  }}
                />
                <button
                  data-erp="send-button"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: draft.trim() ? 'var(--teal)' : 'var(--surface3)',
                    border: 'none', color: '#fff', cursor: draft.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0, transition: 'background var(--t)',
                  }}
                >➤</button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>Enter to send · Shift+Enter for new line</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── DiscussForm — kept for route compatibility ─────────────────── */
export function DiscussForm() {
  const navigate = useNavigate()
  return <DiscussPage />
}
