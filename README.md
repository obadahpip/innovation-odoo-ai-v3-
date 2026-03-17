# Phase 2 — Landing Page & Onboarding

---

## Files included

| File in this zip                                            | Action            | Replace in project                                    |
|-------------------------------------------------------------|-------------------|-------------------------------------------------------|
| `frontend/src/pages/LandingPage.jsx`                        | **New file**      | `frontend/src/pages/LandingPage.jsx`                  |
| `frontend/src/pages/onboarding/WelcomePage.jsx`             | **New file**      | `frontend/src/pages/onboarding/WelcomePage.jsx`       |
| `frontend/src/App.jsx`                                      | Replace           | `frontend/src/App.jsx`                                |
| `frontend/src/pages/auth/VerifyOtpPage.jsx`                 | Replace           | `frontend/src/pages/auth/VerifyOtpPage.jsx`           |
| `backend/accounts/models.py`                                | Replace           | `backend/accounts/models.py`                          |
| `backend/accounts/migrations/0002_user_onboarding_fields.py`| **New file**      | `backend/accounts/migrations/`                        |
| `backend/accounts/serializers.py`                           | Replace           | `backend/accounts/serializers.py`                     |
| `backend/accounts/views.py`                                 | Replace           | `backend/accounts/views.py`                           |
| `backend/accounts/urls.py`                                  | Replace           | `backend/accounts/urls.py`                            |

---

## What changed

### 2.1 — Public Landing Page (`/`)

- `App.jsx` — the `/` route now renders `<LandingPage />` instead of redirecting to `/login`
- `LandingPage.jsx` — full marketing page with:
  - Sticky nav with Sign in / Get started buttons
  - Hero section (gradient, headline, CTAs)
  - Stats bar (81 Lessons · 9 Sections · 57 Odoo Apps · AI-Powered)
  - 9 section cards with icons, lesson counts, and descriptions
  - How it works (3-step flow)
  - Testimonials (3 placeholders — replace with real ones later)
  - CTA banner
  - Footer

### 2.2 — Post-Registration Onboarding Flow

- `VerifyOtpPage.jsx` — after successful OTP verification, redirects to `/welcome` (was `/dashboard`)
- `WelcomePage.jsx` — 3-step wizard:
  1. Role selector (Developer / Accountant / Manager / Student / Other)
  2. Odoo experience (None / Some / Advanced)
  3. Learning goal (free text + 6 quick-pick suggestions)
  On completion → `POST /api/auth/onboarding/` → redirect to `/dashboard`
- `App.jsx` — `/welcome` route added (protected)

### Backend

- `models.py` — 4 new fields on `User`: `role`, `experience`, `learning_goal`, `onboarding_done`
- `migrations/0002_...` — Django migration for the new fields
- `serializers.py` — `OnboardingSerializer` added; `UserProfileSerializer` now exposes onboarding fields
- `views.py` — `onboarding()` view added (`POST /api/auth/onboarding/`)
- `urls.py` — `/onboarding/` path added

---

## After applying files

Run the migration:
```bash
cd backend
python manage.py migrate
```

That's it — no new packages required.

---

## Quick checklist

- [ ] All 9 files copied to correct paths
- [ ] `python manage.py migrate` run successfully
- [ ] `GET /` shows the landing page (not a login redirect)
- [ ] Registering a new account → OTP verify → lands on `/welcome` wizard
- [ ] Completing wizard → lands on `/dashboard`
- [ ] Existing users logging in → still go straight to `/dashboard`
