/**
 * HtmlField.jsx — simple rich-text area
 * Phase 1: contenteditable div with basic toolbar
 * Phase 3+: can be upgraded to a full editor (Quill/TipTap)
 */
import { useRef } from 'react'

const TOOLS = [
  { cmd:'bold',          icon:'B',  style:{ fontWeight:700 } },
  { cmd:'italic',        icon:'I',  style:{ fontStyle:'italic' } },
  { cmd:'underline',     icon:'U',  style:{ textDecoration:'underline' } },
  { cmd:'insertUnorderedList', icon:'•' },
  { cmd:'insertOrderedList',   icon:'1.' },
]

export default function HtmlField({ value='', onChange, readonly, label }) {
  const ref = useRef(null)

  if (readonly) {
    return <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html: value || '<span style="color:var(--text3)">—</span>' }} />
  }

  return (
    <div style={{ border:'1px solid var(--border2)', borderRadius:4, overflow:'hidden' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', gap:2, padding:'4px 6px', borderBottom:'1px solid var(--border)', background:'var(--surface2)' }}>
        {TOOLS.map(t => (
          <button
            key={t.cmd}
            onMouseDown={e => { e.preventDefault(); document.execCommand(t.cmd, false) }}
            style={{
              width:26, height:24, background:'none', border:'1px solid transparent',
              borderRadius:3, color:'var(--text2)', cursor:'pointer', fontSize:12,
              ...t.style,
            }}
            onMouseEnter={e => e.currentTarget.style.background='var(--surface3)'}
            onMouseLeave={e => e.currentTarget.style.background='none'}
          >{t.icon}</button>
        ))}
      </div>
      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => onChange?.(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          minHeight:80, padding:'8px 10px',
          color:'var(--text)', fontSize:13, lineHeight:1.7,
          outline:'none', background:'var(--surface)',
        }}
      />
    </div>
  )
}
