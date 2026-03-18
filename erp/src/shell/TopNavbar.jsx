import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@store/appStore.js'

export default function TopNavbar({ appId, appName, menuItems=[], activeMenu, onMenuClick, openDropdown, dropdowns={}, onDropdownNavigate }) {
  const navigate  = useNavigate()
  const devMode   = useAppStore(s => s.developerMode)
  const toggleDev = useAppStore(s => s.toggleDeveloperMode)

  return (
    <nav style={{
      height: 44,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 0 0 8px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
      // Critical: NO overflow:hidden — dropdowns must escape the navbar
    }}>

      {/* Grid home icon */}
      <button
        onClick={() => navigate('/erp/home')}
        style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, border:'none', background:'none', cursor:'pointer', color:'var(--text2)', flexShrink:0 }}
        onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
        onMouseLeave={e=>e.currentTarget.style.background='none'}>
        <GridIcon />
      </button>

      {/* App name */}
      {appName && (
        <span style={{ fontWeight:600, fontSize:14, color:'var(--text)', marginRight:8, flexShrink:0 }}>
          {appName}
        </span>
      )}

      {/* Menu items — NO overflow:hidden, dropdowns escape naturally */}
      <div style={{ display:'flex', alignItems:'stretch', height:'100%', flex:1 }}>
        {menuItems.map(item => (
          <NavMenuItem
            key={item}
            item={item}
            isActive={item === activeMenu}
            hasDropdown={!!dropdowns[item]}
            isOpen={openDropdown === item}
            dropdownItems={dropdowns[item]}
            onMenuClick={onMenuClick}
            onDropdownNavigate={onDropdownNavigate}
          />
        ))}
      </div>

      {/* Right side icons */}
      <div style={{ display:'flex', alignItems:'center', gap:2, paddingRight:10, flexShrink:0 }}>
        <NavIconBtn title="AI"><AiIcon /></NavIconBtn>
        <NavIconBtn title="Discuss"><ChatBadge /></NavIconBtn>
        <NavIconBtn title="Activities"><ClockIcon /></NavIconBtn>
        <NavIconBtn title="Debug" onClick={toggleDev}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={devMode?'var(--teal)':'currentColor'} strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </NavIconBtn>
        <div style={{ width:1, height:18, background:'var(--border2)', margin:'0 6px' }} />
        <span style={{ fontSize:13, color:'var(--text2)', marginRight:6 }}>mta</span>
        <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer' }}>O</div>
      </div>
    </nav>
  )
}

/* ── Single menu item + its dropdown ────────────────────────────── */
function NavMenuItem({ item, isActive, hasDropdown, isOpen, dropdownItems, onMenuClick, onDropdownNavigate }) {
  const btnRef = useRef(null)

  return (
    <div style={{ position:'relative', height:'100%', display:'flex', alignItems:'stretch' }}>

      {/* Tab button */}
      <button
        ref={btnRef}
        onClick={e => { e.stopPropagation(); onMenuClick?.(item) }}
        style={{
          height:'100%',
          padding:'0 13px',
          background: isOpen ? 'var(--surface2)' : 'none',
          border:'none',
          borderBottom: isActive ? '2px solid var(--teal)' : '2px solid transparent',
          borderTop: '2px solid transparent',
          color: isActive ? 'var(--text)' : 'var(--text2)',
          fontSize: 13,
          fontWeight: isActive ? 600 : 400,
          cursor:'pointer',
          whiteSpace:'nowrap',
          fontFamily:'inherit',
          display:'flex',
          alignItems:'center',
          gap: 4,
          transition:'color var(--t), background var(--t)',
        }}
        onMouseEnter={e => {
          if (!isActive) e.currentTarget.style.color = 'var(--text)'
          if (!isOpen)  e.currentTarget.style.background = 'var(--surface2)'
        }}
        onMouseLeave={e => {
          if (!isActive) e.currentTarget.style.color = 'var(--text2)'
          if (!isOpen)  e.currentTarget.style.background = 'none'
        }}
      >
        {item}
        {hasDropdown && <span style={{ fontSize:8, opacity:0.55, marginTop:1 }}>▼</span>}
      </button>

      {/* Dropdown — positioned absolute below the button, zIndex above everything */}
      {isOpen && hasDropdown && dropdownItems && (
        <DropdownPanel
          items={dropdownItems}
          onNavigate={onDropdownNavigate}
        />
      )}
    </div>
  )
}

/* ── Dropdown panel ─────────────────────────────────────────────── */
function DropdownPanel({ items, onNavigate }) {
  // Separate ungrouped items from grouped
  const topLevel = items.filter(i => !i.group)
  const groups   = {}
  for (const item of items.filter(i => i.group)) {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  }

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: '100%',        // directly below the navbar tab
        left: 0,
        minWidth: 210,
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
        zIndex: 999,        // very high to be above everything
        paddingTop: 4,
        paddingBottom: 4,
      }}>

      {/* Ungrouped top-level items */}
      {topLevel.map(item => (
        <DropItem key={item.label} item={item} onNavigate={onNavigate} />
      ))}

      {/* Grouped items with section headers */}
      {Object.entries(groups).map(([groupName, groupItems], gi) => (
        <div key={groupName}>
          <div style={{
            padding: '7px 14px 3px',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderTop: (topLevel.length > 0 || gi > 0) ? '1px solid var(--border)' : 'none',
            marginTop: 2,
          }}>
            {groupName}
          </div>
          {groupItems.map(item => (
            <DropItem key={item.label} item={item} onNavigate={onNavigate} indent />
          ))}
        </div>
      ))}
    </div>
  )
}

function DropItem({ item, onNavigate, indent }) {
  return (
    <button
      onClick={() => onNavigate?.(item.path)}
      style={{
        width: '100%',
        padding: indent ? '7px 14px 7px 22px' : '7px 14px',
        background: 'none',
        border: 'none',
        color: 'var(--text)',
        fontSize: 13,
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'block',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {item.label}
    </button>
  )
}

/* ── Icon helpers ────────────────────────────────────────────────── */
function NavIconBtn({ children, title, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', borderRadius:4, color:'var(--text2)', cursor:'pointer' }}
      onMouseEnter={e=>{e.currentTarget.style.background='var(--surface2)';e.currentTarget.style.color='var(--text)'}}
      onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text2)'}}>
      {children}
    </button>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="11" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="11" width="6" height="6" rx="1.5"/>
      <rect x="11" y="11" width="6" height="6" rx="1.5"/>
    </svg>
  )
}
function AiIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 9h.01M9.5 15a5 5 0 005 0"/></svg>
}
function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
}
function ChatBadge() {
  return (
    <div style={{ position:'relative' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <span style={{ position:'absolute', top:-6, right:-7, background:'var(--danger)', color:'#fff', fontSize:9, fontWeight:700, borderRadius:8, padding:'0 4px', lineHeight:'13px', minWidth:13, textAlign:'center' }}>4</span>
    </div>
  )
}
