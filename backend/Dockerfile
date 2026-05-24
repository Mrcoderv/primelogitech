# ──────────────────────────────────────────────────────────
# Prime Logic Tech — Backend Dockerfile
# Target: Render.com free tier (256 MB RAM, 0.5 vCPU)
# ──────────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

ENV \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install system deps needed by psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files at build time (WhiteNoise serves them)
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Use start.sh so migrations run at container START (not build)
# This ensures the PostgreSQL/SQLite DB is available
CMD ["./start.sh"]
