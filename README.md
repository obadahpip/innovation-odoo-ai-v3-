# Phase 4 — Course Page Improvements

Pure frontend — no backend changes, no new packages, no migration needed.

---

## Files included

| File in this zip                                          | Action       | Replace in project                                        |
|-----------------------------------------------------------|--------------|-----------------------------------------------------------|
| `frontend/src/pages/course/CoursePage.jsx`                | Replace      | `frontend/src/pages/course/CoursePage.jsx`                |
| `frontend/src/components/common/ErrorBoundary.jsx`        | **New file** | `frontend/src/components/common/ErrorBoundary.jsx`        |
| `frontend/src/App.jsx`                                    | Replace      | `frontend/src/App.jsx`                                    |

---

## What changed

### 4.1 — Table of Contents Sidebar
- Collapsible left panel (toggles with ‹ / › arrow button)
- Lists all slides with their titles
- Current slide highlighted in brand purple with ▶ indicator
- Slides the user has already passed show a ✓ checkmark
- Click any slide to jump directly to it
- Intro slides prefixed with 📖, conclusion slides with ✅
- Hidden on mobile (only visible md: and above)

### 4.2 — Skeleton Loading States
- Full skeleton replaces the old single spinner
- Shows shimmer placeholders for: breadcrumb, progress bar, ToC sidebar, slide content area, AI panel
- Uses `animate-pulse` (built into Tailwind — no extra packages)

### 4.3 — Error Boundaries
- New `ErrorBoundary.jsx` component (React class component)
- Wraps every protected page in `App.jsx` (Dashboard, Course, Plan, Welcome, Certificate)
- On crash: shows a "Try again" + "Back to Dashboard" screen
- In dev mode: also prints the raw error below the buttons
- On 404 lesson ID: redirects to dashboard with a toast instead of crashing

### 4.4 — Keyboard Navigation
- `→` / `←` arrow keys → next / previous slide
- `?` key → opens keyboard shortcut modal
- `Escape` → opens exit confirmation dialog (keeps progress safe)
- Keys are disabled when focus is inside an input or textarea (so AI chat still works)
- Shortcut hint shown in the nav bar between Prev/Next buttons

---

## No commands needed

Just copy the 3 files and reload. No `npm install`, no `migrate`.

---

## Quick checklist

- [ ] `CoursePage.jsx` replaced
- [ ] `ErrorBoundary.jsx` added to `src/components/common/`
- [ ] `App.jsx` replaced
- [ ] ToC sidebar appears on the left of the course page (collapsible)
- [ ] Arrow keys navigate slides
- [ ] `?` opens shortcut modal
- [ ] `Esc` opens exit confirmation dialog
- [ ] Skeleton shows while lesson loads (not a spinner)
- [ ] Crashing a page shows the error boundary UI (not a white screen)
