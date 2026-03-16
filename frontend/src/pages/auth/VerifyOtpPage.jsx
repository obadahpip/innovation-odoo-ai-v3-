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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // 10 minute expiry countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // 60s resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
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
      navigate('/assessment');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid or expired code';
      toast.error(msg);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      toast.success('New code sent! Check your email.');
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error('Failed to resend code. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#714B67] to-[#5a3a52] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-500 mt-2">
            We sent a 6-digit code to<br />
            <span className="font-medium text-gray-700">{email}</span>
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
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 outline-none transition-all"
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            Code expires in <span className={`font-mono font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>{formatTime(timeLeft)}</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        <div className="text-center mt-4">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#714B67] text-sm font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          ) : (
            <p className="text-sm text-gray-400">
              Resend available in {resendCooldown}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
