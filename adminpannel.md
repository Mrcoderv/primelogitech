Here's the complete final phase prompt — broken into numbered parts so you can feed them one by one to an AI coding assistant:

---

# PRIME LOGIC TECH — FINAL PHASE MASTER PROMPT

## CONTEXT (read first, don't code yet)

I have a full-stack web app:

* **Frontend** : React 19 + Vite + Tailwind CSS v4 + Framer Motion → deployed on **Vercel** at `https://primelogictech.vercel.app`
* **Backend** : Django 6 + Django REST Framework → deployed on **Render** at `https://primelogictech-backend.onrender.com`
* **Database** : PostgreSQL on Render
* **Image storage** : Cloudinary

Public pages: `/` `/about` `/services` `/portfolio` `/careers` `/contact`

Admin panel lives at `/secret-admin` —  **no link to it anywhere on the public site** . Only staff know the URL.

---

# PROMPT 1 — Backend: packages + settings

**Do this first. Do not touch models or views yet.**

Install these packages and add to `requirements.txt`:

```
django
djangorestframework
django-cors-headers
djangorestframework-simplejwt
gunicorn
whitenoise
psycopg2-binary
dj-database-url
python-dotenv
cloudinary
django-cloudinary-storage
Pillow
```

Then replace `config/settings.py` with this exact content:

```python
import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.onrender.com',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS
CORS_ALLOWED_ORIGINS = [
    "https://primelogictech.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True

# JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# Cloudinary
import cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
)
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '')
```

Also create `backend/build.sh`:

```bash
#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

Run `chmod +x build.sh`.

**Stop here. Confirm settings work locally with `python manage.py check`. Then move to Prompt 2.**

---

# PROMPT 2 — Backend: all models

**Only edit `core/models.py`. Do not touch views or urls yet.**

Replace `core/models.py` entirely with:

```python
from django.db import models


class SiteContent(models.Model):
    # Hero
    hero_badge       = models.CharField(max_length=100, default="Prime Logic Tech is now live")
    hero_heading     = models.TextField(default="Design. Develop. Deliver.")
    hero_subtitle    = models.TextField(default="We build modern web and mobile solutions for forward-thinking businesses.")
    hero_cta_primary = models.CharField(max_length=80, default="Start a Project")
    hero_cta_secondary = models.CharField(max_length=80, default="View Our Work")

    # Trusted by logos — list of {"name": "ACME", "image_url": "https://..."}
    trusted_by_logos = models.JSONField(default=list)

    # Why Partner section
    why_title       = models.CharField(max_length=200, default="Why Partner With Us")
    why_description = models.TextField(default="")
    why_checklist   = models.JSONField(default=list)

    # Stats
    stat_projects   = models.CharField(max_length=50, default="150+")
    stat_clients    = models.CharField(max_length=50, default="98%")
    stat_team       = models.CharField(max_length=50, default="45+")
    stat_experience = models.CharField(max_length=50, default="10+")

    # About page
    about_mission = models.TextField(default="")
    about_vision  = models.TextField(default="")

    # CTA section
    cta_heading     = models.CharField(max_length=200, default="Ready to Build Something Great?")
    cta_subtitle    = models.TextField(default="")
    cta_button_text = models.CharField(max_length=80, default="Start a Project")

    # Contact info
    contact_email   = models.EmailField(default="hello@primelogictech.com")
    contact_phone   = models.CharField(max_length=30, default="+1 (555) 123-4567")
    contact_address = models.CharField(max_length=200, default="Kathmandu, Nepal")

    # Footer
    footer_tagline = models.CharField(max_length=300, default="")

    class Meta:
        verbose_name = "Site Content"

    def __str__(self):
        return "Site Content"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Project(models.Model):
    title       = models.CharField(max_length=200)
    category    = models.CharField(max_length=100)
    description = models.TextField()
    image       = models.ImageField(upload_to='projects/', blank=True, null=True)
    image_url   = models.URLField(blank=True)
    tech_stack  = models.JSONField(default=list)
    live_url    = models.URLField(blank=True)
    github_url  = models.URLField(blank=True)
    pinned      = models.BooleanField(default=False)
    order       = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pinned', 'order', '-created_at']

    def __str__(self):
        return self.title


class TeamMember(models.Model):
    name         = models.CharField(max_length=100)
    role         = models.CharField(max_length=100)
    bio          = models.TextField(blank=True)
    image        = models.ImageField(upload_to='team/', blank=True, null=True)
    image_url    = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url   = models.URLField(blank=True)
    twitter_url  = models.URLField(blank=True)
    order        = models.IntegerField(default=0)
    is_active    = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Service(models.Model):
    title       = models.CharField(max_length=150)
    description = models.TextField()
    icon        = models.CharField(max_length=50, default="Code")
    order       = models.IntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name       = models.CharField(max_length=100)
    role       = models.CharField(max_length=100)
    company    = models.CharField(max_length=100, blank=True)
    quote      = models.TextField()
    avatar_url = models.URLField(blank=True)
    order      = models.IntegerField(default=0)
    is_active  = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} — {self.company}"


class Job(models.Model):
    TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
    ]
    title       = models.CharField(max_length=200)
    department  = models.CharField(max_length=100, blank=True)
    location    = models.CharField(max_length=100, default="Remote")
    job_type    = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full-time')
    description = models.TextField()
    requirements = models.JSONField(default=list)
    is_open     = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name       = models.CharField(max_length=100)
    email      = models.EmailField()
    subject    = models.CharField(max_length=200)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"


class NewsletterSubscriber(models.Model):
    email         = models.EmailField(unique=True)
    is_active     = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email
```

Then run:

```bash
python manage.py makemigrations
python manage.py migrate
```

**Stop here. Confirm migrations ran cleanly. Then move to Prompt 3.**

---

# PROMPT 3 — Backend: serializers + views + urls

**Edit `core/serializers.py`, `core/views.py`, and `config/urls.py`.**

**`core/serializers.py`:**

```python
from rest_framework import serializers
from .models import (
    SiteContent, Project, TeamMember, Service,
    Testimonial, Job, ContactMessage, NewsletterSubscriber
)

class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
```

**`core/views.py`:**

```python
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from .serializers import *


# ── PUBLIC ────────────────────────────────────────────────────

class SiteContentView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response(SiteContentSerializer(SiteContent.load()).data)

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class TeamListView(generics.ListAPIView):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

class JobListView(generics.ListAPIView):
    queryset = Job.objects.filter(is_open=True)
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

class ContactCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = ContactMessageSerializer(data=request.data)
        if s.is_valid():
            msg = s.save()
            try:
                send_mail(
                    subject=f"[PLT Contact] {msg.subject}",
                    message=f"From: {msg.name} <{msg.email}>\n\n{msg.message}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.ADMIN_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass
            return Response({'success': True}, status=201)
        return Response(s.errors, status=400)

class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email required'}, status=400)
        sub, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created:
            sub.is_active = True
            sub.save()
        return Response({'success': True}, status=201)


# ── ADMIN ONLY ────────────────────────────────────────────────

class AdminSiteContentView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        return Response(SiteContentSerializer(SiteContent.load()).data)
    def patch(self, request):
        s = SiteContentSerializer(SiteContent.load(), data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)

class AdminProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUser]

class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUser]

class AdminTeamListCreateView(generics.ListCreateAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminUser]

class AdminTeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminUser]

class AdminServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class AdminTestimonialListCreateView(generics.ListCreateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]

class AdminTestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]

class AdminJobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

class AdminJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

class AdminContactListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

class AdminContactDetailView(generics.RetrieveUpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

class AdminNewsletterListView(generics.ListAPIView):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]
```

**`config/urls.py`:**

```python
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    # Public
    path('api/site-content/', SiteContentView.as_view()),
    path('api/projects/', ProjectListView.as_view()),
    path('api/team/', TeamListView.as_view()),
    path('api/services/', ServiceListView.as_view()),
    path('api/testimonials/', TestimonialListView.as_view()),
    path('api/jobs/', JobListView.as_view()),
    path('api/contact/', ContactCreateView.as_view()),
    path('api/newsletter/', NewsletterSubscribeView.as_view()),

    # Admin only
    path('api/admin/site-content/', AdminSiteContentView.as_view()),
    path('api/admin/projects/', AdminProjectListCreateView.as_view()),
    path('api/admin/projects/<int:pk>/', AdminProjectDetailView.as_view()),
    path('api/admin/team/', AdminTeamListCreateView.as_view()),
    path('api/admin/team/<int:pk>/', AdminTeamDetailView.as_view()),
    path('api/admin/services/', AdminServiceListCreateView.as_view()),
    path('api/admin/services/<int:pk>/', AdminServiceDetailView.as_view()),
    path('api/admin/testimonials/', AdminTestimonialListCreateView.as_view()),
    path('api/admin/testimonials/<int:pk>/', AdminTestimonialDetailView.as_view()),
    path('api/admin/jobs/', AdminJobListCreateView.as_view()),
    path('api/admin/jobs/<int:pk>/', AdminJobDetailView.as_view()),
    path('api/admin/contacts/', AdminContactListView.as_view()),
    path('api/admin/contacts/<int:pk>/', AdminContactDetailView.as_view()),
    path('api/admin/newsletter/', AdminNewsletterListView.as_view()),
]
```

**Stop here. Test every public endpoint in browser. Then move to Prompt 4.**

---

# PROMPT 4 — Frontend: api.js + AuthContext + ProtectedRoute

**Only touch these 3 files. Do not change any page yet.**

**`src/services/api.js`** — replace entire file:

```javascript
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('plt_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('plt_refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE}/api/token/refresh/`, { refresh })
          localStorage.setItem('plt_access_token', data.access)
          err.config.headers.Authorization = `Bearer ${data.access}`
          return api(err.config)
        } catch {
          localStorage.removeItem('plt_access_token')
          localStorage.removeItem('plt_refresh_token')
          window.location.href = '/secret-admin'
        }
      }
    }
    return Promise.reject(err)
  }
)

// Public
export const fetchSiteContent    = () => api.get('/api/site-content/').then(r => r.data)
export const fetchProjects        = () => api.get('/api/projects/').then(r => r.data)
export const fetchTeam            = () => api.get('/api/team/').then(r => r.data)
export const fetchServices        = () => api.get('/api/services/').then(r => r.data)
export const fetchTestimonials    = () => api.get('/api/testimonials/').then(r => r.data)
export const fetchJobs            = () => api.get('/api/jobs/').then(r => r.data)
export const submitContact        = (data) => api.post('/api/contact/', data).then(r => r.data)
export const subscribeNewsletter  = (email) => api.post('/api/newsletter/', { email }).then(r => r.data)

// Admin auth
export const adminLogin = (username, password) =>
  axios.post(`${BASE}/api/token/`, { username, password }).then(r => r.data)

// Admin — site content
export const adminGetSiteContent  = () => api.get('/api/admin/site-content/').then(r => r.data)
export const adminSaveSiteContent = (data) => api.patch('/api/admin/site-content/', data).then(r => r.data)

// Admin — projects
export const adminGetProjects    = () => api.get('/api/admin/projects/').then(r => r.data)
export const adminCreateProject  = (data) => api.post('/api/admin/projects/', data).then(r => r.data)
export const adminUpdateProject  = (id, data) => api.patch(`/api/admin/projects/${id}/`, data).then(r => r.data)
export const adminDeleteProject  = (id) => api.delete(`/api/admin/projects/${id}/`)

// Admin — team
export const adminGetTeam        = () => api.get('/api/admin/team/').then(r => r.data)
export const adminCreateTeam     = (data) => api.post('/api/admin/team/', data).then(r => r.data)
export const adminUpdateTeam     = (id, data) => api.patch(`/api/admin/team/${id}/`, data).then(r => r.data)
export const adminDeleteTeam     = (id) => api.delete(`/api/admin/team/${id}/`)

// Admin — services
export const adminGetServices    = () => api.get('/api/admin/services/').then(r => r.data)
export const adminCreateService  = (data) => api.post('/api/admin/services/', data).then(r => r.data)
export const adminUpdateService  = (id, data) => api.patch(`/api/admin/services/${id}/`, data).then(r => r.data)
export const adminDeleteService  = (id) => api.delete(`/api/admin/services/${id}/`)

// Admin — testimonials
export const adminGetTestimonials    = () => api.get('/api/admin/testimonials/').then(r => r.data)
export const adminCreateTestimonial  = (data) => api.post('/api/admin/testimonials/', data).then(r => r.data)
export const adminUpdateTestimonial  = (id, data) => api.patch(`/api/admin/testimonials/${id}/`, data).then(r => r.data)
export const adminDeleteTestimonial  = (id) => api.delete(`/api/admin/testimonials/${id}/`)

// Admin — jobs
export const adminGetJobs        = () => api.get('/api/admin/jobs/').then(r => r.data)
export const adminCreateJob      = (data) => api.post('/api/admin/jobs/', data).then(r => r.data)
export const adminUpdateJob      = (id, data) => api.patch(`/api/admin/jobs/${id}/`, data).then(r => r.data)
export const adminDeleteJob      = (id) => api.delete(`/api/admin/jobs/${id}/`)

// Admin — contacts
export const adminGetContacts      = () => api.get('/api/admin/contacts/').then(r => r.data)
export const adminMarkContactRead  = (id) => api.patch(`/api/admin/contacts/${id}/`, { is_read: true }).then(r => r.data)

// Admin — newsletter
export const adminGetNewsletter    = () => api.get('/api/admin/newsletter/').then(r => r.data)
```

**`src/context/AuthContext.jsx`** — create new file:

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin } from '../services/api'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('plt_access_token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) setUser(decoded)
        else logout()
      } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const data = await adminLogin(username, password)
    localStorage.setItem('plt_access_token', data.access)
    localStorage.setItem('plt_refresh_token', data.refresh)
    setUser(jwtDecode(data.access))
  }

  const logout = () => {
    localStorage.removeItem('plt_access_token')
    localStorage.removeItem('plt_refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

**`src/components/ProtectedRoute.jsx`** — create new file:

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      Loading...
    </div>
  )
  if (!user) return <Navigate to="/secret-admin" replace />
  return children
}
```

Run `npm install jwt-decode` first.

**Stop here. Then move to Prompt 5.**

---

# PROMPT 5 — Frontend: App.jsx + AdminLayout + AdminLogin

**`src/App.jsx`** — add admin routes, no link anywhere in Navbar/Footer:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Careers from './pages/Careers'
import Contact from './pages/Contact'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSiteContent from './pages/admin/AdminSiteContent'
import AdminProjects from './pages/admin/AdminProjects'
import AdminTeam from './pages/admin/AdminTeam'
import AdminServices from './pages/admin/AdminServices'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminJobs from './pages/admin/AdminJobs'
import AdminContacts from './pages/admin/AdminContacts'
import AdminNewsletter from './pages/admin/AdminNewsletter'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/secret-admin" element={<AdminLogin />} />

          <Route path="/secret-admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="site-content" element={<AdminSiteContent />} />
            <Route path="projects"     element={<AdminProjects />} />
            <Route path="team"         element={<AdminTeam />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="jobs"         element={<AdminJobs />} />
            <Route path="contacts"     element={<AdminContacts />} />
            <Route path="newsletter"   element={<AdminNewsletter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

**`src/layouts/AdminLayout.jsx`** — create new file:

```jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: 'dashboard',    label: '📊 Dashboard' },
  { to: 'site-content', label: '✏️ Site Content' },
  { to: 'projects',     label: '📂 Projects' },
  { to: 'team',         label: '👥 Team' },
  { to: 'services',     label: '🛠️ Services' },
  { to: 'testimonials', label: '💬 Testimonials' },
  { to: 'jobs',         label: '💼 Jobs' },
  { to: 'contacts',     label: '📧 Messages' },
  { to: 'newsletter',   label: '📰 Newsletter' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/secret-admin') }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-56 bg-gray-900 border-r border-white/10 flex flex-col fixed h-full">
        <div className="p-5 border-b border-white/10">
          <p className="font-bold text-white text-sm">Prime Logic Tech</p>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-auto">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={`/secret-admin/${item.to}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            🚪 Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
```

**`src/pages/admin/AdminLogin.jsx`** — create new file:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) { navigate('/secret-admin/dashboard'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/secret-admin/dashboard')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-gray-900 rounded-2xl p-8 border border-white/10">
          <h1 className="text-xl font-bold text-white mb-1">Prime Logic Tech</h1>
          <p className="text-sm text-gray-500 mb-6">Admin access only</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Username</label>
              <input type="text" required
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password</label>
              <input type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

**Stop here. Visit `/secret-admin`, log in, confirm redirect to dashboard. Then move to Prompt 6.**

---

# PROMPT 6 — Frontend: AdminDashboard + AdminContacts + AdminNewsletter

Create these 3 files in `src/pages/admin/`:

**`AdminDashboard.jsx`:**

```jsx
import { useEffect, useState } from 'react'
import { adminGetProjects, adminGetTeam, adminGetContacts, adminGetNewsletter } from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, team: 0, unread: 0, subscribers: 0 })

  useEffect(() => {
    Promise.all([
      adminGetProjects(),
      adminGetTeam(),
      adminGetContacts(),
      adminGetNewsletter(),
    ]).then(([projects, team, contacts, newsletter]) => {
      setStats({
        projects: projects.length,
        team: team.length,
        unread: contacts.filter(c => !c.is_read).length,
        subscribers: newsletter.filter(s => s.is_active).length,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, color: 'bg-indigo-600' },
    { label: 'Team Members', value: stats.team, color: 'bg-teal-600' },
    { label: 'Unread Messages', value: stats.unread, color: 'bg-amber-600' },
    { label: 'Subscribers', value: stats.subscribers, color: 'bg-rose-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Welcome back. Here's what's happening.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-6 border border-white/10">
            <div className={`w-10 h-10 ${card.color} rounded-lg mb-3`} />
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**`AdminContacts.jsx`:**

```jsx
import { useEffect, useState } from 'react'
import { adminGetContacts, adminMarkContactRead } from '../../services/api'

export default function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetContacts().then(setMessages).finally(() => setLoading(false))
  }, [])

  const openMessage = async (msg) => {
    setSelected(msg)
    if (!msg.is_read) {
      await adminMarkContactRead(msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r border-white/10 overflow-auto flex-shrink-0">
        <div className="p-4 border-b border-white/10 sticky top-0 bg-gray-950">
          <h1 className="text-lg font-bold text-white">Messages</h1>
          <p className="text-xs text-gray-500">{messages.filter(m => !m.is_read).length} unread</p>
        </div>
        {messages.length === 0 && <p className="p-4 text-sm text-gray-600">No messages yet.</p>}
        {messages.map(msg => (
          <button key={msg.id} onClick={() => openMessage(msg)}
            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selected?.id === msg.id ? 'bg-white/5' : ''}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              {!msg.is_read && <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />}
              <p className={`text-sm truncate ${msg.is_read ? 'text-gray-400' : 'text-white font-semibold'}`}>
                {msg.name}
              </p>
            </div>
            <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
            <p className="text-xs text-gray-600 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-8">
        {!selected ? (
          <div className="h-full flex items-center justify-center text-gray-600 text-sm">
            Select a message to read
          </div>
        ) : (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-2">{selected.subject}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
              <span className="text-white">{selected.name}</span>
              <a href={`mailto:${selected.email}`} className="text-indigo-400 hover:underline">{selected.email}</a>
              <span>{new Date(selected.created_at).toLocaleString()}</span>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
              {selected.message}
            </div>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
            >
              Reply by email →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
```

**`AdminNewsletter.jsx`:**

```jsx
import { useEffect, useState } from 'react'
import { adminGetNewsletter } from '../../services/api'

export default function AdminNewsletter() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetNewsletter().then(setSubs).finally(() => setLoading(false))
  }, [])

  const exportCSV = () => {
    const csv = ['Email,Status,Date']
      .concat(subs.map(s => `${s.email},${s.is_active ? 'Active' : 'Unsubscribed'},${new Date(s.subscribed_at).toLocaleDateString()}`))
      .join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'subscribers.csv'
    a.click()
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Newsletter</h1>
          <p className="text-sm text-gray-400">{subs.filter(s => s.is_active).length} active subscribers</p>
        </div>
        <button onClick={exportCSV}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Export CSV
        </button>
      </div>
      <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-gray-600">No subscribers yet.</td></tr>
            )}
            {subs.map(sub => (
              <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-white">{sub.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${sub.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                    {sub.is_active ? 'Active' : 'Unsubscribed'}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**Stop here. Confirm dashboard, messages, and newsletter pages load. Then move to Prompt 7.**

---

# PROMPT 7 — Frontend: AdminProjects + AdminTeam + AdminServices + AdminTestimonials + AdminJobs + AdminSiteContent

For each section, build a page with a **list view** + **inline form** for create/edit/delete. Follow this exact pattern for all 6 pages. I'll show `AdminProjects` in full — replicate the same pattern for the others, just swap fields.

**The pattern (use for ALL 6 pages):**

```jsx
import { useEffect, useState } from 'react'
import { adminGetX, adminCreateX, adminUpdateX, adminDeleteX } from '../../services/api'

const EMPTY = { field1: '', field2: '', field3: '' } // match the model fields

export default function AdminX() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null) // id being edited
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => adminGetX().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (item) => { setForm(item); setEditing(item.id); setShowForm(true) }
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const save = async () => {
    setSaving(true)
    try {
      if (editing) await adminUpdateX(editing, form)
      else await adminCreateX(form)
      await load()
      cancel()
    } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return
    await adminDeleteX(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">X</h1>
        <button onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg">
          + Add New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl border border-white/10 p-6 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">{editing ? 'Edit' : 'New'} X</h2>
          {/* fields here — input for each model field */}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 rounded-xl border border-white/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{item.field1}</p>
              <p className="text-gray-400 text-xs">{item.field2}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg">
                Edit
              </button>
              <button onClick={() => remove(item.id)}
                className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs rounded-lg">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-600 text-sm">Nothing added yet.</p>}
      </div>
    </div>
  )
}
```

**Fields for each page:**

| Page                  | EMPTY object                                                                                                   | Form inputs                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `AdminProjects`     | `{ title, category, description, image_url, tech_stack: '', live_url, github_url, pinned: false, order: 0 }` | text inputs for all + checkbox for pinned    |
| `AdminTeam`         | `{ name, role, bio, image_url, linkedin_url, github_url, twitter_url, order: 0, is_active: true }`           | text inputs + checkbox for is_active         |
| `AdminServices`     | `{ title, description, icon: 'Code', order: 0, is_active: true }`                                            | text inputs + checkbox                       |
| `AdminTestimonials` | `{ name, role, company, quote, avatar_url, order: 0, is_active: true }`                                      | text inputs + textarea for quote             |
| `AdminJobs`         | `{ title, department, location, job_type: 'full-time', description, requirements: '', is_open: true }`       | text inputs + select for job_type + checkbox |
| `AdminSiteContent`  | all SiteContent fields                                                                                         | one big form, PATCH on save, no list needed  |

**Note for `tech_stack` and `requirements`:** store as comma-separated string in the form, convert to array before saving:

```javascript
const save = async () => {
  const payload = {
    ...form,
    tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
  }
  await adminCreateProject(payload)
}
```

**Stop here. Confirm all pages work. Then move to Prompt 8.**

---

# PROMPT 8 — Frontend: update public pages + contact form + newsletter

**Contact page — replace Formspree:**

In `src/pages/Contact.jsx`, find the form submit handler and replace:

```jsx
// Remove: fetch('https://formspree.io/f/xjgzbpyg', ...)
// Add at top:
import { submitContact } from '../services/api'

// Replace handleSubmit with:
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    await submitContact({ name, email, subject, message })
    setSuccess(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSuccess(false), 5000)
  } catch {
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

 **Newsletter — wherever the subscribe form is** , replace W3Forms with:

```jsx
import { subscribeNewsletter } from '../services/api'

const handleSubscribe = async (e) => {
  e.preventDefault()
  try {
    await subscribeNewsletter(email)
    setSuccess(true)
    setEmail('')
  } catch {
    setError('Could not subscribe. Try again.')
  }
}
```

**Update all public pages to fetch from API:**

Every page should follow this pattern — remove mock.js imports and use real API:

```jsx
// Home.jsx
import { fetchSiteContent, fetchProjects, fetchTestimonials, fetchServices } from '../services/api'

useEffect(() => {
  fetchSiteContent().then(setSiteContent).catch(() => {})
  fetchProjects().then(setProjects).catch(() => {})
  fetchTestimonials().then(setTestimonials).catch(() => {})
  fetchServices().then(setServices).catch(() => {})
}, [])

// About.jsx
import { fetchSiteContent, fetchTeam } from '../services/api'

// Services.jsx — already uses fetchServices(), just make sure it points to the new api.js

// Portfolio.jsx — already uses loadProjects(), rename to fetchProjects()

// Careers.jsx
import { fetchJobs } from '../services/api'
```

**Add `VITE_API_URL` to Vercel:**

In Vercel project settings → Environment Variables:

```
VITE_API_URL = https://your-render-app.onrender.com
```

**Add environment variables to Render:**

```
SECRET_KEY            = (long random string)
DEBUG                 = False
DATABASE_URL          = (postgres URL from Render dashboard)
CLOUDINARY_CLOUD_NAME = (from cloudinary.com)
CLOUDINARY_API_KEY    = (from cloudinary.com)
CLOUDINARY_API_SECRET = (from cloudinary.com)
EMAIL_HOST_USER       = yourmail@gmail.com
EMAIL_HOST_PASSWORD   = (Gmail app password — not your real password)
ADMIN_EMAIL           = admin@primelogictech.com
```

---

# FINAL CHECKLIST

**Backend (Render):**

* [X] All packages in `requirements.txt`
* [X] `build.sh` exists and is executable
* [X] `settings.py` uses env vars for everything sensitive
* [X] All 8 models created and migrated
* [X] All public + admin endpoints working
* [X] Superuser created via `python manage.py createsuperuser`
* [X] Test `/api/token/` returns JWT

**Frontend (Vercel):**

* [X] `VITE_API_URL` set in Vercel env vars
* [X] `jwt-decode` installed
* [X] `AuthContext` + `ProtectedRoute` created
* [X] `/secret-admin` route exists — **no link to it in Navbar or Footer**
* [X] Login works, redirects to dashboard
* [X] All 9 admin pages working
* [X] Contact form posts to `/api/contact/`
* [X] Newsletter posts to `/api/newsletter/`
* [X] All public pages fetch from real API

---

Feed these 8 prompts  **one at a time** , confirm each works before moving to the next. That's the complete system.
