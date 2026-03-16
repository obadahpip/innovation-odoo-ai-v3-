# Plan 1 — Innovation Odoo AI Platform (V2 Improved)

> This is the full V2 plan integrated with all identified improvements.  
> Scope: Learning platform only (no ERP simulation — that is covered in Plan 3).

---

## Overview

The Innovation Odoo AI platform is a structured e-learning product teaching Odoo ERP across
9 sections and 81 lessons. V2 opened all content to all authenticated users (no payment gate)
and introduced slide-based lessons. This improved plan closes all UX, technical, and
professional quality gaps identified in the audit.

---

## Tech Stack (unchanged)

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Zustand, Axios    |
| Backend    | Django, Django REST Framework                   |
| AI         | Anthropic Claude API (migrated from OpenAI)     |
| DB         | PostgreSQL                                      |
| Auth       | JWT (access + refresh tokens)                   |

---

## Phase 1 — Critical Fixes (Week 1)

### 1.1 Fix `index.html`
- Change `<title>` from `"frontend"` to `"Innovation Odoo AI"`
- Add `<meta name="description" content="Learn Odoo ERP with AI-powered lessons covering all 9 modules.">`
- Add Open Graph tags for social sharing:
  ```html
  <meta property="og:title" content="Innovation Odoo AI" />
  <meta property="og:description" content="Master Odoo ERP through 81 AI-guided lessons." />
  <meta property="og:image" content="/og-cover.png" />
  ```
- Replace Vite default favicon with the Innovation Odoo AI brand icon (purple `O` logo)

### 1.2 Migrate AI from OpenAI → Anthropic
- Remove `openai` Python package dependency
- Install `anthropic` package
- Replace all three AI views (`GlobalAIView`, `PlanChatView`, `TutorChatView`) to use
  `anthropic.Anthropic()` client and `claude-sonnet-4-6` model
- Update `settings.py`: replace `OPENAI_API_KEY` with `ANTHROPIC_API_KEY`
- Update all `client.chat.completions.create(...)` calls to
  `client.messages.create(model="claude-sonnet-4-6", ...)`

### 1.3 Centralise Brand Color
- Add to `tailwind.config.js`:
  ```js
  theme: { extend: { colors: { brand: { DEFAULT: '#714B67', dark: '#5a3a52' } } } }
  ```
- Replace all `style={{ backgroundColor: '#714B67' }}` and `style={{ borderTopColor: '#714B67' }}`
  across all files with `className="bg-brand"` / `text-brand` / `border-brand`
- Define `--color-brand: #714B67` as CSS variable in `index.css`

### 1.4 Add Rate Limiting on AI Endpoints
- Install `djangorestframework` throttling
- Add to `settings.py`:
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.UserRateThrottle'],
      'DEFAULT_THROTTLE_RATES': { 'user': '60/hour' }
  }
  ```
- Apply stricter `AnonRateThrottle` (20/hour) on auth endpoints

---

## Phase 2 — Landing Page & Onboarding (Week 1–2)

### 2.1 Public Landing Page (`/`)
Remove the redirect-to-login default route and build a proper marketing page:

**Sections:**
- Hero: headline, sub-headline, CTA button ("Start Learning Free"), animated course preview screenshot
- Stats bar: "81 Lessons · 9 Sections · 57 Odoo Apps · AI-Powered"
- Section cards: visual grid of the 9 learning sections with icons and lesson counts
- How it works: 3-step flow (Register → Get a Study Plan → Learn with AI)
- Testimonials / social proof block (placeholder, fill with real data later)
- Footer: links to login, register, docs, contact

**Route:** `<Route path="/" element={<LandingPage />} />` (public, no auth required)

### 2.2 Post-Registration Onboarding Flow
After a new user registers and verifies OTP:
- Redirect to `/welcome` instead of `/dashboard`
- Show a 3-step welcome wizard:
  1. "Welcome! Tell us about yourself" (role selector: Developer / Accountant / Manager / Student / Other)
  2. "What's your Odoo experience?" (None / Some / Advanced)
  3. "What do you want to achieve?" (free text + suggested goals)
- On completion, trigger the AI study plan generation automatically
- Redirect to `/dashboard` with first lesson highlighted

---

## Phase 3 — Dashboard Improvements (Week 2)

### 3.1 Layout Upgrade
- Change max width from `max-w-3xl` to `max-w-5xl`
- Add a persistent left sidebar (240px) with:
  - User avatar + name + overall progress ring
  - Section list as nav items with completion counts
  - Quick links: My Plan, Settings, Help
- Main content area (right): lesson grid, stays scrollable

### 3.2 Search / Filter
- Add a search bar at the top of the lesson grid
- Real-time client-side filtering across all 81 lesson titles
- Filter chips for: "Not Started", "In Progress", "Completed", "Intro only"
- Keyboard shortcut: `Cmd/Ctrl + K` opens search modal

### 3.3 Milestone Notifications
- After completing each section: in-app toast + confetti animation
- At 25%, 50%, 75%, 100% overall progress: animated progress milestone card
- "Continue Learning" button always shows the exact next lesson

### 3.4 Completion Certificate
- When all 81 lessons are marked complete: show a `/certificate` page
- Certificate displays: user full name, course title, completion date, total hours
- Download as PDF (use `html2canvas` + `jsPDF`)
- Unique certificate ID generated server-side and stored on user model

---

## Phase 4 — Course Page Improvements (Week 2–3)

### 4.1 Lesson Table of Contents Sidebar
Inside `/course/:fileId`:
- Add a collapsible left panel listing all slides with titles
- Current slide highlighted in brand purple
- Click any slide to jump directly to it
- Shows a checkmark on slides the user has already passed

### 4.2 Skeleton Loading States
- Replace the single spinner with a proper skeleton screen:
  - Gray shimmer rectangle where the slide content will be
  - Shimmer lines for the breadcrumb
  - Shimmer for the progress bar and nav buttons
- Use CSS `@keyframes shimmer` animation

### 4.3 Error Boundaries
- Wrap `CoursePage` and `DashboardPage` in React error boundaries
- On API failure: show a retry button + friendly error message
- On 500: redirect to `/500` page (already exists)
- On 404 lesson ID: redirect to dashboard with toast "Lesson not found"

### 4.4 Keyboard Navigation
- Left/right arrow keys → previous/next slide
- `?` key → show keyboard shortcut modal
- `Escape` → exit lesson (with confirmation dialog)

---

## Phase 5 — Profile, Settings & Persistence (Week 3)

### 5.1 User Profile Page (`/profile`)
- Edit first name, last name, avatar (upload or choose from preset avatars)
- Change password (current password + new password + confirm)
- Notification preferences (email digest toggle)
- "Danger zone": delete account

### 5.2 AI Chat Persistence
- Store `GlobalAIChat` conversation history in the backend (new `AIConversation` model)
- Load last 10 messages on mount instead of starting fresh each time
- Add a "Clear conversation" button
- Timestamps on each message

### 5.3 Custom Font
- Import `Inter` from Google Fonts in `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  ```
- Apply in `index.css`: `body { font-family: 'Inter', system-ui, sans-serif; }`

---

## Phase 6 — Mobile Responsiveness (Week 3–4)

- Audit all pages on 375px, 414px, 768px viewport widths
- Fix `h-screen flex flex-col` on CoursePage collapsing on mobile
- AI tutor panel: on mobile, make it a bottom sheet instead of inline panel
- Dashboard sidebar: on mobile, hide behind a hamburger menu
- All buttons: minimum 44px touch target height

---

## Phase 7 — Email Notifications (Week 4)

- Integrate Django email backend (SMTP or SendGrid)
- Send welcome email after registration
- Weekly progress digest: "You completed X lessons this week"
- Section completion email: "🎉 You finished Section 3: Sales!"
- Certificate email with PDF attachment

---

## Data Models — New / Changed

### New: `UserProfile` (extends `User`)
```
avatar_url       CharField
role             CharField  (developer/accountant/manager/student/other)
experience       CharField  (none/some/advanced)
learning_goal    TextField
onboarding_done  BooleanField default=False
```

### New: `Certificate`
```
user             ForeignKey(User)
issued_at        DateTimeField
certificate_id   UUIDField unique
pdf_url          CharField
```

### New: `AIConversation`
```
user             ForeignKey(User)
messages         JSONField   (list of {role, content, timestamp})
updated_at       DateTimeField
```

### Changed: `LessonPlan`
- Add `plan_title` CharField (auto-generated summary name)
- Add `generated_at` DateTimeField

---

## Routes Summary

| Path                   | Auth  | Description                                  |
|------------------------|-------|----------------------------------------------|
| `/`                    | No    | Public landing page                          |
| `/register`            | No    | Registration                                 |
| `/login`               | No    | Login                                        |
| `/verify-otp`          | No    | OTP verification                             |
| `/forgot-password`     | No    | Password reset                               |
| `/welcome`             | Yes   | Onboarding wizard (new users only)           |
| `/dashboard`           | Yes   | Main dashboard with sidebar                  |
| `/course/:fileId`      | Yes   | Lesson player with ToC sidebar               |
| `/plan`                | Yes   | AI study plan chat + visual checklist        |
| `/profile`             | Yes   | User profile and settings                    |
| `/certificate`         | Yes   | Completion certificate (unlocked at 100%)    |
| `/500`                 | No    | Server error page                            |
| `*`                    | No    | 404 page                                     |

---

## Quality Checklist Before Launch

- [ ] `index.html` title is "Innovation Odoo AI"
- [ ] Favicon is brand icon (not Vite default)
- [ ] AI backend uses Anthropic, not OpenAI
- [ ] Brand color defined once in Tailwind config
- [ ] `/` route shows landing page, not login redirect
- [ ] All 3 AI endpoints have rate limiting
- [ ] Mobile tested at 375px, 414px, 768px
- [ ] Error boundaries on all protected pages
- [ ] Skeleton loading states on dashboard and course page
- [ ] Certificate page accessible after 100% completion
