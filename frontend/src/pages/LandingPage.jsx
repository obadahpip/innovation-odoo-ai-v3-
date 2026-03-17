import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { number: 1, name: 'General & Studio',        icon: '⚙️',  lessons: 24, desc: 'Platform basics, settings, Studio customisation' },
  { number: 2, name: 'Finance',                 icon: '💰',  lessons: 6,  desc: 'Accounting, expenses, payments & localisation' },
  { number: 3, name: 'Sales',                   icon: '🤝',  lessons: 6,  desc: 'CRM, sales orders, subscriptions & rental' },
  { number: 4, name: 'Website & eCommerce',     icon: '🌐',  lessons: 6,  desc: 'Website builder, online shop, eLearning & blog' },
  { number: 5, name: 'Inventory & Manufacturing',icon: '🏭', lessons: 8,  desc: 'Stock, manufacturing, quality, PLM & repairs' },
  { number: 6, name: 'HR',                      icon: '👥',  lessons: 10, desc: 'Employees, payroll, recruitment, time off & more' },
  { number: 7, name: 'Marketing',               icon: '📣',  lessons: 6,  desc: 'Email, SMS, social, events & automation' },
  { number: 8, name: 'Services',                icon: '🛠️',  lessons: 5,  desc: 'Projects, timesheets, helpdesk & field service' },
  { number: 9, name: 'Productivity',            icon: '📊',  lessons: 10, desc: 'Discuss, Documents, Sign, Calendar & more' },
];

const STEPS = [
  { n: 1, title: 'Create an account',   desc: 'Sign up free in under 30 seconds — no credit card needed.' },
  { n: 2, title: 'Get a study plan',    desc: 'Our AI advisor asks a few questions and builds a personalised lesson path for your role.' },
  { n: 3, title: 'Learn with AI',       desc: 'Work through slide-based lessons with an AI tutor answering your questions in real time.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Accountant', text: 'The Finance section gave me everything I needed to get started with Odoo Accounting in a week.' },
  { name: 'James K.', role: 'Developer',  text: 'The Studio lessons are incredibly clear. I could customise Odoo views on day one.' },
  { name: 'Leila R.', role: 'Manager',    text: 'The personalised plan meant I never wasted time on irrelevant modules.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">O</div>
            <span className="font-semibold text-gray-900">Innovation Odoo AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-brand font-medium px-4 py-2 transition-colors">
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              className="btn-primary text-sm py-2 px-4">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span>🎓</span> AI-Powered Odoo Learning Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Master Odoo ERP<br />faster with AI
          </h1>
          <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            81 structured lessons across 9 modules — with an AI tutor that explains, simplifies,
            and answers your questions on every slide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')}
              className="bg-white text-brand font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-base">
              Start Learning Free →
            </button>
            <button onClick={() => navigate('/login')}
              className="border border-white/40 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-base">
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { n: '81',  label: 'Lessons'    },
            { n: '9',   label: 'Sections'   },
            { n: '57',  label: 'Odoo Apps'  },
            { n: 'AI',  label: 'Powered'    },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-brand">{s.n}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section cards ───────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">9 complete learning sections</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything from core platform setup to advanced HR, manufacturing, and marketing automation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((s) => (
              <div key={s.number}
                className="border border-gray-200 rounded-xl p-5 hover:border-brand hover:shadow-md transition-all cursor-default group">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{s.icon}</div>
                  <span className="text-xs bg-brand/10 text-brand font-semibold px-2 py-0.5 rounded-full">
                    {s.lessons} lessons
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">From signup to your first lesson in minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Loved by Odoo learners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────────────── */}
      <section className="bg-brand py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to learn Odoo?</h2>
        <p className="text-purple-100 mb-8 max-w-md mx-auto">
          Create your free account and get a personalised study plan in minutes.
        </p>
        <button onClick={() => navigate('/register')}
          className="bg-white text-brand font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Start Learning Free →
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand flex items-center justify-center text-white text-xs font-bold">O</div>
            <span>Innovation Odoo AI</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/login')}    className="hover:text-brand transition-colors">Sign in</button>
            <button onClick={() => navigate('/register')} className="hover:text-brand transition-colors">Register</button>
          </div>
          <div>© {new Date().getFullYear()} Innovation Odoo AI. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
