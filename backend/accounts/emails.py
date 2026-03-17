from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings


# ── Shared HTML wrapper ───────────────────────────────────────────────────────

def _wrap(body_html: str) -> str:
    """Wrap email body in a consistent branded container."""
    return f"""
    <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:auto;
                background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#714B67,#5a3a52);padding:28px 32px;text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;
                      display:inline-flex;align-items:center;justify-content:center;
                      font-size:20px;font-weight:bold;color:white;">O</div>
          <span style="color:white;font-size:16px;font-weight:600;">Innovation Odoo AI</span>
        </div>
      </div>
      <!-- Body -->
      <div style="padding:32px;">
        {body_html}
      </div>
      <!-- Footer -->
      <div style="background:#f9fafb;padding:16px 32px;text-align:center;
                  border-top:1px solid #f3f4f6;">
        <p style="color:#9ca3af;font-size:11px;margin:0;">
          © Innovation Odoo AI &nbsp;·&nbsp;
          <a href="https://innovation-odoo-ai.com" style="color:#714B67;text-decoration:none;">
            innovation-odoo-ai.com
          </a>
        </p>
      </div>
    </div>
    """


def _send(to_email: str, subject: str, body_html: str, plain_text: str = ""):
    html = _wrap(body_html)
    msg  = EmailMultiAlternatives(subject, plain_text or subject, settings.DEFAULT_FROM_EMAIL, [to_email])
    msg.attach_alternative(html, "text/html")
    msg.send()


# ── OTP ───────────────────────────────────────────────────────────────────────

def send_otp_email(to_email, otp_code, purpose='registration'):
    subject = "Your Verification Code — Innovation Odoo AI"
    body = f"""
    <h2 style="color:#111827;margin:0 0 8px;">Verify your email</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
      Use the code below to verify your account. It expires in <strong>10 minutes</strong>.
    </p>
    <div style="background:#f5f0f4;border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
      <span style="font-size:44px;font-weight:800;color:#714B67;letter-spacing:10px;">{otp_code}</span>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:0;">Do not share this code with anyone.</p>
    """
    _send(to_email, subject, body, f"Your verification code: {otp_code}")


# ── Welcome ───────────────────────────────────────────────────────────────────

def send_welcome_email(to_email, first_name=''):
    name    = first_name or 'there'
    subject = "Welcome to Innovation Odoo AI! 🎉"
    body = f"""
    <h2 style="color:#111827;margin:0 0 8px;">Welcome, {name}! 👋</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">
      Your account is verified and ready. You now have access to
      <strong>81 AI-powered lessons</strong> across 9 Odoo modules.
    </p>
    <div style="background:#f5f0f4;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#374151;font-weight:600;">What's next:</p>
      <ul style="margin:0;padding-left:18px;color:#6b7280;font-size:13px;line-height:1.8;">
        <li>Tell us your role and goals in the welcome wizard</li>
        <li>Get a personalized AI study plan</li>
        <li>Start your first lesson with the AI tutor</li>
      </ul>
    </div>
    <div style="text-align:center;">
      <a href="https://innovation-odoo-ai.com/dashboard"
         style="background:#714B67;color:white;padding:14px 32px;border-radius:10px;
                text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
        Go to Dashboard →
      </a>
    </div>
    """
    _send(to_email, subject, body, f"Welcome {name}! Your Innovation Odoo AI account is ready.")


# ── Section completion ────────────────────────────────────────────────────────

def send_section_complete_email(to_email, first_name, section_number, section_name, total_completed, total_files):
    name    = first_name or 'there'
    pct     = round((total_completed / total_files) * 100) if total_files else 0
    subject = f"🎉 You completed Section {section_number}: {section_name}!"
    body = f"""
    <h2 style="color:#111827;margin:0 0 8px;">Section complete! 🎉</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">
      Great work, {name}! You've finished <strong>Section {section_number}: {section_name}</strong>.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">✅</div>
      <p style="font-size:16px;font-weight:700;color:#166534;margin:0 0 4px;">Section {section_number} Complete</p>
      <p style="font-size:13px;color:#15803d;margin:0;">{section_name}</p>
    </div>
    <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#374151;font-weight:600;">Overall progress</p>
      <div style="background:#e5e7eb;border-radius:999px;height:8px;overflow:hidden;">
        <div style="background:#714B67;height:100%;width:{pct}%;border-radius:999px;"></div>
      </div>
      <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">{total_completed} of {total_files} lessons complete ({pct}%)</p>
    </div>
    <div style="text-align:center;">
      <a href="https://innovation-odoo-ai.com/dashboard"
         style="background:#714B67;color:white;padding:14px 32px;border-radius:10px;
                text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
        Keep Learning →
      </a>
    </div>
    """
    _send(to_email, subject, body, f"You completed Section {section_number}: {section_name}! {pct}% overall.")


# ── Weekly progress digest ────────────────────────────────────────────────────

def send_weekly_digest_email(to_email, first_name, lessons_this_week, total_completed, total_files, streak_sections):
    name    = first_name or 'there'
    pct     = round((total_completed / total_files) * 100) if total_files else 0
    subject = "📊 Your weekly Odoo learning digest"

    if lessons_this_week == 0:
        activity_html = """
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin:0 0 20px;text-align:center;">
          <p style="font-size:14px;color:#92400e;margin:0;">No lessons completed this week. Jump back in — even one lesson a day adds up fast!</p>
        </div>
        """
    else:
        activity_html = f"""
        <div style="background:#f5f0f4;border-radius:12px;padding:20px;margin:0 0 20px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">📚</div>
          <p style="font-size:28px;font-weight:800;color:#714B67;margin:0;">{lessons_this_week}</p>
          <p style="font-size:13px;color:#6b7280;margin:4px 0 0;">lessons completed this week</p>
        </div>
        """

    streak_html = ""
    if streak_sections:
        items = "".join([f'<li style="color:#6b7280;font-size:13px;line-height:1.8;">{s}</li>' for s in streak_sections])
        streak_html = f"""
        <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 8px;">Sections in progress:</p>
        <ul style="margin:0 0 20px;padding-left:18px;">{items}</ul>
        """

    body = f"""
    <h2 style="color:#111827;margin:0 0 4px;">Your weekly digest, {name} 👋</h2>
    <p style="color:#9ca3af;font-size:13px;margin:0 0 24px;">Here's how your Odoo learning is going.</p>
    {activity_html}
    <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 20px;">
      <p style="margin:0 0 8px;font-size:13px;color:#374151;font-weight:600;">Overall progress</p>
      <div style="background:#e5e7eb;border-radius:999px;height:8px;overflow:hidden;">
        <div style="background:#714B67;height:100%;width:{pct}%;border-radius:999px;"></div>
      </div>
      <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">{total_completed} of {total_files} lessons ({pct}%)</p>
    </div>
    {streak_html}
    <div style="text-align:center;">
      <a href="https://innovation-odoo-ai.com/dashboard"
         style="background:#714B67;color:white;padding:14px 32px;border-radius:10px;
                text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
        Continue Learning →
      </a>
    </div>
    """
    _send(to_email, subject, body, f"You completed {lessons_this_week} lessons this week. Keep it up!")


# ── Certificate ───────────────────────────────────────────────────────────────

def send_certificate_email(to_email, first_name, certificate_id, issued_date):
    name    = first_name or 'there'
    subject = "🏆 Your Odoo Learning Certificate is ready!"
    body = f"""
    <h2 style="color:#111827;margin:0 0 8px;">Congratulations, {name}! 🏆</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
      You've completed <strong>all 81 lessons</strong> across 9 Odoo sections.
      Your certificate is now available.
    </p>
    <div style="background:linear-gradient(135deg,#f5f0f4,#ede4eb);border:2px solid #714B67;
                border-radius:16px;padding:28px;margin:0 0 24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🏆</div>
      <p style="font-size:18px;font-weight:700;color:#714B67;margin:0 0 4px;">Certificate of Completion</p>
      <p style="font-size:14px;color:#374151;margin:0 0 12px;">Odoo ERP Complete Learning Path</p>
      <p style="font-size:12px;color:#9ca3af;margin:0;">Issued: {issued_date} &nbsp;·&nbsp; ID: {str(certificate_id)[:16].upper()}</p>
    </div>
    <div style="text-align:center;">
      <a href="https://innovation-odoo-ai.com/certificate"
         style="background:#714B67;color:white;padding:14px 32px;border-radius:10px;
                text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
        View &amp; Download Certificate →
      </a>
    </div>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">
      You can also download the certificate PDF directly from your dashboard.
    </p>
    """
    _send(to_email, subject, body, f"Congratulations {name}! Your Odoo certificate is ready at innovation-odoo-ai.com/certificate")


# ── Legacy payment emails (kept for compatibility) ────────────────────────────

def send_payment_pending_email(to_email, method, amount):
    subject = "Payment Received — Pending Verification"
    body = f"""
    <h2 style="color:#111827;margin:0 0 8px;">Payment received ✅</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 16px;">
      We've received your <strong>{method}</strong> payment of <strong>{amount} JOD</strong>.
    </p>
    <p style="color:#6b7280;font-size:14px;margin:0;">
      Our team will verify it within <strong>24 hours</strong> and activate your learning plan.
      You'll receive a confirmation email as soon as it's approved.
    </p>
    """
    _send(to_email, subject, body, f"Payment of {amount} JOD received. Pending verification.")


def send_payment_approved_email(to_email):
    subject = "Your Payment is Confirmed — Start Learning!"
    body = """
    <h2 style="color:#111827;margin:0 0 8px;">You're all set! 🎉</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
      Your payment has been verified and your learning plan is now <strong>active</strong>.
    </p>
    <div style="text-align:center;">
      <a href="https://innovation-odoo-ai.com/dashboard"
         style="background:#714B67;color:white;padding:14px 32px;border-radius:10px;
                text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
        Go to Dashboard →
      </a>
    </div>
    """
    _send(to_email, subject, body, "Your payment is confirmed. Start learning now.")
