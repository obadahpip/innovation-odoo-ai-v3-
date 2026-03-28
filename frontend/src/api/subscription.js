import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

/** GET /api/payments/subscription/ */
export const getSubscriptionStatus = () =>
  axios.get(`${API}/api/payments/subscription/`, { headers: authHeaders() });

/** POST /api/payments/initiate/  (cash or CliQ) */
export const initiateManualPayment = (method, transfer_reference) =>
  axios.post(
    `${API}/api/payments/initiate/`,
    { method, transfer_reference },
    { headers: authHeaders() },
  );

/**
 * POST /api/payments/paypal/confirm/
 *
 * Called AFTER the PayPal frontend SDK has already captured the order.
 * Sends the captured order details to the backend for verification + subscription grant.
 *
 * @param {Object} captureDetails - { order_id, capture_id, payer_email, payer_id, status, amount }
 */
export const confirmPayPalPayment = (captureDetails) =>
  axios.post(
    `${API}/api/payments/paypal/confirm/`,
    captureDetails,
    { headers: authHeaders() },
  );

/** POST /api/payments/admin/grant/<id>/  (admin only) */
export const adminGrantSubscription = (userId) =>
  axios.post(
    `${API}/api/payments/admin/grant/${userId}/`,
    {},
    { headers: authHeaders() },
  );