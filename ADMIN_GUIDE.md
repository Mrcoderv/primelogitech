# Django Admin Panel Setup Guide

## Overview
The Django Admin Panel allows you to manage all content for your website without touching code:
- Add/Edit/Delete Services, Projects, and Jobs
- Manage Team Members/Employees
- View Contact Messages
- Update Company Contact Information
- Add Client Testimonials

---

## Getting Started

### 1. Create Superuser (Admin Account)

Run this command in the backend directory:

```bash
source .venv/bin/activate
python manage.py createsuperuser
```

You'll be prompted to enter:
- **Username**: Your admin username (e.g., admin)
- **Email**: Your email address
- **Password**: A strong password (will be hidden as you type)

Example:
```
Username: admin
Email: admin@primelogictech.com
Password: (enter your secure password)
```

### 2. Access Admin Panel

Start the Django server:
```bash
python manage.py runserver
```

Then visit: **http://localhost:8000/admin/**

Log in with your superuser credentials.

---

## Admin Features

### 1. **Contact Settings** (Manage Company Contact Info)
- **Location**: Edit the company location
- **Email**: Update company email (syncs with contact form)
- **Phone**: Update company phone number
- **Note**: Only one contact settings record exists

**Navigate To**: Admin Dashboard → Contact Settings

---

### 2. **Services** (Add Your Services)
Add services that appear on the Services page and Home page.

**Fields**:
- **Title**: Service name (e.g., "Web Development")
- **Description**: Service details
- **Icon**: Lucide icon name (e.g., Code, Smartphone, PenTool, Search, Cloud, BrainCircuit)
- **Order**: Display order on the website (0 = first)

**Actions**:
- Click "Add Service" to create new service
- Edit existing services
- Drag to reorder (via order field)

---

### 3. **Projects** (Add Portfolio Projects)
Showcase your completed projects on the Portfolio page.

**Fields**:
- **Title**: Project name
- **Description**: Project details
- **Image URL**: URL to project image/screenshot
- **Technologies**: Comma-separated tech stack (e.g., "React, Node.js, MongoDB")
- **Link**: Project URL (optional)
- **Order**: Display order

**Actions**:
- Add new projects
- Add project links/demos
- Organize with order field

---

### 4. **Jobs** (Manage Job Postings)
Post job openings on the Careers page.

**Fields**:
- **Title**: Job title
- **Description**: Full job description
- **Location**: Job location
- **Job Type**: Full-time, Part-time, or Contract
- **Salary Range**: (e.g., "$50,000 - $80,000")
- **Requirements**: List requirements (one per line)
- **Is Active**: Check to show on website, uncheck to hide

**Actions**:
- Add new job postings
- Deactivate old postings (keeps history)
- Edit requirements anytime

---

### 5. **Employees** (Manage Team Members)
Add team members to the About/Team page.

**Fields**:
- **Name**: Employee name
- **Role**: Job title
- **Bio**: Short bio/description
- **Image URL**: Profile photo URL
- **Email**: Work email
- **LinkedIn**: LinkedIn profile URL
- **Twitter**: Twitter profile URL
- **Order**: Display order

**Actions**:
- Add team members
- Add social media links
- Update profiles anytime

---

### 6. **Testimonials** (Add Client Reviews)
Display client testimonials on the Home page.

**Fields**:
- **Name**: Client name
- **Company**: Client company
- **Message**: Testimonial text
- **Rating**: 1-5 stars
- **Image URL**: Client photo (optional)
- **Order**: Display order

**Actions**:
- Add new testimonials
- Set star ratings
- Organize by order

---

### 7. **Contact Messages** (View Form Submissions)
View all messages sent through the contact form.

**Fields** (Read-Only):
- **Name**: Sender name
- **Email**: Sender email
- **Subject**: Message subject
- **Message**: Full message
- **Is Read**: Mark as read/unread
- **Created At**: Submission timestamp

**Actions**:
- View all messages
- Mark as read/unread
- Delete old messages
- Search by name, email, or subject

---

## Quick Start Checklist

- [ ] Create superuser account (`python manage.py createsuperuser`)
- [ ] Access admin panel (`http://localhost:8000/admin/`)
- [ ] Update Contact Settings with your company info
- [ ] Add at least 3-5 Services
- [ ] Add 2-3 Portfolio Projects
- [ ] Add team members to Employees
- [ ] Create job postings (optional)
- [ ] Add client testimonials

---

## API Integration

The admin-managed content automatically syncs with your frontend via API endpoints:

- **Services**: `GET /api/services/`
- **Projects**: `GET /api/projects/`
- **Team**: `GET /api/team/`
- **Jobs**: `GET /api/jobs/`
- **Testimonials**: `GET /api/testimonials/`
- **Contact Settings**: `GET /api/contact-settings/`
- **Contact Form**: `POST /api/contact/`

Frontend components fetch this data automatically!

---

## Tips & Tricks

1. **Icons for Services**: Use Lucide icon names like: Code, Smartphone, PenTool, Search, Cloud, BrainCircuit, Zap, Shield, Globe, etc.

2. **Order Field**: Lower numbers appear first. Use increments of 10 (10, 20, 30) for easy reordering.

3. **Image URLs**: Use URLs from:
   - Imgur
   - Cloudinary
   - Your own server
   - CDN services

4. **Contact Messages**: Archive old messages periodically to keep your database clean.

5. **Bulk Editing**: Use Django admin's bulk action for changing multiple items.

---

## Troubleshooting

**Forgot Admin Password?**
```bash
python manage.py changepassword admin
```

**Need Another Admin?**
```bash
python manage.py createsuperuser
```

**Reset Database?**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## Next Steps

1. Start your server: `python manage.py runserver`
2. Visit admin: `http://localhost:8000/admin/`
3. Start adding content!
4. Check your frontend to see changes in real-time

---

**Happy Managing! 🚀**
