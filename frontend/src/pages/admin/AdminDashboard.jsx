import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminProjects,
  fetchAdminTeam,
  fetchAdminServices,
  fetchAdminTestimonials,
  fetchAdminJobs,
  fetchAdminContacts,
  fetchAdminNewsletter,
} from '../../services/api';
import {
  Briefcase,
  Users,
  Settings,
  Star,
  Megaphone,
  Mail,
  Bell,
  FileText,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const cards = [
  { label: 'Projects', key: 'projects', icon: Briefcase, color: 'bg-blue-500/10 text-blue-400', path: '/secret-admin/projects' },
  { label: 'Team', key: 'team', icon: Users, color: 'bg-green-500/10 text-green-400', path: '/secret-admin/team' },
  { label: 'Services', key: 'services', icon: Settings, color: 'bg-purple-500/10 text-purple-400', path: '/secret-admin/services' },
  { label: 'Testimonials', key: 'testimonials', icon: Star, color: 'bg-yellow-500/10 text-yellow-400', path: '/secret-admin/testimonials' },
  { label: 'Jobs', key: 'jobs', icon: Megaphone, color: 'bg-pink-500/10 text-pink-400', path: '/secret-admin/jobs' },
  { label: 'Contacts', key: 'contacts', icon: Mail, color: 'bg-orange-500/10 text-orange-400', path: '/secret-admin/contacts' },
  { label: 'Newsletter', key: 'newsletter', icon: Bell, color: 'bg-indigo-500/10 text-indigo-400', path: '/secret-admin/newsletter' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [
          projects,
          team,
          services,
          testimonials,
          jobs,
          contacts,
          newsletter,
        ] = await Promise.all([
          fetchAdminProjects(),
          fetchAdminTeam(),
          fetchAdminServices(),
          fetchAdminTestimonials(),
          fetchAdminJobs(),
          fetchAdminContacts(),
          fetchAdminNewsletter(),
        ]);

        setCounts({
          projects: projects.length,
          team: team.length,
          services: services.length,
          testimonials: testimonials.length,
          jobs: jobs.length,
          contacts: contacts.length,
          newsletter: newsletter.length,
        });
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              to={card.path}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  <Icon size={22} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-600 group-hover:text-gray-400 transition-colors"
                />
              </div>
              <p className="text-2xl font-bold text-white">
                {counts?.[card.key] ?? 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            to="/secret-admin/site-content"
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-colors"
          >
            <FileText size={20} className="text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Edit Site Content</p>
              <p className="text-xs text-gray-500">Hero, About, CTA, Footer</p>
            </div>
          </Link>
          <Link
            to="/secret-admin/projects"
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-colors"
          >
            <Briefcase size={20} className="text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Add Project</p>
              <p className="text-xs text-gray-500">Showcase your latest work</p>
            </div>
          </Link>
          <Link
            to="/secret-admin/team"
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-colors"
          >
            <Users size={20} className="text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Add Team Member</p>
              <p className="text-xs text-gray-500">Update your team</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}