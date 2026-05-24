#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Prime Logic Tech — Render Entrypoint
# Runs at container START (not build) so the DB is available.
# ──────────────────────────────────────────────────────────────
set -o errexit
set -o pipefail

echo "→ Applying database migrations..."
python manage.py migrate --noinput

echo "→ Starting Gunicorn (3 workers, :${PORT:-8000})..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 3 \
    --timeout 120 \
    --access-logfile '-' \
    --error-logfile '-'