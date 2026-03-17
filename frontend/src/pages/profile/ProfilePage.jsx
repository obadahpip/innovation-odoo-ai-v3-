import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { authApi } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const AVATARS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍💻', '👨‍💻', '🧑‍🎓', '👩‍🎓', '👨‍🎓', '🧑‍💼', '👩‍💼', '👨‍💼'];

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
      <h2 className="text-base font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const navigate        = useNavigate();
  const { user, logout, setUser } = useAuthStore();

  // Profile form
  const [profile, setProfile]   = useState({ first_name: '', last_name: '', job_title: '', company: '' });
  const [avatar, setAvatar]     = useState('🧑');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [savingPw, setSavingPw]   = useState(false);
  const [showPw, setShowPw]       = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting]           = useState(false);
  const [showDeleteZone, setShowDeleteZone] = useState(false);

  // Load profile on mount
  useEffect(() => {
    authApi.getProfile().then((res) => {
      const d = res.data;
      setProfile({
        first_name: d.first_name || '',
        last_name:  d.last_name  || '',
        job_title:  d.job_title  || '',
        company:    d.company    || '',
      });
      if (d.avatar_emoji) setAvatar(d.avatar_emoji);
    }).catch(() => {});
  }, []);

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ ...profile, avatar_emoji: avatar });
      setUser(res.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwords.new_password.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    setSavingPw(true);
    try {
      await api.post('/auth/change-password/', {
        current_password: passwords.current_password,
        new_password:     passwords.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not change password. Check your current password.');
    } finally {
      setSavingPw(false);
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    setDeleting(true);
    try {
      await api.delete('/auth/delete-account/');
      logout();
      navigate('/');
      toast.success('Your account has been deleted.');
    } catch {
      toast.error('Could not delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-brand transition flex items-center gap-1">
          ← Dashboard
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-semibold text-gray-900">Profile & Settings</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Avatar ───────────────────────────────────────────────────── */}
        <Section title="Your Avatar">
          <p className="text-xs text-gray-400 mb-3">Pick an emoji avatar</p>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((em) => (
              <button key={em} onClick={() => setAvatar(em)}
                className={`text-2xl w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all ${
                  avatar === em ? 'border-brand bg-brand/10' : 'border-gray-200 hover:border-gray-300'
                }`}>
                {em}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-brand/10 border-2 border-brand flex items-center justify-center text-3xl">
              {avatar}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {profile.first_name || profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`.trim()
                  : user?.email}
              </div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
        </Section>

        {/* ── Personal info ─────────────────────────────────────────────── */}
        <Section title="Personal Information">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
                <input value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="input-field" placeholder="First name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
                <input value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="input-field" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Job title</label>
              <input value={profile.job_title}
                onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                className="input-field" placeholder="e.g. Accountant, Developer…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
              <input value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="input-field" placeholder="Your company name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input value={user?.email || ''} disabled
                className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary w-full">
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </Section>

        {/* ── Change password ───────────────────────────────────────────── */}
        <Section title="Change Password">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current password</label>
              <input type={showPw ? 'text' : 'password'}
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                className="input-field" placeholder="Your current password" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New password</label>
              <input type={showPw ? 'text' : 'password'}
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                className="input-field" placeholder="At least 8 characters" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm new password</label>
              <input type={showPw ? 'text' : 'password'}
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                className="input-field" placeholder="Repeat new password" required />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={showPw} onChange={() => setShowPw(!showPw)}
                className="rounded border-gray-300" />
              Show passwords
            </label>
            <button type="submit" disabled={savingPw} className="btn-primary w-full">
              {savingPw ? 'Changing…' : 'Change password'}
            </button>
          </form>
        </Section>

        {/* ── Danger zone ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6 mb-4">
          <h2 className="text-base font-semibold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-xs text-gray-500 mb-4">
            Permanently delete your account and all your learning progress. This cannot be undone.
          </p>
          {!showDeleteZone ? (
            <button onClick={() => setShowDeleteZone(true)}
              className="text-sm text-red-500 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition">
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-700">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="input-field border-red-300 focus:ring-red-400"
                placeholder="Type DELETE here" />
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteZone(false); setDeleteConfirm(''); }}
                  className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={handleDelete} disabled={deleting || deleteConfirm !== 'DELETE'}
                  className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Permanently delete'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
