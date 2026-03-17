import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);       // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // 10-minute expiry countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // 60s resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDigit = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, code: fullCode });
      login(res.data.tokens, res.data.user);
      toast.success('Email verified! Welcome aboard.');
      // ── Phase 2: redirect new users to onboarding wizard ──────────────
      navigate('/welcome');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid or expired code. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      toast.success('A new code has been sent to your email.');
      setResendCooldown(60);
      setCanResend(false);
      setTimeLeft(600);
    } catch {
      toast.error('Could not resend the code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            We sent a 6-digit code to <strong className="text-gray-700">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg
                           focus:border-brand focus:outline-none transition-colors"
              />
            ))}
          </div>

          <div className="text-center text-xs text-gray-400 mb-6">
            Code expires in <span className="font-semibold text-gray-600">{formatTime(timeLeft)}</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify email'}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={handleResend}
            disabled={!canResend || resending}
            className="text-sm text-brand hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resending
              ? 'Sending...'
              : canResend
              ? 'Resend code'
              : `Resend in ${resendCooldown}s`}
          </button>
        </div>
      </div>
    </div>
  );
}
