# 🚀 Deployment Quick Start

## Files Created/Updated

✅ **render.yaml** - Backend deployment configuration  
✅ **vercel.json** - Frontend deployment configuration  
✅ **backend/.env.example** - Environment variables template  
✅ **DEPLOYMENT.md** - Complete deployment guide  

---

## 📋 Quick Deployment Steps

### 1️⃣ Backend (Render)

```bash
# 1. Go to render.com → New Web Service
# 2. Connect GitHub: Mrcoderv/primelogitech (Rvbranch)
# 3. Set environment variables:

DEBUG=False
SECRET_KEY=generate-new-key-here
ALLOWED_HOSTS=your-backend-url.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Time:** 5-10 minutes

### 2️⃣ Frontend (Vercel)

```bash
# 1. Go to vercel.com → New Project
# 2. Import GitHub: Mrcoderv/primelogitech (Rvbranch)
# 3. Framework: Vite
# 4. Set environment variable:

VITE_API_URL=https://your-backend-url.onrender.com
```

**Time:** 2-3 minutes

### 3️⃣ Connect Backend & Frontend

```bash
# Update backend CORS to include Vercel frontend URL
# Go to Render → primelogitech-backend → Environment
# Update CORS_ALLOWED_ORIGINS with Vercel URL
```

---

## 🔗 After Deployment

**Backend URL:** `https://primelogitech-backend.onrender.com`  
**Frontend URL:** `https://primelogitech.vercel.app`  
**Admin Panel:** `https://primelogitech-backend.onrender.com/admin/`

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         User Browser                     │
└──────────────┬──────────────────────────┘
               │
               ├─────────────────────────────────────────┐
               │                                         │
               ▼                                         ▼
    ┌──────────────────────┐         ┌─────────────────────────┐
    │  Frontend (Vercel)   │         │  Backend (Render)       │
    │                      │         │                         │
    │ • React + Vite       │────────▶│ • Django REST API       │
    │ • Static Site        │         │ • SQLite Database       │
    │ • Environment        │         │ • Admin Panel           │
    │   VITE_API_URL       │         │ • Environment Config    │
    └──────────────────────┘         └─────────────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │ Database        │
                                     │ (db.sqlite3)    │
                                     │ Persistent      │
                                     └─────────────────┘
```

---

## ✨ Features Included

✅ Auto-deploy from GitHub  
✅ Environment-based configuration  
✅ Database migrations on deploy  
✅ Static file optimization  
✅ CORS configured  
✅ Docker containerization  
✅ Production-ready settings  

---

## 🔐 Security Setup

1. **Generate SECRET_KEY:**
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

2. **Change Admin Password:**
   ```bash
   # In Render console
   python manage.py changepassword raghav
   ```

3. **Update ALLOWED_HOSTS** with your Render domain

4. **Update CORS_ALLOWED_ORIGINS** with your Vercel domain

---

## 🧪 Test After Deployment

```bash
# Test backend
curl https://your-backend.onrender.com/api/

# Test frontend
Open https://your-frontend.vercel.app in browser

# Check API calls
Open DevTools → Network tab → verify API calls successful
```

---

## 📖 Full Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions, troubleshooting, and security checklist.

---

## 🎯 What's Different

| Aspect | Local | Production |
|--------|-------|------------|
| **Frontend** | http://localhost:5173 | https://*.vercel.app |
| **Backend** | http://localhost:8000 | https://*.onrender.com |
| **API URL** | http://localhost:8000/api | https://your-backend.onrender.com/api |
| **Debug Mode** | True | False |
| **CORS** | All origins | Specific domains |
| **Database** | SQLite local | SQLite on Render |
| **Admin** | Built-in Django | Built-in Django (accessible) |

---

Ready to deploy? Start with **Backend on Render**, then **Frontend on Vercel**! 🚀
