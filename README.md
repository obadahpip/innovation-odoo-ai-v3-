# Phase 3 — Dashboard Improvements

---

## Files included

| File in this zip                                        | Action       | Replace in project                                      |
|---------------------------------------------------------|--------------|---------------------------------------------------------|
| `frontend/src/pages/dashboard/DashboardPage.jsx`        | Replace      | `frontend/src/pages/dashboard/DashboardPage.jsx`        |
| `frontend/src/pages/certificate/CertificatePage.jsx`    | **New file** | `frontend/src/pages/certificate/CertificatePage.jsx`    |
| `frontend/src/App.jsx`                                  | Replace      | `frontend/src/App.jsx`                                  |
| `backend/progress/models.py`                            | Replace      | `backend/progress/models.py`                            |
| `backend/progress/migrations/0002_certificate.py`       | **New file** | `backend/progress/migrations/`                          |
| `backend/progress/views.py`                             | Replace      | `backend/progress/views.py`                             |
| `backend/progress/urls.py`                              | Replace      | `backend/progress/urls.py`                              |

---

## What changed

### 3.1 Dashboard Layout Upgrade
- Widened to `max-w-4xl`
- Persistent left sidebar (240px) with:
  - User avatar + overall progress ring + lesson count
  - All 9 sections as nav items with icons, completion counts, green ✓ when done
  - Quick links: My Plan, My Certificate (visible at 100%)
- On mobile: sidebar hidden behind hamburger menu

### 3.2 Search & Filter
- Search bar with real-time filtering across all 81 lesson titles
- `Ctrl/Cmd + K` focuses the search bar
- Filter chips: All / Not Started / In Progress / Completed / Intro Only
- "No results" empty state with a clear-filters button

### 3.3 Milestone Notifications
- Section completion: toast fires once per session when a section hits 100%
- Progress milestones (25%, 50%, 75%, 100%): animated banner card with dismiss button
- Confetti animation fires on section completion and milestones
- Skeleton loading state while dashboard data loads

### 3.4 Completion Certificate (`/certificate`)
- Locked behind server-side 100% completion check
- Displays: full name, course title, issue date, total hours, certificate ID
- Download as PDF using `html2canvas` + `jsPDF` (loaded lazily — no bundle cost unless used)
- Certificate ID is a UUID generated server-side, stored in the `Certificate` model
- Link shown on dashboard header and sidebar at 100% progress

---

## Install new frontend packages

```bash
cd frontend
npm install html2canvas jspdf
```

## Run migration

```bash
cd backend
python manage.py migrate
```

---

## Quick checklist

- [ ] All 7 files copied to correct paths
- [ ] `npm install html2canvas jspdf` run in `frontend/`
- [ ] `python manage.py migrate` run in `backend/`
- [ ] Dashboard shows sidebar and search bar
- [ ] Ctrl+K focuses search
- [ ] Filter chips work
- [ ] `/certificate` redirects away if progress < 100%
- [ ] PDF download works at 100% completion
