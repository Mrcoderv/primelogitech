# Project Structure — Prime Logic Tech

This document describes the repository layout, how to run the project locally, build commands, and deployment notes.

## Repository layout (top-level)

- `backend/` — Django backend (APIs, static mock data)
  - `manage.py` — Django CLI
  - `requirements.txt` — Python dependencies
  - `Dockerfile` — production image (gunicorn + whitenoise)
  - `config/` — Django project settings, wsgi/asgi, urls
  - `core/` — app with mock JSON data and API views (`core/data.py`, `core/views.py`, `core/urls.py`)
  - `db.sqlite3` — (present for dev, not required in prod)
  - `.venv/` — local virtualenv (not committed in general)

- `frontend/` — React + Vite site
  - `package.json` — JS dependencies and scripts
  - `vite.config.js` — Vite config
  - `src/` — React source
    - `pages/`, `components/`, `services/`, `utils/`
  - `public/`, `index.html`
  - `dist/` — built production assets (generated)

- `render.yaml` — Render service definitions (backend + frontend) for easier import
- `README.md` — repository overview and quick start
- `PROJECT_STRUCTURE.md` — this file

## Key files to edit

- Backend settings: `backend/config/settings.py`
- Backend Dockerfile: `backend/Dockerfile`
- Frontend API base URL: `frontend/src/services/api.js` (uses `VITE_API_URL`)
- Frontend contact endpoint: `frontend/src/pages/Contact.jsx` (Formspree is configured)

## Local development (quick)

1. Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

- Backend API base: `http://localhost:8000/api/`
- Endpoints (mock): `GET /api/services/`, `GET /api/projects/`, `GET /api/testimonials/`, `GET /api/team/`, `GET /api/jobs/`

2. Frontend (Vite)

```bash
cd frontend
npm install
# dev server
npm run dev -- --host 0.0.0.0
# build
npm run build
```

- Dev site: `http://localhost:5173` (default Vite port)
- To point frontend to local backend dev, set `VITE_API_URL=http://localhost:8000/api` (in your shell or `.env`)

## Docker / Production

- Backend Dockerfile builds a production image that runs `gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3` and uses WhiteNoise to serve static files.
- Frontend can be served as static site (Render static site or any CDN) or integrated into backend static files.

## Deployment notes

- Render: `render.yaml` includes two services (backend using Dockerfile, frontend static site). When importing, ensure the root/Dockerfile path matches (do not double-prefix `backend/backend`).
  - Option A: On Render, set Service root = `/` and Dockerfile path = `backend/Dockerfile`.
  - Option B: Set Service root = `backend` and Dockerfile path = `Dockerfile`.

- Vercel: If using the monorepo approach, ensure the build system installs Python deps from `backend/requirements.txt`. Pin `whitenoise==6.12.0` in `backend/requirements.txt` to avoid remote resolver issues.

## Environment variables (important)

- `SECRET_KEY` — Django secret key (set in Render/hosting)
- `DEBUG` — set to `False` in production
- `ALLOWED_HOSTS` — production hostnames or `*` for testing (not recommended)
- `VITE_API_URL` — frontend API base URL (e.g., `https://<backend>.onrender.com/api`)

## Remotes & branches

- Primary remote (origin): https://github.com/pralhadgyawali/Primelogitech.git (branch: `Rvbranch` used for development)
- Secondary remote (target): https://github.com/Mrcoderv/primelogitech.git (we push `Rvbranch:main` to update)

## Troubleshooting

- Vercel build resolver error: caused by an incompatible `whitenoise` requirement; pin to `whitenoise==6.12.0` in `backend/requirements.txt`.
- Render path error: set root and Dockerfile path consistently to avoid `backend/backend` missing path.
- If port 8000 is busy locally, find process via `ss -lptn | grep ':8000'` and stop it.

## Contacts / Maintainers

- Repo maintainers:
  - `Prasiddha Gyawali` — CEO / primary maintainer
  - `Pralhad Gyawali` — Co-Founder / contributor


## Quick checklist before production deploy

- [ ] Set `DEBUG=False` and configure `SECRET_KEY` via secure env var
- [ ] Set `ALLOWED_HOSTS` to production hostnames
- [ ] Configure persistent storage for media/static (if needed)
- [ ] Run frontend build and validate static assets
- [ ] Test API endpoints and contact form in staging

