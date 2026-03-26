import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ── Apply saved language direction before first render ───────────────────────
// This prevents a flash of LTR layout when the user has Arabic saved.
const savedLang = localStorage.getItem('app_language') || 'en';
document.documentElement.lang      = savedLang;
document.documentElement.dir       = savedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.setAttribute('data-lang', savedLang);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
