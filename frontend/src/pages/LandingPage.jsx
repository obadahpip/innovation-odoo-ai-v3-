import { useNavigate } from 'react-router-dom';
import useTranslation from '../i18n/useTranslation';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const SECTION_ICONS = ["⚙️","💰","🤝","🌐","🏭","👥","📣","🛠️","📊"];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Accountant', text: 'The Finance section gave me everything I needed to get started with Odoo Accounting in a week.' },
  { name: 'James K.', role: 'Developer',  text: 'The Studio lessons are incredibly clear. I could customise Odoo views on day one.' },
  { name: 'Leila R.', role: 'Manager',    text: 'The personalised plan meant I never wasted time on irrelevant modules.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  const HOW_STEPS = [
    { n: 1, title: t('landing_step1_title'), desc: t('landing_step1_desc') },
    { n: 2, title: t('landing_step2_title'), desc: t('landing_step2_desc') },
    { n: 3, title: t('landing_step3_title'), desc: t('landing_step3_desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">O</div>
            <span className="font-semibold text-gray-900">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-brand font-medium px-4 py-2 transition-colors">
              {t('landing_signin')}
            </button>
            <button onClick={() => navigate('/register')}
              className="btn-primary text-sm py-2 px-4">
              {t('landing_cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span>🎓</span> {t('landing_tagline')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 whitespace-pre-line">
            {t('landing_hero_title')}
          </h1>
          <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            {t('landing_hero_sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')}
              className="bg-white text-brand font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              {t('landing_cta')} →
            </button>
            <button onClick={() => navigate('/login')}
              className="border border-white/40 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              {t('landing_signin')}
            </button>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">{t('landing_how_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, title, desc }) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-10 h-10 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">{t('landing_test_title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('landing_hero_title').split('\n')[0]}</h2>
        <p className="text-purple-100 mb-8 max-w-lg mx-auto">{t('landing_hero_sub')}</p>
        <button onClick={() => navigate('/register')}
          className="bg-white text-brand font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          {t('landing_startFree')}
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand flex items-center justify-center text-white text-xs font-bold">O</div>
            <span>{t('appName')}</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/login')}    className="hover:text-brand transition-colors">{t('landing_signin')}</button>
            <button onClick={() => navigate('/register')} className="hover:text-brand transition-colors">{t('landing_register')}</button>
          </div>
          <div>© {new Date().getFullYear()} {t('appName')}. {t('landing_footer_copy')}</div>
        </div>
      </footer>

    </div>
  );
}
