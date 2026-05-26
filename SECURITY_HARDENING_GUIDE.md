# Security & Production Hardening Guide

This document outlines security measures and production hardening steps for the Prime Logic Tech platform.

## Security Measures Implemented

### 1. Authentication

- **Custom JWT Authentication**: Uses custom `AdminUser` model instead of Django's built-in User
- **Token Expiration**:
  - Access token: 8 hours
  - Refresh token: 7 days
- **Password Hashing**: Uses Django's secure password hashing (PBKDF2 with SHA256)
- **Role-Based Access Control (RBAC)**:
  - `admin`: Full access including user management
  - `editor`: Content management only
  - `viewer`: Read-only access

### 2. Password Requirements

Passwords must meet these criteria:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit

### 3. Input Validation

- Email format validation
- Username format validation (letters, numbers, underscores only)
- SQL injection protection (via Django ORM)
- XSS protection (React auto-escapes)

### 4. CORS

CORS is restricted to specific origins:
```
CORS_ALLOWED_ORIGINS=https://primelogictech.vercel.app,https://primelogitech.vercel.app
```

### 5. Security Headers

Frontend (Vercel) sets:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: origin-when-cross-origin`

Backend (Django) sets in production:
- `SECURE_SSL_REDIRECT=True`
- `SECURE_HSTS_SECONDS=31536000`
- `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
- `SESSION_COOKIE_SECURE=True`
- `CSRF_COOKIE_SECURE=True`

---

## Production Hardening Checklist

### Critical (Do This Before Launch)

- [ ] **Change default super admin password** (`raghav@3456`)
- [ ] **Set `DEBUG=False`** in environment variables
- [ ] **Generate new `SECRET_KEY`** (Render does this automatically)
- [ ] **Configure proper `ALLOWED_HOSTS`**
- [ ] **Set up SSL/HTTPS** (Render does this automatically)
- [ ] **Review CORS origins** - only include your production URLs

### Recommended

- [ ] **Enable rate limiting** (see below)
- [ ] **Set up monitoring** (Sentry, LogRocket, etc.)
- [ ] **Configure database backups**
- [ ] **Set up error tracking**
- [ ] **Review Cloudinary settings** for production
- [ ] **Disable Django admin** or protect it further

---

## Rate Limiting

### Option 1: Django REST Framework Throttling

Add to `backend/config/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',  # 100 requests per hour for anonymous
        'user': '1000/hour', # 1000 requests per hour for authenticated
    }
}
```

### Option 2: Render Rate Limiting

Render automatically provides basic DDoS protection on all services.

### Option 3: Cloudflare (Recommended for Production)

Set up Cloudflare in front of your application:
1. Add your domain to Cloudflare
2. Configure DNS to point to Vercel/Render
3. Enable Cloudflare's rate limiting rules
4. Enable Web Application Firewall (WAF)

Login endpoint rate limiting:
```
Path: /api/token/*
Rate: 20 requests per minute per IP
Action: Block for 10 minutes
```

---

## Monitoring & Logging

### Error Tracking with Sentry

1. Create a Sentry account at https://sentry.io
2. Install Sentry SDK:

```bash
pip install sentry-sdk
```

3. Add to `backend/config/settings.py`:

```python
import sentry_sdk

if not DEBUG:
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN'),
        traces_sample_rate=0.1,
    )
```

### Django Logging

Add to `backend/config/settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
        },
        'core': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
        },
    },
}
```

---

## Database Backups

### Render PostgreSQL

Render provides automatic daily backups for paid plans.

For free tier, you can manually backup:

```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup_20240101.sql
```

### Automated Backup Script

Create `backend/management/commands/backup_db.py`:

```python
from django.core.management.base import BaseCommand
from django.conf import settings
import os
from datetime import datetime

class Command(BaseCommand):
    help = 'Backup PostgreSQL database'

    def handle(self, *args, **options):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f'backup_{timestamp}.sql'
        os.system(f'pg_dump {settings.DATABASE_URL} > {backup_file}')
        self.stdout.write(self.style.SUCCESS(f'Backup created: {backup_file}'))
```

---

## Security Audit Checklist

Run these checks before going to production:

### Backend

```bash
# Check for outdated packages
pip list --outdated

# Run Django's security check
python manage.py check --deploy

# Check for sensitive data in git
git log --all --full-history -- "*.env"
git log --all --full-history -- "*secret*"
```

### Frontend

```bash
# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Environment Variables

Ensure these are set in Render (never in git):
- `SECRET_KEY`
- `SUPER_ADMIN_PASSWORD`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST_PASSWORD`
- `DATABASE_URL`

---

## Incident Response Plan

### If Account is Compromised

1. **Immediately change password** of compromised account
2. **Check for unauthorized admin users**
3. **Review recent activity logs**
4. **Revoke all tokens** by changing JWT secret:
   ```bash
   # In Render, generate new SECRET_KEY and redeploy
   ```
5. **Notify affected users** if any data was accessed

### If Database is Breached

1. **Take application offline** immediately
2. **Restore from clean backup**
3. **Change all passwords**
4. **Review access logs**
5. **Report breach** if legally required

---

## Additional Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [Render Security](https://render.com/docs/security)

---

## Contact

For security issues, contact: raghavap.339@gmail.com
