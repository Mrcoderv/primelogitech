from django.conf import settings
from django.core.mail import get_connection, send_mail

from .models import SMTPSetting


def _as_int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def get_smtp_config():
    host = SMTPSetting.get_value("SMTP_HOST", settings.EMAIL_HOST)
    port = _as_int(SMTPSetting.get_value("SMTP_PORT", settings.EMAIL_PORT), settings.EMAIL_PORT)
    user = SMTPSetting.get_value("SMTP_USER", settings.EMAIL_HOST_USER)
    password = SMTPSetting.get_value("SMTP_PASS", settings.EMAIL_HOST_PASSWORD)

    return {
        "host": host or settings.EMAIL_HOST,
        "port": port,
        "username": user or settings.EMAIL_HOST_USER,
        "password": password or settings.EMAIL_HOST_PASSWORD,
        "use_tls": settings.EMAIL_USE_TLS,
    }


def send_smtp_email(subject, message, recipient_list):
    smtp_config = get_smtp_config()
    connection = get_connection(
        backend="django.core.mail.backends.smtp.EmailBackend",
        host=smtp_config["host"],
        port=smtp_config["port"],
        username=smtp_config["username"],
        password=smtp_config["password"],
        use_tls=smtp_config["use_tls"],
    )
    from_email = smtp_config["username"] or settings.EMAIL_HOST_USER
    return send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list,
        fail_silently=False,
        connection=connection,
    )
