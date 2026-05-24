#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Prime Logic Tech — Render Entrypoint
# Runs at container START (not build) so the DB is available.
# ──────────────────────────────────────────────────────────────
set -o errexit
set -o pipefail

echo "→ Applying database migrations..."
python manage.py migrate --noinput

# ── Auto-create superuser (only if ADMIN_USERNAME+ADMIN_PASSWORD are set) ──
if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "→ Checking for existing superuser '${ADMIN_USERNAME}'..."
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('ADMIN_USERNAME', 'admin')
email   = os.environ.get('ADMIN_EMAIL', 'admin@primelogitech.com')
password = os.environ.get('ADMIN_PASSWORD', '')
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'✓ Superuser \"{username}\" created')
else:
    print(f'→ Superuser \"{username}\" already exists')
"
fi

echo "→ Starting Gunicorn (3 workers, :${PORT:-8000})..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 3 \
    --timeout 120 \
    --access-logfile '-' \
    --error-logfile '-'