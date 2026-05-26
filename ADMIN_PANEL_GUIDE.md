# Admin Panel User Guide

Complete guide to using the Prime Logic Tech Admin Panel.

> **Update:** The legacy React admin (`/secret-admin`) has been removed.
> Use Django admin only: `https://primelogitech-backend.onrender.com/admin/`

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Site Content](#site-content)
4. [Projects Management](#projects-management)
5. [Team Management](#team-management)
6. [Services Management](#services-management)
7. [Testimonials Management](#testimonials-management)
8. [Jobs Management](#jobs-management)
9. [Contacts & Messages](#contacts--messages)
10. [Newsletter Subscribers](#newsletter-subscribers)
11. [Image Gallery](#image-gallery)
12. [Admin Users](#admin-users)
13. [Settings](#settings)

---

## Getting Started

### Accessing the Admin Panel

1. Go to: `https://yourdomain.vercel.app/secret-admin`
2. Enter your username and password
3. Click "Sign In"

### Dashboard Navigation

The left sidebar contains all admin sections. Click any section to navigate.

**Mobile:** Tap the menu icon (☰) to open/close the sidebar.

---

## Dashboard

The Dashboard provides a quick overview of your website's content.

### Statistics Cards

Each card shows the total count of items in that section:
- **Projects**: Portfolio projects
- **Team**: Team members
- **Services**: Services offered
- **Testimonials**: Client testimonials
- **Jobs**: Open job positions
- **Contacts**: Contact form submissions
- **Newsletter**: Email subscribers
- **Images**: Uploaded images
- **Admin Users**: Admin accounts

Click any card to go directly to that section.

### Quick Actions

Fast shortcuts to common tasks:
- **Edit Site Content**: Update hero, about, CTA sections
- **Add Project**: Create new portfolio project
- **Add Team Member**: Add new team member

---

## Site Content

Edit the main website content sections.

### Hero Section
- **Badge**: Small text above heading ("Prime Logic Tech is now live")
- **Heading**: Main hero title ("Design. Develop. Deliver.")
- **Subtitle**: Description text
- **Primary CTA**: Main button text
- **Secondary CTA**: Secondary button text
- **Trusted By Logos**: List of client logos

### Why Partner Section
- **Title**: Section heading
- **Description**: Intro text
- **Checklist Items**: Benefits list

### Statistics Section
- **Projects Count**: e.g., "150+"
- **Client Satisfaction**: e.g., "98%"
- **Team Size**: e.g., "45+"
- **Years of Experience**: e.g., "10+"

### About Section
- **Mission**: Company mission statement
- **Vision**: Company vision statement

### CTA Section
- **Heading**: Call-to-action title
- **Subtitle**: CTA description
- **Button Text**: CTA button label

### Contact Info
- **Email**: Business email
- **Phone**: Business phone number
- **Address**: Business address

### Footer
- **Tagline**: Footer text

---

## Projects Management

Showcase your portfolio projects.

### Viewing Projects

All projects display in a table with:
- **Title**: Project name
- **Category**: Project category (e.g., "Web Design")
- **Tech Stack**: Technologies used
- **Actions**: Edit or Delete buttons

### Creating a Project

1. Click "Add Project" button
2. Fill in the form:
   - **Title** (required): Project name
   - **Category**: Type of project
   - **Description**: Project details
   - **Tech Stack**: Comma-separated list of technologies
   - **Live URL**: Link to live project (optional)
   - **GitHub URL**: GitHub repository link (optional)
   - **Pinned**: Check to feature on homepage
   - **Order**: Display priority (lower number = higher priority)
   - **Image**: Drag and drop or click to upload

3. Click "Save Project"

### Editing a Project

1. Click "Edit" on any project
2. Modify the fields
3. Click "Save Project" to update

### Deleting a Project

1. Click "Delete" on the project
2. Confirm the deletion

---

## Team Management

Manage team member profiles.

### Viewing Team

Table displays:
- **Name**: Team member name
- **Role**: Job title
- **Status**: Active/Inactive
- **Actions**: Edit or Delete

### Adding a Team Member

1. Click "Add Team Member"
2. Fill in details:
   - **Name** (required): Full name
   - **Role**: Job title
   - **Bio**: Short biography
   - **Image**: Profile photo (drag and drop)
   - **LinkedIn URL**: LinkedIn profile link
   - **GitHub URL**: GitHub profile link
   - **Twitter URL**: Twitter/X profile link
   - **Order**: Display order
   - **Active**: Toggle to show/hide

3. Click "Save Member"

### Uploading Team Photos

- Click the image upload area
- Drag and drop an image or click to browse
- Click "Save Member" to upload

Supported formats: JPG, PNG, WebP (max 5MB recommended)

### Editing Team Members

1. Click "Edit" on the member
2. Update information
3. Click "Save Member"

### Deactivating Members

1. Click "Edit"
2. Uncheck "Active"
3. Click "Save" — member won't display on website but remains in database

---

## Services Management

Define the services your company offers.

### Creating a Service

1. Click "Add Service"
2. Enter:
   - **Title**: Service name
   - **Description**: Service details
   - **Icon**: Icon name (lucide-react icons)
   - **Order**: Display priority
   - **Active**: Toggle visibility

3. Click "Save Service"

### Icon Names

Common icon names:
- `Code` - Programming
- `Zap` - Performance
- `Shield` - Security
- `Target` - Precision
- `Rocket` - Launch
- `Layers` - Architecture

(See lucide-react documentation for complete list)

### Managing Services

- **Edit**: Click "Edit", modify, click "Save"
- **Delete**: Click "Delete", confirm
- **Reorder**: Change "Order" number (1, 2, 3, etc.)
- **Hide**: Uncheck "Active" to hide without deleting

---

## Testimonials Management

Collect and display client testimonials.

### Adding Testimonials

1. Click "Add Testimonial"
2. Fill in:
   - **Name**: Client name
   - **Role**: Client job title
   - **Company**: Client company name
   - **Quote**: Testimonial text
   - **Avatar URL**: Link to client photo (optional)
   - **Order**: Display order
   - **Active**: Show/hide on website

3. Click "Save Testimonial"

### Managing Testimonials

- **Edit**: Click "Edit", modify, click "Save"
- **Delete**: Click "Delete", confirm
- **Avatar**: Use image URL, or use image gallery URL
- **Reorder**: Change "Order" to rearrange display

---

## Jobs Management

Post and manage job openings.

### Creating a Job Posting

1. Click "Add Job"
2. Enter:
   - **Title**: Job title
   - **Department**: Department (optional)
   - **Location**: Job location (default: "Remote")
   - **Type**: Full Time, Part Time, Contract, Internship
   - **Description**: Full job description
   - **Requirements**: One per line (each line becomes a bullet point)
   - **Open**: Toggle to open/close applications

3. Click "Save Job"

### Format Requirements Field

Enter each requirement on a new line:
```
5+ years experience with React
Experience with TypeScript
Strong communication skills
```

### Managing Jobs

- **Edit**: Click "Edit", modify, click "Save"
- **Delete**: Click "Delete", confirm
- **Close Positions**: Uncheck "Open" to hide job posting
- **Publish Later**: Create job with "Open" unchecked, check later

---

## Contacts & Messages

View and manage contact form submissions.

### Viewing Messages

Table shows:
- **Name**: Sender name
- **Email**: Sender email
- **Subject**: Message subject
- **Date**: Submission date
- **Status**: Read/Unread
- **Actions**: View or Delete

### Reading Messages

1. Click the message in the table
2. View full message details
3. Note sender's email to reply manually

### Managing Messages

- **Mark as Read**: Auto-marked when opened
- **Delete**: Click "Delete" to remove message
- **Reply**: Copy sender email to reply via email client

---

## Newsletter Subscribers

Manage email newsletter subscription list.

### Viewing Subscribers

List shows:
- **Email**: Subscriber email
- **Status**: Active/Inactive
- **Subscribed Date**: When they subscribed

### Exporting Subscribers

While not built-in, you can:
1. Copy email addresses from the list
2. Paste into your email service (Mailchimp, SendGrid, etc.)

### Managing Subscriptions

- **Deactivate**: Mark as inactive to exclude from sends
- **Delete**: Remove from list permanently
- **Reactivate**: Change status back to Active

---

## Image Gallery

Centralized management of all uploaded images.

### Uploading Images

1. Click "Upload Image" button
2. Drag and drop image or click to browse
3. Fill in:
   - **Alt Text**: Description (for accessibility)
   - **Asset Type**: Project, Team, Service, or Other
4. Click "Upload Image"

### Viewing Gallery

Images display in a grid. Filter by type:
- **All Images**: All uploaded images
- **Projects**: Project screenshots
- **Team**: Team member photos
- **Services**: Service icons
- **Other**: Miscellaneous images

### Image Actions

Click an image to see options:
- **Copy URL**: Click copy icon to copy image URL
- **Delete**: Click trash icon to delete

### Using Uploaded Images

Copy the image URL and paste in:
- Project image field
- Team member avatar field
- Content descriptions

---

## Admin Users

Manage other admin accounts and permissions.

### Viewing Admin Users

Table shows:
- **Username**: Login username
- **Email**: User email
- **Role**: Admin, Editor, or Viewer
- **Status**: Active/Inactive
- **Last Login**: When they last accessed panel
- **Actions**: Edit, Delete, or Reset Password

### User Roles

**Admin** - Full access
- Create, edit, delete all content
- Manage other admin users
- Access all settings

**Editor** - Content management
- Create, edit, delete content
- Manage projects, team, services, etc.
- Cannot manage other users

**Viewer** - Read-only access
- View all content
- Cannot create, edit, or delete
- Good for stakeholders who need to monitor content

### Creating Admin User

1. Click "Add User" button
2. Enter:
   - **Username**: Login name (unique)
   - **Email**: User email
   - **Password**: Temporary password (min 8 characters)
   - **Role**: Admin, Editor, or Viewer

3. Click "Save User"
4. Share temporary password securely with user
5. User should change password on first login

### Editing Admin User

1. Click "Edit" on the user
2. Modify:
   - Email
   - Role
   - Status (Active/Inactive)

3. Click "Save User"

### Resetting Password

1. Click "Reset Password" button next to user
2. Enter new password (min 8 characters)
3. Click "Reset"
4. Share new password with user securely
5. User should change password immediately

### Deleting Admin User

1. Click "Delete" on the user
2. Confirm deletion

**Note:** Deleted users lose all access. Deactivate instead if they might return.

---

## Settings

View system configuration and preferences.

### Your Account

- **Username**: Your login username
- **Email**: Your email address

### System Information

- **API Base URL**: Backend server address
- **Frontend Version**: Admin panel version
- **Backend Status**: Connection status (green = connected)

### Deployment Information

- **Frontend Host**: Vercel
- **Backend Host**: Render
- **Database**: PostgreSQL on Render
- **Media Storage**: Cloudinary CDN

### Admin Preferences

- **Dark Mode**: Currently enabled (toggle if needed)
- **Session Timeout**: 8 hours of inactivity
- **Notifications**: Desktop & Email alerts

### Security Information

- JWT tokens auto-refresh when expired
- Passwords must be 8+ characters
- All API requests use HTTPS
- CORS configured for security

---

## Tips & Best Practices

### Content Management
- Always provide alt text for images (accessibility)
- Keep project descriptions concise but descriptive
- Regularly update team members and job listings
- Archive old job postings instead of deleting

### Images
- Use high-quality images (2000px+ width)
- Compress before uploading (tools: TinyPNG, ImageOptim)
- Use consistent image dimensions for team photos
- Store image URLs in a spreadsheet for reference

### SEO
- Use descriptive project titles
- Include relevant keywords in descriptions
- Keep content fresh and updated
- Use meaningful alt text for images

### Security
- Change default password immediately
- Use strong, unique passwords
- Never share login credentials
- Log out when leaving the computer
- Report suspicious activity immediately

### Troubleshooting
- **Page won't load**: Check internet connection
- **Can't upload image**: Ensure image is < 5MB
- **Changes not saving**: Try refreshing page
- **Logged out unexpectedly**: Session may have timed out (8 hours)
- **API errors**: Notify backend administrator

---

## Keyboard Shortcuts

- `Esc` - Close dialogs/modals
- `Ctrl+S` / `Cmd+S` - Submit forms (not always enabled)
- `Tab` - Navigate between form fields

---

## Support

For issues or questions:
1. Check this guide first
2. Contact your system administrator
3. File a bug report with specific details

---

**Last Updated:** May 2026
**Admin Panel Version:** 1.0.0
