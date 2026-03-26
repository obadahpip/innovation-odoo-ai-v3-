import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import useTranslation from '../../i18n/useTranslation';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data.tokens, res.data.user);
      toast.success(t('dash_welcome') + '!');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needs_verification) {
        toast.error('Please verify your email first.');
        navigate('/verify-otp', { state: { email: form.email } });
        return;
      }
      toast.error(data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#714B67] to-[#5a3a52] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Language switcher top right */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('login_title')}</h1>
          <p className="text-gray-500 mt-1">{t('login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login_email')}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">{t('login_password')}</label>
              <Link to="/forgot-password" className="text-xs text-[#714B67] hover:underline">
                {t('login_forgot')}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? t('login_loading') : t('login_btn')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('login_noAccount')}{' '}
          <Link to="/register" className="text-[#714B67] font-medium hover:underline">
            {t('login_createOne')}
          </Link>
        </p>
      </div>
    </div>
  );
}
