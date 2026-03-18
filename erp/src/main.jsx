import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { runSeed } from './data/seed.js'
import './erp-fixes.css'
import './actionbar-vars.css'



// Seed the database on first launch (no-op if already seeded at current version)
runSeed().catch(err => console.warn('[Seed] Failed:', err))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
