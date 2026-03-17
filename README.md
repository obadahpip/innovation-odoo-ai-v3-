# Phase 7 — Email Notifications

Backend only — no frontend changes, no new packages, no migration needed.

---

## Files included

| File in this zip                                                        | Action       | Replace / add in project                                                  |
|-------------------------------------------------------------------------|--------------|---------------------------------------------------------------------------|
| `backend/accounts/emails.py`                                            | Replace      | `backend/accounts/emails.py`                                              |
| `backend/progress/views.py`                                             | Replace      | `backend/progress/views.py`                                               |
| `backend/progress/management/__init__.py`                               | **New file** | `backend/progress/management/__init__.py`                                 |
| `backend/progress/management/commands/__init__.py`                      | **New file** | `backend/progress/management/commands/__init__.py`                        |
| `backend/progress/management/commands/send_weekly_digest.py`            | **New file** | `backend/progress/management/commands/send_weekly_digest.py`              |

---

## What changed

### accounts/emails.py — full rewrite
All emails now share a consistent branded HTML template (purple gradient header, white card, footer).
Functions added / updated:

| Function                    | Trigger                              | Status  |
|-----------------------------|--------------------------------------|---------|
| `send_otp_email`            | Registration / password reset        | Updated (styled) |
| `send_welcome_email`        | After OTP verification               | Updated (styled) |
| `send_section_complete_email` | When user finishes all lessons in a section | **New** |
| `send_weekly_digest_email`  | Called by management command         | **New** |
| `send_certificate_email`    | When certificate is generated        | **New** |
| `send_payment_*`            | Legacy payment flows                 | Updated (styled, kept) |

### progress/views.py — two additions

**Section completion email** (`ProgressUpdateView._check_section_complete`):
- Called every time a lesson is marked complete
- Checks if all lessons in that section are now done
- Uses Django cache to prevent duplicate emails (30-day TTL per user+section)
- Never crashes the API if email fails (`try/except` wrapped)

**Certificate email** (`CertificateView`):
- Sends on first certificate generation only (`created=True`)
- Includes certificate ID and issue date
- Links user to `/certificate` page to download PDF

### Weekly digest management command

Run manually or schedule it:

```bash
# Test without sending
python manage.py send_weekly_digest --dry-run

# Send to all verified users
python manage.py send_weekly_digest

# Send to a single user (for testing)
python manage.py send_weekly_digest --email you@example.com
```

**Schedule on Windows (Task Scheduler):**
- Program: `python`
- Arguments: `manage.py send_weekly_digest`
- Start in: `C:\path\to\backend`
- Trigger: Weekly, every Monday at 9:00 AM

**Schedule on Linux/Mac (cron):**
```
0 9 * * 1 cd /path/to/backend && python manage.py send_weekly_digest >> /var/log/digest.log 2>&1
```

---

## No migration needed

No new models — just new email functions and a management command.

---

## Quick checklist

- [ ] `accounts/emails.py` replaced
- [ ] `progress/views.py` replaced
- [ ] `progress/management/` folder created with both `__init__.py` files
- [ ] `send_weekly_digest.py` added
- [ ] Test: `python manage.py send_weekly_digest --dry-run` prints users without error
- [ ] Test: `python manage.py send_weekly_digest --email your@email.com` sends one email
- [ ] Complete a lesson in a full section → section complete email arrives
- [ ] Generate certificate at 100% → certificate email arrives
- [ ] `.env` has valid `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
