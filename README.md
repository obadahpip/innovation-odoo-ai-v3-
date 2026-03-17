# Phase 1 — Drop-in Files (OpenAI kept as-is)

> Task 1.2 (AI migration) is skipped — OpenAI remains unchanged.

---

## Files included

| File in this zip                          | Replace in project                    |
|-------------------------------------------|---------------------------------------|
| `frontend/index.html`                     | `frontend/index.html`                 |
| `frontend/public/favicon.svg`             | `frontend/public/favicon.svg` *(new)* |
| `frontend/tailwind.config.js`             | `frontend/tailwind.config.js`         |
| `frontend/src/index.css`                  | `frontend/src/index.css`              |
| `backend/core/settings_phase1_patch.py`   | **Read and apply manually** (below)   |

---

## 1.1 — `index.html`
- Title: `"frontend"` → `"Innovation Odoo AI"`
- Added `<meta name="description">`
- Added Open Graph tags (`og:title`, `og:description`, `og:image`)
- Added Inter font via Google Fonts
- Favicon now points to `/favicon.svg`

## 1.2 — `public/favicon.svg` (new file)
Purple rounded square with white **O** — the brand icon.  
You can delete `public/vite.svg`.

## 1.3 — `tailwind.config.js` + `src/index.css`
Brand color is now defined **once**:
- Tailwind classes: `bg-brand`, `text-brand`, `border-brand`, `bg-brand-dark`
- CSS variable: `--color-brand: #714B67` (available for inline styles if needed)

**Remaining JSX work:** search your project for `#714B67` and `#5a3a52` and replace:
- `style={{ backgroundColor: '#714B67' }}` → `className="bg-brand"`
- `style={{ color: '#714B67' }}` → `className="text-brand"`
- `style={{ borderTopColor: '#714B67' }}` → `className="border-brand"`
- `const PURPLE = "#714B67"` in `CoursePage.jsx` → use `bg-brand` directly

## 1.4 — Rate limiting (`settings_phase1_patch.py`)
Open your `backend/core/settings.py` and replace the `REST_FRAMEWORK` dict
with the one in this patch file. It adds:
```python
'DEFAULT_THROTTLE_CLASSES': [...],
'DEFAULT_THROTTLE_RATES': { 'anon': '20/hour', 'user': '60/hour' }
```
No other changes to settings are needed.

---

## Quick checklist

- [ ] `frontend/index.html` replaced
- [ ] `frontend/public/favicon.svg` added, `vite.svg` deleted
- [ ] `frontend/tailwind.config.js` replaced
- [ ] `frontend/src/index.css` replaced
- [ ] `REST_FRAMEWORK` dict in `settings.py` updated with throttle config
- [ ] Project-wide find-replace of hardcoded `#714B67` hex in JSX files
