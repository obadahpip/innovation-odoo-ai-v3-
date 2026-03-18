import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MODULE_MAP } from '../data/moduleConfig';
import AppSwitcher from './AppSwitcher';

const URL_TO_MODULE = {
  'home':'home','crm':'crm','sales':'sales','contacts':'contacts',
  'invoicing':'invoicing','employees':'employees','project':'project',
  'settings':'settings','inventory':'inventory','time-off':'leave_requests',
  'payroll':'payroll','recruitment':'recruitment','website':'website_builder',
  'manufacturing':'manufacturing','purchase':'purchase','helpdesk':'helpdesk',
  'email-marketing':'email_marketing','discuss':'discuss','calendar':'calendar',
  'expenses':'expenses','fleet':'fleet','events':'events',
  'maintenance':'maintenance','planning':'planning','surveys':'surveys',
  'rental':'rental','appointments':'appointments','data-cleaning':'data_cleaning',
  'attendances':'attendances','pos':'point_of_sale','subscriptions':'subscriptions',
};

/* ── Icons ──────────────────────────────────────────────────────── */
const AIIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const WaffleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <rect x="1"    y="1"    width="6.5" height="6.5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
    <rect x="10.5" y="1"    width="6.5" height="6.5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
    <rect x="1"    y="10.5" width="6.5" height="6.5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
    <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
  </svg>
);

/* ── Nav icon button ────────────────────────────────────────────── */
function NavBtn({ children, onClick, title, active, badge }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', width: 34, height: 34, borderRadius: 5,
        background: (active || hov) ? 'rgba(0,0,0,0.22)' : 'transparent',
        border: 'none', color: 'rgba(255,255,255,0.88)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, transition: 'background .1s',
      }}>
      {children}
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: 2, right: 2, minWidth: 14, height: 14,
          borderRadius: 7, background: '#e74c3c', color: '#fff',
          fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '0 3px',
          border: '1.5px solid #714b67', lineHeight: 1,
        }}>{badge}</span>
      )}
    </button>
  );
}

/* ── Individual menu item — self-contained with fixed dropdown ─── */
function NavMenuItem({ item, navbarHeight }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ left: 0, top: 0 });
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const hasCh = !!(item.children?.length);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function h(e) {
      if (
        btnRef.current  && !btnRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Close on route change
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  function handleClick(e) {
    e.stopPropagation();
    if (item.route) {
      navigate(item.route);
    } else if (hasCh) {
      // Calculate position for fixed dropdown
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ left: rect.left, top: rect.bottom });
      setOpen(o => !o);
    }
  }

  function handleChildClick(e, route) {
    e.stopPropagation();
    navigate(route);
    setOpen(false);
  }

  return (
    <div style={{ position: 'relative', height: '100%', flexShrink: 0 }}>
      <button
        ref={btnRef}
        onClick={handleClick}
        style={{
          height: '100%',
          padding: '0 14px',
          background: open ? 'rgba(0,0,0,0.22)' : 'transparent',
          border: 'none',
          borderBottom: open
            ? '2px solid rgba(255,255,255,0.8)'
            : '2px solid transparent',
          color: 'rgba(255,255,255,0.92)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
          transition: 'background .1s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(0,0,0,0.14)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        {item.label}
        {hasCh && (
          <svg width="10" height="10" viewBox="0 0 10 10"
            style={{
              opacity: open ? 0.9 : 0.5,
              transition: 'transform .15s',
              transform: open ? 'rotate(180deg)' : 'none',
            }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </button>

      {/* ── Dropdown — position:fixed so it escapes all overflow:hidden ancestors ── */}
      {hasCh && open && (
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            minWidth: 220,
            background: '#1e1f2e',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0 4px 4px 4px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 9999,   /* above everything */
          }}
        >
          {item.children.map((child, ci) => (
            <button
              key={ci}
              onClick={e => handleChildClick(e, child.route)}
              style={{
                width: '100%',
                padding: '9px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: ci < item.children.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
                textAlign: 'left',
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background .08s',
                display: 'block',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main TopNavbar ─────────────────────────────────────────────── */
export default function TopNavbar({
  userName  = 'Administrator',
  userEmail = 'admin@company.com',
}) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [msgOpen,      setMsgOpen]      = useState(false);

  const userRef = useRef(null);
  const msgRef  = useRef(null);
  const NAVBAR_H = 46;

  // Derive active module + its menu from moduleConfig
  const seg      = location.pathname.split('/').filter(Boolean)[1] || 'home';
  const mod      = MODULE_MAP[URL_TO_MODULE[seg] || seg];
  const menuItems = mod?.menu || [];

  // Close user/msg menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMsgOpen(false);
  }, [location.pathname]);

  // Close user/msg menus on outside click
  useEffect(() => {
    function h(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (msgRef.current  && !msgRef.current.contains(e.target))  setMsgOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = (userName || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const DIVIDER  = <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.18)', margin: '0 2px', flexShrink: 0 }} />;

  return (
    <>
      <nav style={{
        height: NAVBAR_H,
        background: '#714b67',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
        userSelect: 'none',
        /* NO overflow:hidden here — that was killing dropdowns */
      }}>

        {/* Waffle */}
        <NavBtn title="Home" active={switcherOpen}
          onClick={() => setSwitcherOpen(!switcherOpen)}>
          <WaffleIcon />
        </NavBtn>

        {/* App pill */}
        <button
          onClick={() => navigate('/erp/home')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px 4px 6px',
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 5, color: '#fff',
            cursor: 'pointer', marginRight: 2, flexShrink: 0,
            fontFamily: 'inherit',
          }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#fff',
          }}>O</div>
          <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {mod?.label || 'Home'}
          </span>
        </button>

        {/* Divider */}
        {DIVIDER}

        {/* ── Module menu items ─────────────────────────────────
            overflow: visible is CRITICAL — hidden clips dropdowns  */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          flex: 1,
          overflow: 'visible',   /* ← must be visible, NOT hidden */
          minWidth: 0,
        }}>
          {menuItems.map((item, idx) => (
            <NavMenuItem
              key={idx}
              item={item}
              navbarHeight={NAVBAR_H}
            />
          ))}
        </div>

        {/* ── Right side ────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 8, gap: 1, flexShrink: 0 }}>

          <NavBtn title="Odoo AI"><AIIcon /></NavBtn>

          {/* Messaging */}
          <div ref={msgRef} style={{ position: 'relative' }}>
            <NavBtn title="Messaging" active={msgOpen} badge={4}
              onClick={() => setMsgOpen(!msgOpen)}>
              <MessageIcon />
            </NavBtn>
            {msgOpen && (
              <div style={{
                position: 'fixed',
                top: NAVBAR_H,
                right: 80,
                width: 280,
                background: '#1e1f2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 9999,
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Messaging</span>
                </div>
                <div style={{ padding: '20px 14px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>No new messages</p>
                </div>
              </div>
            )}
          </div>

          <NavBtn title="Activities" badge={3}><ClockIcon /></NavBtn>
          <NavBtn title="Debug Mode"><XIcon /></NavBtn>

          {DIVIDER}

          <span style={{
            fontSize: 13, color: 'rgba(255,255,255,0.88)', fontWeight: 500,
            padding: '0 8px 0 4px', maxWidth: 130,
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', flexShrink: 0, cursor: 'default',
          }}>
            {userName}
          </span>

          {/* Avatar + user menu */}
          <div ref={userRef} style={{ position: 'relative', paddingRight: 4 }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title={userEmail}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#00b5b5',
                border: '2px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'border-color .1s', flexShrink: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            >{initials}</button>

            {userMenuOpen && (
              <div style={{
                position: 'fixed',
                top: NAVBAR_H,
                right: 8,
                background: '#1e1f2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 9999,
                minWidth: 210,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{userEmail}</div>
                </div>
                {[
                  { icon: '👤', label: 'My Profile',      action: () => navigate('/erp/settings') },
                  { icon: '⚙',  label: 'Preferences',     action: () => navigate('/erp/settings') },
                  { icon: '🏢', label: 'My Companies',     action: () => navigate('/erp/settings/companies') },
                  null,
                  { icon: '📚', label: 'Back to Learning', action: () => navigate('/dashboard') },
                  { icon: '🚪', label: 'Log out',          action: () => navigate('/login'), danger: true },
                ].map((item, i) => item === null
                  ? <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  : (
                    <button key={i}
                      onClick={() => { item.action(); setUserMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '9px 16px',
                        background: 'transparent', border: 'none',
                        textAlign: 'left', fontSize: 13,
                        color: item.danger ? '#e74c3c' : 'rgba(255,255,255,0.82)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        gap: 9, fontFamily: 'inherit', transition: 'background .08s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {switcherOpen && <AppSwitcher onClose={() => setSwitcherOpen(false)} />}
    </>
  );
}
