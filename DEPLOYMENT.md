# Deployment Guide — Prime Logic Tech

Complete guide for deploying **frontend on Vercel** and **backend on Render (free tier)**.

---

## 📦 Architecture Overview

```
User Browser
     │
     ▼
┌─────────────────────┐       HTTP /api/*        ┌──────────────────────┐       ORM       ┌──────────────────┐
│  Frontend (Vercel)  │ ──────────────────────▶ │  Backend (Render)   │ ─────────────▶ │  PostgreSQL      │
│                     │                         │                     │                │  (Render Free)   │
│  React 19 + Vite    │  Axios → DRF REST API   │  Django + Gunicorn  │  psycopg2       │  1 GB storage    │
│  Tailwind 4         │  JWT Auth               │  3 workers (256 MB) │                │                  │
└─────────────────────┘                         └──────────────────────┘                └──────────────────┘
                                                         │
                                                  ┌──────┴──────┐
                                                  │  Cloudinary  │  ← Media files (images)
                                                  │  Gmail SMTP  │  ← Contact form emails
                                                  └─────────────┘
```

---

## 🖥️ Backend Deployment (Render — Free Tier)

### Prerequisites

- GitHub repo pushed to **`Rvbranch`**
- Render account (sign up at [render.com](https://render.com))

### Step 1: Create a PostgreSQL Database

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:

   | Field | Value |
   |-------|-------|
   | **Name** | `primelogitech-db` |
   | **Plan** | **Free** ($0/month) |
   | **Region** | `Oregon (US West)` |

4. Click **Create Database**
5. Wait for it to be provisioned (~2-3 minutes)
6. **Copy the Internal Database URL** — you'll use this later.

> ⚠️ Render free PostgreSQL has **1 GB storage** and **256 MB RAM** — ample for this application.

### Step 2: Deploy the Backend Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repo → `Mrcoderv/primelogitech`
3. Branch: **`Rvbranch`**
4. Configure:

   | Field | Value |
   |-------|-------|
   | **Name** | `primelogitech-backend` |
   | **Environment** | `Docker` |
   | **Dockerfile Path** | `backend/Dockerfile` |
   | **Plan** | **Free** |

5. Click **Advanced** → **Add Environment Variables**

   | Key | Value |
   |-----|-------|
   | `DEBUG` | `False` |
   | `SECRET_KEY` | Click **Generate Value** |
   | `ALLOWED_HOSTS` | `.onrender.com,localhost` |
   | `CORS_ALLOWED_ORIGINS` | `https://primelogitech.vercel.app,http://localhost:3000` |
   | `PORT` | `8000` |
   | `PYTHON_VERSION` | `3.12` |

6. For `DATABASE_URL`: Click **Add from .env** → **Reference Secret** → pick `DATABASE_URL`

   > If using `render.yaml` (auto-deploy), the DB URL is linked automatically.

7. Click **Create Web Service**
8. Wait for build (~5–8 minutes on free tier)

### Step 3: Create Admin Superuser

After deployment, open the **Render Shell**:

```bash
python manage.py createsuperuser
```

Or via the Render Dashboard:
1. Go to your web service
2. **Shell** tab
3. Run `python manage.py createsuperuser`

> ⚠️ **Change the default password** for security:
> ```bash
> python manage.py changepassword raghav
> ```

### Step 4: Verify Backend

```bash
curl https://primelogitech-backend.onrender.com/api/site-content/
curl https://primelogitech-backend.onrender.com/api/projects/
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import `Mrcoderv/primelogitech`
4. Branch: **`Rvbranch`**
5. Framework Preset: **Vite**

### Step 2: Configure Build

| Setting | Value |
|---------|-------|
| **Root Directory** | `.` (project root) |
| **Build Command** | `cd frontend && npm ci && npm run build` |
| **Output Directory** | `frontend/dist` |

Alternatively, the root [`vercel.json`](./vercel.json) already configures these.

### Step 3: Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://primelogitech-backend.onrender.com` |

### Step 4: Deploy

Click **Deploy** (~2 minutes).

### Step 5: Wire Frontend → Backend

Go back to **Render** → **Environment Variables** and add your Vercel URL:

```
CORS_ALLOWED_ORIGINS=https://primelogitech.vercel.app,http://localhost:3000
```

---

## 🔐 Required Environment Variables

### Backend (Render)

| Variable | Description | Required |
|----------|-------------|----------|
| `DEBUG` | `False` for production | ✅ |
| `SECRET_KEY` | Django secret key | ✅ |
| `ALLOWED_HOSTS` | Comma-separated domains | ✅ |
| `CORS_ALLOWED_ORIGINS` | Frontend URL(s) for CORS | ✅ |
| `PORT` | `8000` | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ (auto by Render) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional |
| `EMAIL_HOST_USER` | Gmail address for SMTP | Optional |
| `EMAIL_HOST_PASSWORD` | Gmail app password | Optional |
| `ADMIN_EMAIL` | Where contact form emails go | Optional |

### Frontend (Vercel)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend URL (e.g., `https://primelogitech-backend.onrender.com`) | ✅ |

---

## 🔄 Auto-Deploy

Both Render and Vercel auto-deploy on every push to `Rvbranch`:

```bash
git add .
git commit -m "update"
git push origin Rvbranch
```

Render: Rebuilds Docker image → runs migrations → deploys
Vercel: Rebuilds frontend → deploys to CDN

---

## 🧪 Testing Checklist

- [ ] Backend API responds: `curl https://your-backend.onrender.com/api/site-content/`
- [ ] Frontend loads: `https://primelogitech.vercel.app`
- [ ] API calls in browser Network tab go to Render backend
- [ ] Admin login works: `https://primelogitech-backend.onrender.com/admin/`
- [ ] All pages load (Home, About, Services, Portfolio, Careers, Contact)
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works
- [ ] CORS errors are absent in browser console

---

## 🔒 Production Security

- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` generated (not default)
- [ ] Admin password changed from default
- [ ] `ALLOWED_HOSTS` restricted
- [ ] `CORS_ALLOWED_ORIGINS` only includes your Vercel URL
- [ ] Cloudinary credentials set (if using media uploads)
- [ ] Gmail SMTP app password configured (not regular password)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **502 Bad Gateway** | DB not ready; wait for PostgreSQL provisioning |
| **CORS error** | Add Vercel URL to `CORS_ALLOWED_ORIGINS` on Render |
| **401 Unauthorized** | JWT token expired; login again |
| **Admin login fails** | Run `createsuperuser` via Render Shell |
| **Static files 404** | Run `collectstatic` via Render Shell |

---

## 📊 Render Free Tier Limits

| Resource | Limit | Our Usage |
|----------|-------|-----------|
| RAM | 256 MB | ~80–120 MB |
| vCPU | 0.5 | Comfortable |
| Storage (DB) | 1 GB | <10 MB |
| Build hours | 500/mo | ~2–3 hrs |
| Idle sleep | 15 min inactivity | Wakes on request (takes ~30 sec) |

> ⚡ Free tier services **sleep after 15 minutes of inactivity**. The first request after a sleep takes ~30 seconds to wake up.

---

## 🚀 Quick Deploy (Using render.yaml)

The [`render.yaml`](./render.yaml) file in the repo root auto-configures everything:

1. Push to `Rvbranch` — Render detects `render.yaml`
2. Do **New +** → **Blueprint** → select repo
3. Everything is pre-configured: web service + PostgreSQL + env vars
