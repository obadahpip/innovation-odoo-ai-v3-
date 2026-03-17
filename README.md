# Phase 5 — Profile, Settings & AI Chat Persistence

---

## Files included

| File in this zip                                        | Action       | Replace in project                                      |
|---------------------------------------------------------|--------------|---------------------------------------------------------|
| `frontend/src/pages/profile/ProfilePage.jsx`            | **New file** | `frontend/src/pages/profile/ProfilePage.jsx`            |
| `frontend/src/components/common/GlobalAIChat.jsx`       | Replace      | `frontend/src/components/common/GlobalAIChat.jsx`       |
| `frontend/src/App.jsx`                                  | Replace      | `frontend/src/App.jsx`                                  |
| `backend/content/models.py`                             | Replace      | `backend/content/models.py`                             |
| `backend/content/migrations/0003_aiconversation.py`     | **New file** | `backend/content/migrations/`                           |
| `backend/content/views.py`                              | Replace      | `backend/content/views.py`                              |
| `backend/content/urls.py`                               | Replace      | `backend/content/urls.py`                               |
| `backend/accounts/views.py`                             | Replace      | `backend/accounts/views.py`                             |
| `backend/accounts/urls.py`                              | Replace      | `backend/accounts/urls.py`                              |

---

## What changed

### 5.1 — Profile Page (`/profile`)
- Edit first name, last name, job title, company
- Emoji avatar picker (12 options)
- Change password (current + new + confirm, with show/hide toggle)
- Danger zone: type DELETE to permanently delete account
- Accessible from the Dashboard sidebar quick links

### 5.2 — AI Chat Persistence
- Chat history is saved to backend after each reply (last 20 messages)
- On next open, last 10 messages are loaded automatically
- Timestamps shown under each message
- "Clear" button in the chat header wipes history server-side

### Backend additions
- `AIConversation` model (one-per-user, stores messages as JSON)
- `GET  /api/content/ai/history/`       — fetch last 10 messages
- `POST /api/content/ai/history/save/`  — save up to 20 messages
- `POST /api/content/ai/history/clear/` — clear all messages
- `POST /api/auth/change-password/`     — change password (requires current password)
- `DELETE /api/auth/delete-account/`    — permanently delete account

---

## After applying files

```bash
cd backend
python manage.py migrate
```

No new frontend packages needed.

---

## Add profile link to Dashboard sidebar
In `DashboardPage.jsx`, inside the sidebar quick links section, add:

```jsx
<button onClick={() => navigate("/profile")}
  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition">
  <span>👤</span> Profile
</button>
```

---

## Quick checklist

- [ ] All 9 files copied to correct paths
- [ ] `python manage.py migrate` run
- [ ] `/profile` page loads and saves changes
- [ ] Password change works (wrong current password shows error)
- [ ] Delete account works (redirects to `/` after deletion)
- [ ] AI chat loads previous messages on reopen
- [ ] Timestamps visible under each message
- [ ] Clear button resets the conversation
