# Backend Setup & Admin Panel

## Quick Start

### 1. Activate Virtual Environment

```bash
cd backend
source .venv/bin/activate
```

### 2. Install Dependencies (if needed)

```bash
pip install -r requirements.txt
```

### 3. Create Admin Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 4. Run Development Server

```bash
python manage.py runserver
```

Server will run at: **http://localhost:8000**

### 5. Access Admin Panel

Visit: **http://localhost:8000/admin/**

Log in with your superuser credentials.

---

## Database Models

The backend now includes these models:

### ContactSettings
- Store company contact info (email, phone, location)
- API endpoint: `/api/contact-settings/`

### Service
- Services offered by the company
- Display on Services & Home pages
- API endpoint: `/api/services/`

### Project
- Portfolio projects
- Display on Portfolio page
- API endpoint: `/api/projects/`

### Job
- Job postings for careers
- Display on Careers page
- API endpoint: `/api/jobs/`

### Employee
- Team members
- Display on About page
- API endpoint: `/api/team/`

### Testimonial
- Client reviews
- Display on Home page
- API endpoint: `/api/testimonials/`

### ContactMessage
- Messages from contact form
- View in admin panel
- API endpoint: `POST /api/contact/`

---

## Project Structure

```
backend/
├── config/
│   ├── settings.py      # Django settings (CORS, installed apps, etc.)
│   ├── urls.py          # Main URL routing
│   ├── asgi.py
│   └── wsgi.py
├── core/
│   ├── models.py        # Database models ✅ UPDATED
│   ├── views.py         # API views ✅ UPDATED
│   ├── serializers.py   # API serializers ✅ NEW
│   ├── urls.py          # App URLs ✅ UPDATED
│   ├── admin.py         # Admin panel ✅ UPDATED
│   ├── data.py          # Hardcoded data (legacy, can be removed)
│   └── migrations/      # Database migrations ✅ NEW
├── manage.py
├── db.sqlite3           # SQLite database
├── requirements.txt
└── .venv/               # Virtual environment

```

---

## API Endpoints

All endpoints return JSON data:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | API status |
| `/api/services/` | GET | Get all services |
| `/api/projects/` | GET | Get all projects |
| `/api/team/` | GET | Get all employees |
| `/api/jobs/` | GET | Get active jobs |
| `/api/testimonials/` | GET | Get all testimonials |
| `/api/contact-settings/` | GET | Get company contact info |
| `/api/contact/` | POST | Submit contact form |

### Example: Create Contact Message

```bash
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "I would like to know more..."
  }'
```

---

## Admin Panel Sections

### 1. Dashboard
Overview of all content types with quick access.

### 2. Contact Settings
- Edit: email, phone, location
- Auto-syncs with frontend config

### 3. Services
- Create/edit services
- Set display order
- Choose Lucide icons

### 4. Projects
- Add portfolio projects
- Include technologies and links
- Manage gallery

### 5. Jobs
- Post job openings
- Activate/deactivate listings
- Include requirements

### 6. Employees
- Add team members
- Include bios and social links
- Organize by position

### 7. Testimonials
- Add client reviews
- Set ratings (1-5 stars)
- Include client photos

### 8. Contact Messages
- View form submissions
- Mark as read
- Search and filter

---

## Key Features

✅ **Full Admin Interface**: Manage all content through admin panel  
✅ **Database-Driven**: All data stored in SQLite  
✅ **API Ready**: JSON endpoints for frontend  
✅ **User Authentication**: Login required for admin  
✅ **CORS Enabled**: Frontend can communicate freely  
✅ **Migrations**: Version-controlled database schema  
✅ **Search & Filter**: Find content quickly  
✅ **Reordering**: Control display order  

---

## Updating Frontend Config

Once you add contact info via admin, update the frontend config:

**frontend/src/config/company.js** will automatically use `/api/contact-settings/` 

Or hardcode for faster load:
```javascript
export const company = {
  contact: {
    email: 'primelogictech3@gmail.com',
    phone: '+1 (555) 123-4567',
    location: 'Kathmandu, Nepal',
  }
}
```

---

## Common Commands

```bash
# Create superuser
python manage.py createsuperuser

# Change admin password
python manage.py changepassword admin

# Run server
python manage.py runserver

# Make migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Django shell (interactive Python)
python manage.py shell

# Create sample data
python manage.py shell < populate_data.py
```

---

## Environment Variables (Production)

Create `.env` file:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

---

## Troubleshooting

**Port 8000 already in use?**
```bash
python manage.py runserver 8001
```

**Forgot admin password?**
```bash
python manage.py changepassword admin
```

**Need to reset database?**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

**Template/Static files not loading?**
```bash
python manage.py collectstatic --noinput
```

---

## Next Steps

1. ✅ Setup complete!
2. Create your admin account
3. Add initial content in admin panel
4. Test API endpoints
5. Connect frontend (already set up)
6. Deploy to production

---

**Admin Panel**: http://localhost:8000/admin/  
**API Base**: http://localhost:8000/api/  
**Documentation**: See ADMIN_GUIDE.md

**Happy Building! 🚀**
