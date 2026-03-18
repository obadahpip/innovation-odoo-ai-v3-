import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SWITCHER_MODULES } from '../data/moduleConfig';

/**
 * AppSwitcher.jsx
 * The "waffle" grid that opens when you click the ⊞ icon in the navbar.
 * Shows all 28 ERP modules. Built = full color, coming = dimmed badge.
 * Matches Odoo 17's app drawer style.
 */
export default function AppSwitcher({ onClose }) {
  const navigate   = useNavigate();
  const ref        = useRef(null);
  const [search, setSearch] = useState('');

  const filtered = SWITCHER_MODULES.filter(m =>
    m.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  function go(mod) {
    navigate(mod.route);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
      }} onClick={onClose} />

      {/* Panel */}
      <div ref={ref} style={{
        position: 'fixed',
        top: 48,
        left: 0,
        bottom: 0,
        width: 340,
        background: 'var(--erp-sidebar)',
        borderRight: '1px solid var(--erp-border)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid var(--erp-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--erp-text)', fontWeight: 600, fontSize: 14 }}>
            All Apps
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--erp-text-muted)',
            cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 4px',
          }}>×</button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 12px', flexShrink: 0 }}>
          <input
            autoFocus
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--erp-input-bg)',
              border: '1px solid var(--erp-border)',
              borderRadius: 6,
              padding: '7px 12px',
              fontSize: 13,
              color: 'var(--erp-text)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* App grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          padding: '4px 10px 16px',
          flex: 1,
        }}>
          {filtered.map(mod => {
            const isBuilt   = mod.status === 'built';
            const isStub    = mod.status === 'stub';
            const isComing  = mod.status === 'coming';

            return (
              <button
                key={mod.id}
                onClick={() => go(mod)}
                title={mod.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: '10px 4px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'background .12s',
                  opacity: isComing ? 0.65 : 1,
                  position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon circle */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: mod.color + (isComing ? '20' : '28'),
                  border: `1.5px solid ${mod.color}${isComing ? '30' : '50'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  position: 'relative',
                }}>
                  {mod.icon}

                  {/* Coming-soon lock badge */}
                  {isComing && (
                    <div style={{
                      position: 'absolute',
                      bottom: -3,
                      right: -3,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: 'var(--erp-sidebar)',
                      border: '1px solid var(--erp-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                    }}>⏳</div>
                  )}
                  {isStub && (
                    <div style={{
                      position: 'absolute',
                      bottom: -3,
                      right: -3,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#f0ad4e',
                      border: '1px solid var(--erp-sidebar)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                    }}>⚠</div>
                  )}
                </div>

                {/* Label */}
                <span style={{
                  color: isComing ? 'var(--erp-text-muted)' : 'var(--erp-text)',
                  fontSize: 10,
                  textAlign: 'center',
                  lineHeight: 1.3,
                  maxWidth: 62,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {mod.label}
                </span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'var(--erp-text-muted)',
              fontSize: 13,
              padding: '20px 0',
            }}>
              No apps found for "{search}"
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--erp-border)',
          display: 'flex',
          gap: 14,
          flexShrink: 0,
        }}>
          {[
            { label: 'Built', color: '#28a745' },
            { label: 'Partial', color: '#f0ad4e' },
            { label: 'Coming', color: '#6c757d' },
          ].map(({ label, color }) => (
            <span key={label} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, color: 'var(--erp-text-muted)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
