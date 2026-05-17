FROM python:3.12-slim

WORKDIR /app

# Ensure output is unbuffered
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000

# Collect static files (no-op if none)
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Start with gunicorn for production
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
