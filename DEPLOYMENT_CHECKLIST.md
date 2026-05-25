# Deployment Checklist - Prime Logic Tech Admin Panel

Complete this checklist before deploying to production.

## Pre-Deployment Preparation

### Code Quality
- [ ] All code committed to Git
- [ ] No console.log() or debug statements remain
- [ ] ESLint/Prettier formatting applied
- [ ] Tests passing (if applicable)
- [ ] No security vulnerabilities in dependencies (`npm audit`)

### Environment Configuration
- [ ] `.env.local` contains all required variables
- [ ] Sensitive data (API keys, passwords) never committed to Git
- [ ] Environment variables documented in `.env.example`

## Backend Deployment (Render)

### Pre-Deployment
- [ ] All migrations created: `python manage.py makemigrations`
- [ ] Migrations tested locally: `python manage.py migrate`
- [ ] Django settings configured for production (`DEBUG=False`)
- [ ] Static files collected: `python manage.py collectstatic --noinput`
- [ ] Gunicorn installed: `pip install gunicorn`

### Render Configuration
- [ ] PostgreSQL database created on Render
- [ ] Web service created on Render
- [ ] Build command set: `pip install -r requirements.txt && python manage.py migrate`
- [ ] Start command set: `gunicorn config.wsgi:application`

### Environment Variables (Render)
- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` generated and set
- [ ] `ALLOWED_HOSTS` includes Render domain
- [ ] `RENDER_EXTERNAL_HOSTNAME` set
- [ ] `DATABASE_URL` configured (auto-linked from PostgreSQL)
- [ ] `CLOUDINARY_CLOUD_NAME` set (if using media uploads)
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set
- [ ] `EMAIL_HOST_USER` configured
- [ ] `EMAIL_HOST_PASSWORD` configured
- [ ] `ADMIN_EMAIL` set
- [ ] `CORS_ALLOWED_ORIGINS` includes frontend URL

### Post-Deployment (Backend)
- [ ] Backend service deployed successfully
- [ ] No build errors in Render logs
- [ ] Database migrations applied successfully
- [ ] Admin user created: `python manage.py init_admin`
- [ ] API endpoint responds: `curl https://your-backend.onrender.com/api/site-content/`
- [ ] Django admin accessible: `/admin/`
- [ ] No 502 Bad Gateway errors

## Frontend Deployment (Vercel)

### Pre-Deployment
- [ ] `package.json` updated with correct dependencies
- [ ] Build tested locally: `npm run build`
- [ ] No build warnings or errors
- [ ] `dist/` directory gitignored
- [ ] All imports resolved (no module errors)

### Vercel Configuration
- [ ] Project imported in Vercel
- [ ] Build command configured: `cd frontend && npm install && npm run build`
- [ ] Output directory set: `frontend/dist`
- [ ] Node version set to 18 or higher

### Environment Variables (Vercel)
- [ ] `VITE_API_URL` set to backend Render URL
- [ ] Environment variables set for Production environment

### Post-Deployment (Frontend)
- [ ] Frontend deployed successfully
- [ ] No build or deployment errors
- [ ] Website loads at Vercel domain
- [ ] Admin login page accessible: `/secret-admin`
- [ ] Network requests go to correct backend URL
- [ ] No CORS errors in browser console
- [ ] API calls succeed with valid token

## Integration Testing

### Authentication
- [ ] Admin login works with correct credentials
- [ ] Invalid credentials rejected
- [ ] Token refresh works (8-hour timeout)
- [ ] Logout clears session
- [ ] Unauthorized routes redirect to login

### API Functionality
- [ ] GET /api/site-content/ works
- [ ] GET /api/admin/projects/ returns projects
- [ ] POST /api/admin/projects/ creates project
- [ ] PATCH /api/admin/projects/{id}/ updates project
- [ ] DELETE /api/admin/projects/{id}/ deletes project
- [ ] GET /api/admin/users/ returns admin users
- [ ] POST /api/admin/users/ creates admin user
- [ ] GET /api/admin/images/ returns images
- [ ] Image upload works
- [ ] Image deletion works

### Admin Panel Features
- [ ] Dashboard displays all statistics
- [ ] Projects page: list, create, edit, delete
- [ ] Team page: list, create, edit, delete, image upload
- [ ] Services page: list, create, edit, delete
- [ ] Testimonials page: list, create, edit, delete
- [ ] Jobs page: list, create, edit, delete
- [ ] Contacts page: view, mark as read
- [ ] Newsletter page: view subscribers
- [ ] Admin Users page: list, create, edit, delete, reset password
- [ ] Images page: upload, view gallery, delete
- [ ] Settings page: displays system info

### Public Website
- [ ] Homepage loads and displays content
- [ ] All images load correctly
- [ ] Projects display correctly
- [ ] Team member cards display with images
- [ ] Contact form works
- [ ] Contact emails sent to admin
- [ ] Newsletter subscription works
- [ ] About page loads
- [ ] Services page loads
- [ ] Portfolio/Projects page loads
- [ ] Careers page loads

## Performance & Security

### Performance
- [ ] Frontend load time < 3 seconds
- [ ] API responses < 1 second
- [ ] Images optimized and compressed
- [ ] No unused JavaScript/CSS bundles
- [ ] Lazy loading implemented where needed

### Security
- [ ] HTTPS enabled on both frontend and backend
- [ ] HSTS headers configured
- [ ] CSRF protection enabled
- [ ] SQL injection protection via Django ORM
- [ ] XSS protection via React escaping
- [ ] Password hashing with bcrypt
- [ ] JWT tokens secure (httpOnly not possible in this setup, use secure cookies)
- [ ] API rate limiting considered (optional)
- [ ] Admin panel only accessible to authorized users
- [ ] No sensitive data in logs

### CORS & Headers
- [ ] CORS properly configured (no `*`)
- [ ] Content-Type headers correct
- [ ] Security headers set
- [ ] No console errors about CORS

## Monitoring & Maintenance

### Logging
- [ ] Render logs accessible
- [ ] Vercel logs accessible
- [ ] Error tracking configured (optional: Sentry)
- [ ] Email alerts set up for failures (optional)

### Backups
- [ ] Database backup schedule configured
- [ ] Backup restoration tested
- [ ] Important data backed up

### Documentation
- [ ] Deployment guide created (DEPLOYMENT.md)
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Admin panel features documented
- [ ] Troubleshooting guide created

## Post-Deployment

### Monitoring (First 24 Hours)
- [ ] No errors in Render logs
- [ ] No errors in Vercel logs
- [ ] All API endpoints responding
- [ ] Database connections stable
- [ ] Email notifications working

### User Access
- [ ] Admin users created
- [ ] Admin passwords changed from defaults
- [ ] Team members trained on admin panel
- [ ] Documentation shared with team

### Final Verification
- [ ] All CRUD operations working
- [ ] File uploads successful
- [ ] Email notifications sent
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done (Chrome, Firefox, Safari, Edge)

## Rollback Plan

If issues occur:
1. Revert to previous Vercel deployment: Vercel Dashboard → Deployments → Rollback
2. Revert to previous Render deployment: Render Dashboard → Deploys → Rollback to this deploy
3. Restore database backup: Render PostgreSQL → Backups → Restore
4. Notify team of incident
5. Fix issue in codebase
6. Re-deploy both services

## Contact & Support

- **Backend Issues**: Check Render logs and database connection
- **Frontend Issues**: Check Vercel logs and network requests
- **CORS Issues**: Update CORS_ALLOWED_ORIGINS on backend
- **Database Issues**: Verify DATABASE_URL and run migrations
- **Email Issues**: Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- **Image Issues**: Verify CLOUDINARY credentials

---

## Sign-Off

- [ ] Project Lead reviewed checklist
- [ ] Technical Lead approved deployment
- [ ] All checklist items completed
- [ ] Deployment date: _______________
- [ ] Deployed by: _______________
- [ ] Verified by: _______________

**Notes:**
```




```
