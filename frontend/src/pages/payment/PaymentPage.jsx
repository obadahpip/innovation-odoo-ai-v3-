import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionStatus, initiateManualPayment, confirmPayPalPayment } from '../../api/subscription';

// ── PayPal Client ID — loaded from .env ──────────────────────────────────────
// Set VITE_PAYPAL_CLIENT_ID in frontend/.env — must match PAYPAL_CLIENT_ID in backend/.env
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

// ── PayPal SDK loader ─────────────────────────────────────────────────────────
function loadPayPalSDK(clientId) {
  return new Promise((resolve, reject) => {
    // If window.paypal already exists and SDK is healthy, resolve immediately
    if (window.paypal && window.paypal.Buttons) {
      resolve();
      return;
    }

    // Remove any stale/failed script tag before injecting a fresh one
    const existing = document.getElementById('paypal-sdk');
    if (existing) existing.remove();

    const script   = document.createElement('script');
    script.id      = 'paypal-sdk';
    script.src     = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.onload  = resolve;
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.body.appendChild(script);
  });
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    trial:         { label: 'Free Trial',    color: '#2563eb' },
    trial_expired: { label: 'Trial Expired', color: '#dc2626' },
    active:        { label: 'Active',        color: '#16a34a' },
    admin_granted: { label: 'Admin Granted', color: '#7c3aed' },
  };
  const { label, color } = map[status] || { label: status, color: '#6b7280' };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: 20,
      fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      background: `${color}18`, color, border: `1px solid ${color}40`,
    }}>
      {label}
    </span>
  );
}

export default function PaymentPage() {
  const navigate  = useNavigate();
  const paypalRef = useRef(null);

  const [subData,    setSubData]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('paypal');
  const [cliqProof,  setCliqProof]  = useState('');   // CliQ proof of payment
  const [submitting, setSubmitting] = useState(false);
  const [message,    setMessage]    = useState(null);

  // ── Load subscription status ──────────────────────────────────────────────
  useEffect(() => {
    getSubscriptionStatus()
      .then(r => {
        setSubData(r.data);
        if (r.data.has_active_access) navigate('/dashboard');
      })
      .catch(() => setMessage({ type: 'error', text: 'Could not load subscription info.' }))
      .finally(() => setLoading(false));
  }, []);

  // ── Mount PayPal buttons ──────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'paypal') return;
    if (!PAYPAL_CLIENT_ID) return;

    let cancelled = false;

    // Small delay to ensure the ref div is in the DOM after tab switch
    const timer = setTimeout(() => {
      loadPayPalSDK(PAYPAL_CLIENT_ID)
        .then(() => {
          if (cancelled || !paypalRef.current) return;
          paypalRef.current.innerHTML = '';

          window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color:  'blue',
            shape:  'rect',
            label:  'pay',
          },

          // Step 1 — frontend creates the order
          createOrder: function (data, actions) {
            setMessage(null);
            return actions.order.create({
              purchase_units: [{
                amount: { value: '300.00' },
                description: 'Innovation Odoo AI — 1 Year Subscription',
              }],
              application_context: {
                brand_name:   'Innovation Odoo AI',
                landing_page: 'NO_PREFERENCE',
                user_action:  'PAY_NOW',
              },
            });
          },

          // Step 2 — frontend captures, then notifies backend
          onApprove: function (data, actions) {
            setSubmitting(true);
            return actions.order.capture().then(async function (details) {
              try {
                await confirmPayPalPayment({
                  order_id:    data.orderID,
                  capture_id:  details.purchase_units?.[0]?.payments?.captures?.[0]?.id || '',
                  payer_email: details.payer?.email_address || '',
                  payer_id:    details.payer?.payer_id || '',
                  status:      details.status,
                  amount:      details.purchase_units?.[0]?.amount?.value || '300.00',
                });
                setMessage({
                  type: 'success',
                  text: `Payment completed successfully! Transaction ID: ${details.id} — Your 1-year subscription is now active.`,
                });
                setTimeout(() => navigate('/dashboard'), 3000);
              } catch {
                setMessage({
                  type: 'error',
                  text: `Payment captured (ID: ${details.id}) but activation failed. Please contact support@innovation-odoo.com with this ID.`,
                });
              } finally {
                setSubmitting(false);
              }
            });
          },

          onError: function (err) {
            console.error('PayPal error:', err);
            setMessage({ type: 'error', text: 'An error occurred during payment. Please try again.' });
            setSubmitting(false);
          },

          onCancel: function () {
            setMessage({ type: 'error', text: 'Payment cancelled.' });
          },
          }).render(paypalRef.current);
        })
        .catch(() => {
          if (!cancelled) setMessage({ type: 'error', text: 'PayPal failed to load. Try cash or CliQ instead.' });
        });
    }, 100);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [tab]);

  // ── Submit cash (no reference — system auto-generates) ────────────────────
  async function handleCashSubmit() {
    setSubmitting(true);
    setMessage(null);
    try {
      // Pass empty reference — backend records the request, reference is system-generated
      await initiateManualPayment('cash', '');
      setMessage({
        type: 'success',
        text: 'Cash payment request submitted! Admin will verify and activate your account within 24 hours. You will receive a confirmation email.',
      });
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Submit CliQ ───────────────────────────────────────────────────────────
  async function handleCliqSubmit() {
    if (!cliqProof.trim()) {
      setMessage({ type: 'error', text: 'Please provide your proof of payment.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await initiateManualPayment('cliq', cliqProof.trim());
      setMessage({
        type: 'success',
        text: 'CliQ payment submitted! Admin will verify and activate your account within 24 hours.',
      });
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <p style={{ color: '#666', marginTop: 16, textAlign: 'center' }}>Loading…</p>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Innovation Odoo AI</h1>
          <p style={styles.subtitle}>Secure Payment Portal</p>
        </div>

        {/* Plan banner */}
        <div style={styles.planBanner}>
          <h2 style={{ fontSize: 20, marginBottom: 5 }}>1-Year Full Access</h2>
          <p style={{ opacity: 0.9, fontSize: 14 }}>All 91 lessons · Live Odoo practice · AI assistance</p>
        </div>

        {/* Status strip */}
        {subData && (
          <div style={styles.statusStrip}>
            <StatusBadge status={subData.subscription_status} />
            {subData.subscription_status === 'trial' && (
              <span style={{ fontSize: 13, color: '#374151', marginLeft: 10 }}>
                <strong>{subData.trial_days_remaining}</strong> day{subData.trial_days_remaining !== 1 ? 's' : ''} left in trial
              </span>
            )}
            {subData.subscription_status === 'trial_expired' && (
              <span style={{ fontSize: 13, color: '#dc2626', marginLeft: 10 }}>Your trial has ended</span>
            )}
          </div>
        )}

        {/* Read-only notice */}
        <div style={styles.readOnlyNotice}>
          ℹ️ Amount is fixed for the 1-year subscription plan.
        </div>

        {/* Amount (read-only) */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Payment Amount (USD) — Read Only</label>
          <input style={styles.amountInput} value="$300.00" disabled readOnly />
        </div>

        {/* Alert */}
        {message && (
          <div style={{
            ...styles.alert,
            background:  message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            borderColor: message.type === 'success' ? '#86efac' : '#fca5a5',
            color:       message.type === 'success' ? '#15803d' : '#dc2626',
          }}>
            {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'paypal', label: '💳 PayPal / Card' },
            { key: 'cash',   label: '💵 Cash' },
            { key: 'cliq',   label: '📱 CliQ' },
          ].map(t => (
            <button
              key={t.key}
              style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
              onClick={() => { setTab(t.key); setMessage(null); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PayPal ── */}
        {tab === 'paypal' && (
          <div>
            {submitting && (
              <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 10 }}>
                Processing payment…
              </p>
            )}
            <div ref={paypalRef} id="paypal-button-container" style={{ minHeight: 50 }} />
            <div style={styles.infoBox}>
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>
                <strong>Secure Payment:</strong> Your payment is processed securely through PayPal.
                We never store your payment information.
              </p>
            </div>
            <div style={styles.secureBadge}>🔒 Secured by PayPal</div>
          </div>
        )}

        {/* ── Cash ── */}
        {tab === 'cash' && (
          <div>
            <div style={styles.instructionBox}>
              <h3 style={styles.instrTitle}>Cash Payment Instructions</h3>
              <ol style={styles.instrList}>
                <li>Visit our office or contact us to arrange cash payment.</li>
                <li>Pay <strong>$300 USD</strong> (or equivalent in JOD).</li>
                <li>Click the button below — we will contact you to confirm.</li>
              </ol>
              {/* ── Support email (no phone) ── */}
              <div style={styles.supportLine}>
                ✉️ <a href="mailto:support@innovation-odoo.com" style={styles.emailLink}>
                  support@innovation-odoo.com
                </a>
              </div>
            </div>

            {/* ── No reference field — system generates it ── */}
            <div style={styles.systemRefNote}>
              🔖 A payment reference will be automatically generated and sent to your email after submission.
            </div>

            <button
              style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
              onClick={handleCashSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Cash Payment Request'}
            </button>
          </div>
        )}

        {/* ── CliQ ── */}
        {tab === 'cliq' && (
          <div>
            <div style={styles.instructionBox}>
              <h3 style={styles.instrTitle}>CliQ Transfer Instructions</h3>
              <ol style={styles.instrList}>
                <li>Open your banking app and go to CliQ.</li>
                <li>Transfer <strong>$300 USD equivalent in JOD</strong> to:</li>
              </ol>
              {/* ── CliQ alias only (no account name) ── */}
              <div style={styles.cliqDetails}>
                <div style={styles.cliqRow}>
                  <span style={styles.cliqLabel}>CliQ Alias</span>
                  <span style={styles.cliqValue}>InnovationOdoo</span>
                </div>
              </div>
              <ol start={3} style={styles.instrList}>
                <li>Add your email in the transfer note.</li>
                <li>Upload or describe your proof of payment below and submit.</li>
              </ol>
              <div style={styles.supportLine}>
                ✉️ <a href="mailto:support@innovation-odoo.com" style={styles.emailLink}>
                  support@innovation-odoo.com
                </a>
              </div>
            </div>

            {/* ── Proof of payment (replaces "Transfer Reference Number") ── */}
            <label style={styles.label}>Proof of Payment</label>
            <textarea
              style={styles.textarea}
              placeholder="Describe your transfer (e.g. transferred on 28 Mar, amount 213 JOD, from Arab Bank) or paste a screenshot description / transaction ID"
              value={cliqProof}
              onChange={e => setCliqProof(e.target.value)}
              rows={3}
            />
            <button
              style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
              onClick={handleCliqSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit CliQ Payment'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.backLink} onClick={() => navigate(-1)}>← Back</button>
          <span style={{ color: '#999', fontSize: 12 }}>Secured by PayPal</span>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: 500, width: '100%', padding: 40,
  },
  header: { textAlign: 'center', marginBottom: 24 },
  title:    { color: '#667eea', fontSize: 28, fontWeight: 700, marginBottom: 5 },
  subtitle: { color: '#666', fontSize: 14 },
  planBanner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, textAlign: 'center',
  },
  statusStrip: {
    display: 'flex', alignItems: 'center',
    background: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: 10, padding: '10px 16px', marginBottom: 16,
  },
  readOnlyNotice: {
    background: '#e3f2fd', borderLeft: '4px solid #2196f3',
    padding: 12, borderRadius: 6, marginBottom: 16,
    color: '#1976d2', fontSize: 13,
  },
  formGroup: { marginBottom: 20 },
  label:  { display: 'block', color: '#333', fontWeight: 600, marginBottom: 8, fontSize: 14 },
  amountInput: {
    width: '100%', padding: 15, border: '2px solid #667eea',
    borderRadius: 10, fontSize: 18, fontWeight: 600,
    background: '#f5f5f5', color: '#667eea', cursor: 'not-allowed',
    boxSizing: 'border-box',
  },
  alert: {
    border: '1px solid', borderRadius: 10,
    padding: '12px 16px', fontSize: 14, marginBottom: 16, lineHeight: 1.5,
  },
  tabs: {
    display: 'flex', gap: 6, marginBottom: 20,
    background: '#f3f4f6', borderRadius: 10, padding: 4,
  },
  tab: {
    flex: 1, padding: '8px 4px', border: 'none', borderRadius: 8,
    background: 'transparent', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', color: '#6b7280', transition: 'all 0.3s ease',
  },
  tabActive: { background: '#fff', color: '#111827', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' },
  infoBox: {
    background: '#f8f9ff', borderLeft: '4px solid #667eea',
    padding: 15, borderRadius: 8, marginTop: 16,
  },
  secureBadge: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: 12, color: '#999', fontSize: 12,
  },
  instructionBox: {
    background: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: 12, padding: '16px 20px', marginBottom: 16,
  },
  instrTitle: { margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#111827' },
  instrList:  { margin: '0 0 10px', paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.8 },
  supportLine: { fontSize: 13, color: '#374151', marginTop: 10 },
  emailLink: { color: '#667eea', textDecoration: 'none', fontWeight: 600 },
  systemRefNote: {
    background: '#fffbeb', border: '1px solid #fcd34d',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 13, color: '#92400e', marginBottom: 14,
  },
  cliqDetails: {
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: 8, padding: '10px 14px', margin: '10px 0',
  },
  cliqRow:   { display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 },
  cliqLabel: { color: '#6b7280' },
  cliqValue: { fontWeight: 700, color: '#111827', fontFamily: 'monospace', fontSize: 14 },
  textarea: {
    width: '100%', padding: '12px 14px', border: '2px solid #e0e0e0',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    marginBottom: 12, fontFamily: 'inherit', resize: 'vertical',
    transition: 'border-color 0.3s',
  },
  submitBtn: {
    width: '100%', padding: 14,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff', border: 'none', borderRadius: 10,
    fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s',
  },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 24, paddingTop: 16, borderTop: '1px solid #f3f4f6',
  },
  backLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6b7280', padding: 0 },
  spinner: {
    width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #667eea',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '16px auto 0',
  },
};