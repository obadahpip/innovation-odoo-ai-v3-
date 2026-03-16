from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives


from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_otp_email(to_email, otp_code):
    subject = "Your OTP Verification Code"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px;">
      <div style="background:#714B67;padding:20px;border-radius:8px;text-align:center;margin-bottom:24px;">
        <h1 style="color:white;margin:0;font-size:22px;">Verify Your Email</h1>
      </div>
      <p style="color:#333;font-size:15px;">Use the code below to verify your account:</p>
      <div style="background:#f5f0f4;border-radius:8px;padding:24px;text-align:center;margin:20px 0;">
        <span style="font-size:40px;font-weight:bold;color:#714B67;letter-spacing:8px;">{otp_code}</span>
      </div>
      <p style="color:#666;font-size:13px;">This code expires in 10 minutes. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">innovation-odoo-ai.com</p>
    </div>
    """
    msg = EmailMultiAlternatives(subject, otp_code, settings.DEFAULT_FROM_EMAIL, [to_email])
    msg.attach_alternative(html, "text/html")
    msg.send()


def send_payment_pending_email(to_email, method, amount):
    subject = "Payment Received — Pending Verification"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px;">
      <div style="background:#714B67;padding:20px;border-radius:8px;text-align:center;margin-bottom:24px;">
        <h1 style="color:white;margin:0;font-size:22px;">Payment Received</h1>
      </div>
      <p style="color:#333;font-size:15px;">We've received your <strong>{method}</strong> payment of <strong>{amount} JOD</strong>.</p>
      <p style="color:#333;font-size:15px;">Our team will verify it within <strong>24 hours</strong> and activate your learning plan.</p>
      <p style="color:#666;font-size:13px;">You'll receive a confirmation email as soon as it's approved.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">innovation-odoo-ai.com</p>
    </div>
    """
    msg = EmailMultiAlternatives(subject, f"Payment of {amount} JOD received.", settings.DEFAULT_FROM_EMAIL, [to_email])
    msg.attach_alternative(html, "text/html")
    msg.send()


def send_payment_approved_email(to_email):
    subject = "Your Payment is Confirmed — Start Learning!"
    html = """
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px;">
      <div style="background:#714B67;padding:20px;border-radius:8px;text-align:center;margin-bottom:24px;">
        <h1 style="color:white;margin:0;font-size:22px;">You're All Set! 🎉</h1>
      </div>
      <p style="color:#333;font-size:15px;">Your payment has been verified and your learning plan is now <strong>active</strong>.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="https://innovation-odoo-ai.com/dashboard"
           style="background:#714B67;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
          Go to Dashboard
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">innovation-odoo-ai.com</p>
    </div>
    """
    msg = EmailMultiAlternatives(subject, "Your payment is confirmed.", settings.DEFAULT_FROM_EMAIL, [to_email])
    msg.attach_alternative(html, "text/html")
    msg.send()

def send_welcome_email(user_email, first_name=''):
    name = first_name or 'there'
    send_mail(
        subject='Welcome to Innovation Odoo AI!',
        message=f"""
Hi {name},

Your account is verified and ready to go!

Start your personalized Odoo learning journey at: https://innovation-odoo-ai.com

Best regards,
The Innovation Odoo AI Team
        """.strip(),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=True,
    )
