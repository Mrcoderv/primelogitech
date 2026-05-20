# Deployment Guide - Prime Logic Tech

Complete guide for deploying frontend on **Vercel** and backend on **Render**.

---

## 🔧 Prerequisites

- GitHub repository with Rvbranch pushed
- Vercel account (vercel.com)
- Render account (render.com)

---

## 📦 Backend Deployment (Render)

### Step 1: Set up Render.com

1. Go to [render.com](https://render.com)
2. Sign in or create account
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect GitHub

1. Select **"Deploy an existing repository"**
2. Connect your GitHub account
3. Select repository: **Mrcoderv/primelogitech**
4. Branch: **Rvbranch**

### Step 3: Configure Service

| Field | Value |
|-------|-------|
| **Name** | `primelogitech-backend` |
| **Environment** | `Docker` |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Plan** | `Free` (or Paid for production) |

### Step 4: Set Environment Variables

Click **"Environment"** and add these variables:

```
DEBUG=False
SECRET_KEY=<generate-random-secret-key>
ALLOWED_HOSTS=<your-render-url>.onrender.com,localhost
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=<your-vercel-frontend-url>.vercel.app,http://localhost:3000
PORT=8000
```

**To generate SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Copy the deployed URL (e.g., `https://primelogitech-backend.onrender.com`)
4. Test API: Visit `https://your-backend-url/api/`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy via Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import GitHub repository: **Mrcoderv/primelogitech**
4. Framework Preset: **Vite**

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Build Command** | `cd frontend && npm ci && npm run build` |
| **Output Directory** | `frontend/dist` |
| **Root Directory** | `.` (root) |

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Example: `VITE_API_URL=https://primelogitech-backend.onrender.com`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Get Vercel URL (e.g., `https://primelogitech.vercel.app`)

### Step 5: Update Backend CORS

Go back to Render dashboard:
1. **primelogitech-backend** service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://primelogitech.vercel.app,http://localhost:3000
   ```
3. Click **"Save"** (service will redeploy)

---

## 🔄 Frontend Configuration

Update [frontend/src/services/api.js](../frontend/src/services/api.js):

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchProjects = async () => {
  const response = await fetch(`${API_URL}/api/projects/`);
  return response.json();
};

// All other API calls should use API_URL
```

---

## 📝 Using render.yaml

The `render.yaml` file automatically configures:

✅ Backend Docker deployment  
✅ Auto-deploy on push to Rvbranch  
✅ Database migrations on deploy  
✅ Static files collection  
✅ Health check endpoint  

**Render uses render.yaml automatically when detected in repo root.**

---

## 🧪 Testing Deployments

### Backend Tests

```bash
# Test API endpoint
curl https://your-backend-url.onrender.com/api/

# Test services
curl https://your-backend-url.onrender.com/api/services/

# Test projects
curl https://your-backend-url.onrender.com/api/projects/

# Test featured projects
curl https://your-backend-url.onrender.com/api/projects/featured/
```

### Frontend Tests

1. Visit `https://your-frontend-url.vercel.app`
2. Check Network tab - API calls should go to Render backend
3. Verify all pages load and data displays

---

## 📊 Admin Access

Access Django admin:
```
https://your-backend-url.onrender.com/admin/
Username: raghav
Password: raghav@3345
```

**⚠️ SECURITY WARNING**: Change admin password in production!

```bash
# SSH into Render service
# Or use Django shell in Render logs
python manage.py changepassword raghav
```

---

## 🔐 Production Security Checklist

### Backend (Render)

- [ ] Set `DEBUG=False`
- [ ] Generate new `SECRET_KEY` (don't use development key)
- [ ] Set `ALLOWED_HOSTS` to your domain only
- [ ] Enable `SECURE_SSL_REDIRECT=True`
- [ ] Change admin password
- [ ] Use environment variables for sensitive data
- [ ] Enable GitHub 2FA and branch protection

### Frontend (Vercel)

- [ ] Set `VITE_API_URL` to production backend
- [ ] Build optimization enabled
- [ ] Analytics enabled (optional)
- [ ] Preview deployments configured

---

## 🚀 Automated Deployments

### Auto-Deploy on Git Push

Both services auto-deploy when you push to **Rvbranch**:

```bash
# Make changes locally
git add .
git commit -m "Feature: add new project"
git push origin Rvbranch

# Automatic deployment starts:
# 1. Render detects changes
# 2. Backend rebuilds Docker image
# 3. Vercel detects changes
# 4. Frontend rebuilds and deploys
```

---

## 📱 Environment Variables Summary

### Backend (.env on Render)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DEBUG` | Development mode | `False` |
| `SECRET_KEY` | Django security | Django secret string |
| `ALLOWED_HOSTS` | Allowed domains | `yourdomain.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Frontend origin | `https://yourdomain.vercel.app` |
| `PORT` | Server port | `8000` |

### Frontend (Vercel Build Env)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `https://yourapi.onrender.com` |

---

## 🆘 Troubleshooting

### Backend Won't Deploy (Render)

1. Check build logs: Render Dashboard → Logs
2. Verify Docker build succeeds locally:
   ```bash
   cd backend && docker build -t primelogitech .
   ```
3. Check `requirements.txt` for missing dependencies
4. Verify `SECRET_KEY` environment variable set

### Frontend API Errors

1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend `CORS_ALLOWED_ORIGINS` includes frontend URL
3. Check browser console for CORS errors
4. Test backend API directly: `curl <backend-url>/api/`

### Database Issues

- Reset database on Render: Delete SQLite, redeploy
- Migration fails: Check logs for SQL errors
- Data missing: Verify migrations ran (see Render logs)

---

## 📞 Support Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment](https://docs.djangoproject.com/en/6.0/howto/deployment/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured for both domains
- [ ] API calls working in frontend
- [ ] Admin panel accessible
- [ ] Database migrations completed
- [ ] All pages loading without errors
- [ ] Static files serving correctly
- [ ] Auto-deploy from GitHub working
