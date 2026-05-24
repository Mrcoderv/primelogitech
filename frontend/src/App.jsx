import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContacts from './pages/admin/AdminContacts';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminProjects from './pages/admin/AdminProjects';
import AdminTeam from './pages/admin/AdminTeam';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminJobs from './pages/admin/AdminJobs';
import AdminSiteContent from './pages/admin/AdminSiteContent';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ──────────────────────────────────────── */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="careers" element={<Careers />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* ── Admin Login (no protection) ────────────────────────── */}
          <Route path="/secret-admin" element={<AdminLogin />} />

          {/* ── Admin Dashboard (protected) ────────────────────────── */}
          <Route
            path="/secret-admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Admin Management Pages (protected, no layout wrapper) ─ */}
          <Route
            path="/secret-admin/contacts"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminContacts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/newsletter"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminNewsletter />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProjects />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/team"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTeam />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/services"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminServices />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTestimonials />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/jobs"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminJobs />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secret-admin/site-content"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSiteContent />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;