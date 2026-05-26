# Admin Panel Setup - Quick Start

## ⚠️ Admin Access Update

- The React admin panel at `/secret-admin` has been removed.
- All administration is now handled only in Django admin:
  - Local: `http://localhost:8000/admin/`
  - Production: `https://primelogitech-backend.onrender.com/admin/`

## ✅ What Was Set Up

Your Django admin panel is now fully configured with:

1. **Database Models** for:
   - Services/Features
   - Projects
   - Jobs
   - Employees/Team Members
   - Testimonials
   - Contact Settings
   - Contact Messages

2. **Admin Interface** for managing all content with:
   - Search & filtering
   - Bulk actions
   - Display ordering
   - Read-only protections for messages
   - Beautiful forms with organized fields

3. **API Endpoints** that automatically fetch admin-managed content

---

## 🚀 Next Steps - Create Your Admin Account

### Step 1: Activate Virtual Environment
```bash
cd backend
source .venv/bin/activate
```

### Step 2: Create Superuser (Admin Login)
```bash
python manage.py createsuperuser
```

You'll see:
```
Username: [type your username, e.g., admin]
Email: [your email]
Password: [enter secure password]
Password (again): [confirm password]
```

Example:
```
Username: admin
Email: admin@primelogictech.com
Password: MySecurePassword123!
Password (again): MySecurePassword123!
Superuser created successfully.
```

### Step 3: Start the Server
```bash
python manage.py runserver
```

You'll see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Step 4: Access Admin Panel
1. Open browser
2. Visit: **http://localhost:8000/admin/**
3. Login with your credentials (username & password from Step 2)

---

## 📝 What You Can Do in Admin Panel

### Add Content:
- ✅ Company email, phone, location
- ✅ Services (Web Dev, Mobile Apps, etc.)
- ✅ Portfolio projects
- ✅ Team members
- ✅ Job postings
- ✅ Client testimonials

### View Content:
- ✅ All contact form submissions
- ✅ See which messages are read/unread
- ✅ Complete message content

### Edit Content:
- ✅ Update any service, project, or job
- ✅ Change display order
- ✅ Activate/deactivate jobs
- ✅ Mark messages as read

---

## 🎯 First Time Setup Checklist

- [ ] Create superuser account
- [ ] Access http://localhost:8000/admin/
- [ ] Add your Contact Settings (email, phone, location)
- [ ] Add 3-5 Services
- [ ] Add 2-3 Portfolio Projects
- [ ] Add 3-5 Team Members
- [ ] Add 1-2 Testimonials
- [ ] Create a test Job posting

---

## 📚 Documentation Files

Read these for detailed info:

1. **[ADMIN_GUIDE.md](../ADMIN_GUIDE.md)** - Complete admin panel guide
2. **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend technical setup

---

## 🔒 Security Tips

- ✅ **Don't share** your admin password
- ✅ **Use strong password** (letters, numbers, symbols)
- ✅ **Change password** regularly via admin panel
- ✅ In production: use environment variables for SECRET_KEY

---

## 🆘 Troubleshooting

**Q: Port 8000 is in use**
```bash
python manage.py runserver 8001
```

**Q: Forgot admin password**
```bash
python manage.py changepassword admin
```

**Q: Can't access admin panel**
- Make sure server is running (`python manage.py runserver`)
- Check URL: http://localhost:8000/admin/ (with trailing slash)
- Clear browser cache

**Q: Error about migrations**
```bash
python manage.py migrate
```

---

## 📡 Frontend Connection

The frontend is already configured to fetch data from your API:
- Services, Projects, Jobs, Team, Testimonials all auto-update
- Contact form submissions saved to database
- Everything syncs automatically!

---

## 🎓 Key Concepts

- **Models**: Database tables for storing content
- **Admin Interface**: User-friendly content management
- **API**: Endpoints that serve content to frontend
- **Migrations**: Version control for database changes
- **Superuser**: Admin account with full access

---

## 📞 Need More Help?

Refer to:
- **ADMIN_GUIDE.md** - Feature-by-feature guide
- **BACKEND_SETUP.md** - Technical details
- Django docs: https://docs.djangoproject.com/

---

## ✨ You're All Set!

Your admin panel is ready to use. Now go manage your content! 🎉

**Admin URL**: http://localhost:8000/admin/
**API Base**: http://localhost:8000/api/
