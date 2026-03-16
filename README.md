# Innovation Odoo AI — Master README

> **The complete reference for the Innovation Odoo AI project.**
> An AI-powered Odoo learning platform where users study through slides,
> then prove their knowledge by completing real tasks inside a full Odoo-like ERP simulator.

---

## What Is This Project?

Innovation Odoo AI is a structured e-learning platform that teaches Odoo ERP through:

1. **81 lessons** organized into **9 sections** covering every major Odoo module
2. **AI-powered slide content** — each lesson is a deck of slides generated from real Odoo documentation
3. **ERP simulation** — after slides, users complete a hands-on task inside a fully functional,
   Odoo-like ERP system built from scratch in React
4. **AI task verification** — Claude reads the user's ERP action log and determines if the task
   was completed correctly, giving instant feedback
5. **Smart hints** — users can ask the AI for help or trigger visual highlights on the ERP screen

---

## Repository Structure

```
/
├── docs/                          ← 📁 All planning documents (this folder)
│   ├── README.md                  ← This file
│   ├── plan_v2_improved.md        ← Plan 1: Learning platform improvements
│   ├── plan_erp_system.md         ← Plan 2: Odoo-like ERP system (57 apps)
│   └── plan_grand_integration.md  ← Plan 3: ERP simulation + task verification
│
├── frontend/                      ← React learning platform (Vite + Tailwind)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── auth/              ← Login, Register, OTP, Forgot Password
│   │   │   ├── dashboard/         ← Main dashboard with sections + lessons
│   │   │   ├── course/            ← Lesson slide player
│   │   │   ├── task/              ← Task + ERP split-screen (NEW)
│   │   │   ├── plan/              ← AI study plan chat
│   │   │   ├── profile/           ← User settings (NEW)
│   │   │   └── certificate/       ← Completion certificate (NEW)
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── GlobalAIChat.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   └── api/
│   │       └── client.js
│   ├── index.html
│   └── package.json
│
├── erp/                           ← Odoo-like ERP simulator (NEW)
│   ├── src/
│   │   ├── shell/                 ← TopNavbar, Sidebar, Breadcrumb, Chatter
│   │   ├── fields/                ← All Odoo field components
│   │   ├── views/                 ← ListView, KanbanView, FormView, CalendarView
│   │   ├── data/                  ← IndexedDB layer + action log
│   │   ├── modules/               ← 57 Odoo app modules
│   │   │   ├── crm/
│   │   │   ├── sales/
│   │   │   ├── accounting/
│   │   │   ├── hr/
│   │   │   ├── inventory/
│   │   │   └── ...
│   │   └── ERPApp.jsx             ← ERP root component
│   └── package.json
│
├── backend/                       ← Django + DRF API
│   ├── accounts/                  ← Auth, user profiles
│   ├── content/                   ← Lessons, slides, sections, AI chat
│   ├── progress/                  ← User progress tracking
│   ├── assessment/                ← AI study plan
│   ├── tasks/                     ← Task definitions + AI verification (NEW)
│   └── manage.py
│
└── content/                       ← RST source files for all 81 lessons
    └── applications/
        ├── essentials/
        ├── finance/
        ├── sales/
        ├── websites/
        ├── inventory_and_mrp/
        ├── hr/
        ├── marketing/
        ├── services/
        └── productivity/
```

---

## The Three Plans

### Plan 1 — Learning Platform V2 (Improved)
**File:** `docs/plan_v2_improved.md`

Closes all quality, UX, and technical gaps in the existing V2 platform:

| Phase | What                                        | When    |
|-------|---------------------------------------------|---------|
| 1     | Critical fixes (title, favicon, Anthropic migration, color) | Week 1  |
| 2     | Public landing page + onboarding wizard     | Week 1–2 |
| 3     | Dashboard: sidebar, search, milestones, certificate | Week 2 |
| 4     | Course page: ToC sidebar, skeleton loading, error handling | Week 2–3 |
| 5     | Profile page, AI chat persistence, custom font | Week 3  |
| 6     | Mobile responsiveness audit                 | Week 3–4 |
| 7     | Email notifications                         | Week 4   |

**Key improvements:**
- `/` is now a proper marketing landing page (not a login redirect)
- AI backend migrated from OpenAI to Anthropic Claude
- Brand color defined once in Tailwind config (no more magic `#714B67` strings)
- Certificate page at `/certificate` after 100% completion
- AI chat conversation is persisted across sessions
- Rate limiting on all AI endpoints (60 req/hour per user)

---

### Plan 2 — Odoo-Like ERP System (57 Apps)
**File:** `docs/plan_erp_system.md`

A full browser-based ERP that visually and functionally mirrors Odoo:

| Section             | Apps                                                                         |
|---------------------|------------------------------------------------------------------------------|
| Essentials          | Settings, Contacts, Users, Companies, Apps, Developer Mode, Studio, IoT     |
| Finance             | Accounting, Expenses, Payment Providers, Fiscal Localizations, ESG, IAP     |
| Sales               | CRM, Sales, POS, Subscriptions, Rental                                       |
| Websites            | Website, eCommerce, Live Chat, eLearning, Forum, Blog                        |
| Supply Chain        | Inventory, Purchase, Manufacturing, Barcode, Quality, Maintenance, Repairs, PLM |
| HR                  | Employees, Payroll, Time Off, Recruitment, Appraisals, Attendances, Referrals, Fleet, Front Desk, Lunch |
| Marketing           | Email Marketing, SMS Marketing, Social Marketing, Events, Automation, Surveys |
| Services            | Project, Timesheets, Helpdesk, Field Service, Planning                       |
| Productivity        | Discuss, Calendar, Knowledge, Documents, Sign, Spreadsheet, To-Do, Appointments, Dashboards, Data Cleaning, Odoo AI, WhatsApp, VoIP |

**Total: 57 apps**

**Key technical decisions:**
- Runs entirely in the browser (React + Zustand + IndexedDB — no backend calls for ERP state)
- Every user interaction logged to an `actionLog` in IndexedDB
- Each interactive element tagged with `data-erp="..."` for hint targeting
- All 4 Odoo view types implemented: List, Kanban, Form, Calendar
- Seed data pre-loaded for realistic practice

---

### Plan 3 — Grand Integration (Learning + ERP + AI Tasks)
**File:** `docs/plan_grand_integration.md`

The full learning loop combining all three systems:

```
Lesson Slides  →  ERP Task  →  AI Verification  →  Lesson Complete
```

**The Task + ERP screen:**
- Split screen: Task Panel (30% left) + ERP Window (70% right)
- Task panel shows: task description, step checklist, AI help chat, hint button
- Steps auto-check in real time as the user works in the ERP
- Hints trigger visual highlights (purple pulse ring) on specific ERP elements
- "Submit Task" sends action log to Claude for verification
- Response in < 3 seconds: pass/fail, score, feedback, missing criteria

**AI Verification:**
- Claude receives: task criteria + full action log + ERP state snapshot
- Returns: `{ passed, score, feedback, missing }`
- Score starts at 100, deducted 10 per hint used
- Lessons are only marked complete when both slides AND task are passed

**Task content:**
- One task per lesson (81 tasks total)
- Intro lessons auto-complete on slide completion (no task required)
- Tasks auto-generated using Claude API in a one-time batch job, then human-reviewed

---

## Odoo Apps Coverage Map

| # | Section                           | Apps | Est. Hours |
|---|-----------------------------------|------|------------|
| 1 | Odoo Essentials + Studio + Settings | 23 lessons | 6h |
| 2 | Finance                           | 5 apps | 4h |
| 3 | Sales                             | 5 apps | 3h |
| 4 | Websites                          | 6 apps | 3h |
| 5 | Supply Chain                      | 8 apps | 5h |
| 6 | Human Resources                   | 10 apps | 5h |
| 7 | Marketing                         | 6 apps | 3h |
| 8 | Services                          | 5 apps | 3h |
| 9 | Productivity                      | 13 apps | 5h |
|   | **Total**                         | **81 lessons / 57 apps** | **~37h** |

---

## Tech Stack

### Learning Platform (Frontend)
| Package          | Version  | Purpose                          |
|------------------|----------|----------------------------------|
| React            | 19       | UI framework                     |
| Vite             | 7        | Build tool                       |
| Tailwind CSS     | 3.4      | Styling                          |
| React Router     | 7        | Client-side routing              |
| Zustand          | 5        | State management                 |
| Axios            | 1.x      | HTTP client                      |
| react-hot-toast  | 2.x      | Toast notifications              |

### ERP Simulator (New Frontend App)
| Package          | Version  | Purpose                          |
|------------------|----------|----------------------------------|
| React            | 19       | UI framework                     |
| Vite             | 7        | Build tool                       |
| Tailwind CSS     | 3.4      | Styling                          |
| Zustand          | 5        | Per-module state                 |
| idb              | 8.x      | IndexedDB wrapper                |
| React Router     | 7        | ERP URL routing                  |

### Backend
| Package                   | Purpose                              |
|---------------------------|--------------------------------------|
| Django                    | Web framework                        |
| Django REST Framework     | API layer                            |
| anthropic                 | Claude API (replaces openai)         |
| PostgreSQL                | Primary database                     |
| djangorestframework throttle | Rate limiting on AI endpoints    |

---

## Environment Variables

### Backend `.env`
```
ANTHROPIC_API_KEY=sk-ant-...        # Claude API (replaces OPENAI_API_KEY)
SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgres://...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG....
```

### Frontend `.env`
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Innovation Odoo AI
```

---

## New API Endpoints (Plan 3 Additions)

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| GET    | `/api/tasks/:lesson_id/`        | Get task definition for a lesson         |
| POST   | `/api/tasks/verify/`            | Submit action log for AI verification    |
| GET    | `/api/tasks/:lesson_id/attempts/` | Get user's attempt history for a task  |
| GET    | `/api/profile/`                 | Get user profile                         |
| PUT    | `/api/profile/`                 | Update user profile                      |
| GET    | `/api/progress/certificate/`    | Get certificate (if eligible)            |
| GET    | `/api/ai/conversation/`         | Get persisted AI chat history            |

---

## Full Development Timeline

| Week  | Focus                                                   | Plan Ref  |
|-------|---------------------------------------------------------|-----------|
| 1     | Critical fixes: title, favicon, Anthropic, brand color  | Plan 1 P1 |
| 2     | Landing page + onboarding wizard                        | Plan 1 P2 |
| 3     | Dashboard sidebar + search + milestones                 | Plan 1 P3 |
| 4     | Course page ToC + skeleton loading + error handling     | Plan 1 P4 |
| 5     | Profile page + AI chat persistence + font               | Plan 1 P5 |
| 6     | Mobile audit + email notifications                      | Plan 1 P6–7 |
| 7–8   | ERP shell: NavBar, Sidebar, field components, views     | Plan 2 PA |
| 9–10  | ERP core modules: CRM, Sales, HR, Inventory, Accounting | Plan 2 PB |
| 11–13 | ERP remaining 35 modules                                | Plan 2 PC |
| 14    | ERP pixel polish + action log coverage                  | Plan 2 PD |
| 15    | Backend: LessonTask + TaskAttempt models + endpoints    | Plan 3    |
| 16    | Frontend: TaskPage + TaskPanel + ERPWindow              | Plan 3    |
| 17    | AI verification engine + hint system                    | Plan 3    |
| 18    | Task content generation (81 lessons, Claude batch)      | Plan 3    |
| 19    | Step auto-check + real-time progress in task panel      | Plan 3    |
| 20    | Full QA: mobile, accessibility, performance             | All       |
| 21    | Beta launch + feedback collection                       | All       |
| 22    | Hotfixes + content refinement                           | All       |

**Total estimated duration: ~22 weeks (5–6 months)**

---

## Quick Start for Developers

### 1. Clone and install

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Learning Platform Frontend
cd frontend
npm install
npm run dev

# ERP Simulator (when ready)
cd erp
npm install
npm run dev
```

### 2. Required environment setup

```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Add your Anthropic API key to backend/.env
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Load content

```bash
# Import all lesson content from RST files
python manage.py import_rst_content

# Load lesson tasks (after task generation)
python manage.py import_lesson_tasks

# Load ERP seed data (in browser via Settings → Reset Demo Data)
```

---

## Key Design Decisions & Rationale

| Decision | Reason |
|----------|--------|
| ERP runs in browser (IndexedDB, no backend) | Zero latency for user interactions; ERP state doesn't need to persist between devices |
| AI verification via Claude (not rule-based) | Tasks can be completed in multiple valid ways; Claude handles ambiguity better than rigid field checks |
| Split-screen task view (not modal or separate page) | User can see instructions and ERP simultaneously; reduces context switching |
| Steps auto-check in real time | Gives users instant feedback without interrupting their flow |
| Hints use CSS `data-erp` selectors (not coordinates) | Resilient to layout changes; works at any viewport width |
| Skip task always available | Learning first, assessment second; no gatekeeping |
| Brand color in Tailwind config (not inline styles) | One change in config updates entire app consistently |
| Migrate from OpenAI to Anthropic | Product brand alignment; Claude is the AI in "Innovation Odoo AI" |

---

## Files in `/docs`

| File                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `README.md`                   | This file — master reference for the entire project |
| `plan_v2_improved.md`         | Learning platform improvements (20 items across 7 phases) |
| `plan_erp_system.md`          | Full ERP architecture: 57 apps, 4 view types, shared infrastructure |
| `plan_grand_integration.md`   | Task + ERP + AI verification integration plan    |

---

## Questions?

Every architectural decision in this project is documented in the three plan files.
If something is unclear, check:
1. `plan_v2_improved.md` for anything about the learning platform (slides, dashboard, auth)
2. `plan_erp_system.md` for anything about the ERP (specific app, view types, data layer)
3. `plan_grand_integration.md` for anything about tasks, hints, verification, or the split-screen UI
