import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import toast from 'react-hot-toast';

const STEP_EMAIL = 1;
const STEP_CODE = 2;
const STEP_NEW_PASSWORD = 3;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

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

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success('If that email is registered, a reset code has been sent.');
      setStep(STEP_CODE);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitCode = (e) => {
    e.preventDefault();
    if (code.join('').length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }
    setStep(STEP_NEW_PASSWORD);
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        code: code.join(''),
        new_password: passwords.new_password,
        confirm_password: passwords.confirm_password,
      });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to reset password';
      toast.error(msg);
      if (msg.includes('expired') || msg.includes('Invalid')) {
        setStep(STEP_CODE);
        setCode(['', '', '', '', '', '']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#714B67] to-[#5a3a52] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-[#714B67]' : s < step ? 'w-4 bg-[#714B67]/40' : 'w-4 bg-gray-200'}`} />
          ))}
        </div>

        {step === STEP_EMAIL && (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔑</div>
              <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
              <p className="text-gray-500 mt-2">Enter your email and we'll send you a reset code.</p>
            </div>
            <form onSubmit={submitEmail} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
            </form>
          </>
        )}

        {step === STEP_CODE && (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-gray-900">Enter reset code</h1>
              <p className="text-gray-500 mt-2">We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span></p>
            </div>
            <form onSubmit={submitCode}>
              <div className="flex gap-2 justify-center mb-6">
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
              <button type="submit" className="btn-primary w-full">Continue</button>
            </form>
          </>
        )}

        {step === STEP_NEW_PASSWORD && (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
              <p className="text-gray-500 mt-2">Choose a strong password for your account.</p>
            </div>
            <form onSubmit={submitNewPassword} className="space-y-4">
              <input
                type="password"
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                required
                className="input-field"
                placeholder="New password"
              />
              <input
                type="password"
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                required
                className="input-field"
                placeholder="Confirm new password"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-[#714B67] font-medium hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
