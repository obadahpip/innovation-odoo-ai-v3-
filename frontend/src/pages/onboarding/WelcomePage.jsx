import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'developer',   label: 'Developer',   icon: '💻' },
  { value: 'accountant',  label: 'Accountant',  icon: '📊' },
  { value: 'manager',     label: 'Manager',     icon: '📋' },
  { value: 'student',     label: 'Student',     icon: '🎓' },
  { value: 'other',       label: 'Other',       icon: '👤' },
];

const EXPERIENCE = [
  { value: 'none',     label: 'None',     desc: 'I have never used Odoo before' },
  { value: 'some',     label: 'Some',     desc: 'I have used Odoo a little'     },
  { value: 'advanced', label: 'Advanced', desc: 'I am comfortable with Odoo'    },
];

const SUGGESTED_GOALS = [
  'Learn accounting & invoicing',
  'Manage inventory & warehouse',
  'Set up HR & payroll',
  'Build a website & online store',
  'Automate sales & CRM',
  'Customise Odoo with Studio',
];

const STEPS = ['Your role', 'Experience', 'Your goal'];

export default function WelcomePage() {
  const navigate  = useNavigate();
  const [step, setStep]         = useState(0);
  const [role, setRole]         = useState('');
  const [experience, setExp]    = useState('');
  const [goal, setGoal]         = useState('');
  const [saving, setSaving]     = useState(false);

  const canNext = [
    !!role,
    !!experience,
    !!goal.trim(),
  ][step];

  const next = () => {
    if (step < 2) { setStep(step + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post('/auth/onboarding/', { role, experience, learning_goal: goal });
      toast.success('Plan created! Let\'s start learning 🎉');
      navigate('/dashboard');
    } catch {
      toast.error('Could not save your preferences. You can update them later in settings.');
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-brand transition-all duration-500"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex border-b border-gray-100">
          {STEPS.map((label, i) => (
            <div key={i} className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              i === step ? 'text-brand border-b-2 border-brand' :
              i < step   ? 'text-green-500' : 'text-gray-400'
            }`}>
              {i < step ? '✓ ' : ''}{label}
            </div>
          ))}
        </div>

        <div className="p-8">

          {/* ── Step 0: Role ─────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome! Tell us about yourself</h2>
              <p className="text-sm text-gray-500 mb-6">We'll tailor your learning path to your role.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      role === r.value
                        ? 'border-brand bg-brand/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Experience ───────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What's your Odoo experience?</h2>
              <p className="text-sm text-gray-500 mb-6">This helps us set the right pace for your lessons.</p>
              <div className="space-y-3">
                {EXPERIENCE.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setExp(e.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      experience === e.value
                        ? 'border-brand bg-brand/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{e.label}</div>
                      <div className="text-sm text-gray-500">{e.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      experience === e.value ? 'border-brand bg-brand' : 'border-gray-300'
                    }`}>
                      {experience === e.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Goal ─────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What do you want to achieve?</h2>
              <p className="text-sm text-gray-500 mb-4">Type your own goal or pick a suggestion.</p>

              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. I want to learn how to manage my company's accounting in Odoo..."
                rows={3}
                className="input-field resize-none mb-4"
              />

              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Suggested goals</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      goal === g
                        ? 'border-brand bg-brand text-white'
                        : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Navigation ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={!canNext || saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Setting up...' : step === 2 ? 'Start learning 🎉' : 'Continue →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
