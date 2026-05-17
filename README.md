# Prime Logic Tech

Prime Logic Tech is a modern, premium IT startup providing end-to-end digital solutions, including web development, mobile app development, UI/UX design, SEO optimization, cloud solutions, and AI automation.

## Founders
- **Prasiddha Gyawali** - CEO & Founder
- **Pralhad Gyawali** - Co-Founder
- **Binit Raj Pandey** - Co-Founder
- **Raghav Panthi** - Junior Co-Founder

## Location
Kathmandu, Nepal

## Project Structure

This repository contains the source code for the Prime Logic Tech website.

- `frontend/` - React frontend application
- `backend/` - Backend services (if applicable)

## Frontend Documentation

The frontend is a fully responsive, modern React application built with Vite and styled using Tailwind CSS v4.

### Tech Stack
- React 19
- Vite 8
- Tailwind CSS v4
- Framer Motion (for smooth animations)
- React Router DOM v7 (for seamless routing)
- Lucide React (for iconography)

### Getting Started

To run the frontend application locally:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`.

### Building for Production

To build the application for production deployment:

```bash
cd frontend
npm run build
```
This will generate optimized static assets in the `dist/` directory.

## API (Mock)

The backend exposes simple mock JSON endpoints (no database yet):

- `GET /api/services/`
- `GET /api/projects/`
- `GET /api/testimonials/`
- `GET /api/team/`
- `GET /api/jobs/`

## Contact Form

The contact form on the site uses Formspree for submission. The live Formspree endpoint is already wired in the frontend and does not require a backend mailer.

## Careers / Jobs

The careers page currently displays a placeholder message: "No job available — we will update in future".

## Security & Production Notes

- Settings in `backend/config/settings.py` include recommended security flags which become active when `DEBUG=False`.
- Before deploying to production:
   - Set `DEBUG=False` and configure `ALLOWED_HOSTS` appropriately.
   - Use environment variables for `SECRET_KEY` and other secrets.
   - Configure SSL/TLS (HTTPS) and a proper domain.
   - Use a production-grade database and persistent storage for media/static files.

## Branch & Deployment

Changes have been prepared to be pushed on branch `rvBRANCH`.

To create the branch locally, commit your changes and push:

```bash
git checkout -b rvBRANCH
git add .
git commit -m "Site: add mock APIs, Formspree contact, careers placeholder, security defaults"
git push -u origin rvBRANCH
```

If push fails due to authentication, ensure your local git has credentials or an SSH key configured for GitHub.
