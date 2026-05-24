#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Prime Logic Tech — Render Entrypoint
# Runs at container START (not build) so the DB is available.
# ──────────────────────────────────────────────────────────────
set -o errexit
set -o pipefail

echo "→ Applying database migrations..."
python manage.py migrate --noinput

# ── Create / update superuser (only if ADMIN_USERNAME+ADMIN_PASSWORD are set) ──
if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "→ Ensuring superuser '${ADMIN_USERNAME}' exists with current password..."
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('ADMIN_USERNAME', 'admin')
email   = os.environ.get('ADMIN_EMAIL', 'admin@primelogitech.com')
password = os.environ.get('ADMIN_PASSWORD', '')
user, created = User.objects.get_or_create(username=username, defaults={
    'email': email,
    'is_staff': True,
    'is_superuser': True,
})
if created:
    user.set_password(password)
    user.email = email
    user.save()
    print(f'✓ Superuser \"{username}\" created')
else:
    user.set_password(password)
    user.email = email
    user.save()
    print(f'→ Superuser \"{username}\" password/email updated')
"
fi

echo "→ Starting Gunicorn (3 workers, :${PORT:-8000})..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 3 \
    --timeout 120 \
    --access-logfile '-' \
    --error-logfile '-'