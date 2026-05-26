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
  fetchAdminUsers,
  fetchAdminImages,
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
  Image,
  UserCog,
  Eye,
  AlertCircle,
} from 'lucide-react';
import StatCard from '../../components/StatCard';

const cards = [
  { label: 'Projects', key: 'projects', icon: Briefcase, color: 'bg-blue-500/10 text-blue-400', path: '/secret-admin/projects' },
  { label: 'Team', key: 'team', icon: Users, color: 'bg-green-500/10 text-green-400', path: '/secret-admin/team' },
  { label: 'Services', key: 'services', icon: Settings, color: 'bg-purple-500/10 text-purple-400', path: '/secret-admin/services' },
  { label: 'Testimonials', key: 'testimonials', icon: Star, color: 'bg-yellow-500/10 text-yellow-400', path: '/secret-admin/testimonials' },
  { label: 'Jobs', key: 'jobs', icon: Megaphone, color: 'bg-pink-500/10 text-pink-400', path: '/secret-admin/jobs' },
  { label: 'Contacts', key: 'contacts', icon: Mail, color: 'bg-orange-500/10 text-orange-400', path: '/secret-admin/contacts' },
  { label: 'Newsletter', key: 'newsletter', icon: Bell, color: 'bg-indigo-500/10 text-indigo-400', path: '/secret-admin/newsletter' },
  { label: 'Images', key: 'images', icon: Image, color: 'bg-cyan-500/10 text-cyan-400', path: '/secret-admin/images' },
  { label: 'Admin Users', key: 'adminUsers', icon: UserCog, color: 'bg-red-500/10 text-red-400', path: '/secret-admin/users' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [unreadContacts, setUnreadContacts] = useState([]);
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
          adminUsers,
          images,
        ] = await Promise.all([
          fetchAdminProjects(),
          fetchAdminTeam(),
          fetchAdminServices(),
          fetchAdminTestimonials(),
          fetchAdminJobs(),
          fetchAdminContacts(),
          fetchAdminNewsletter(),
          fetchAdminUsers(),
          fetchAdminImages(),
        ]);

        // Filter unread contacts
        const unread = contacts.filter(c => !c.is_read).slice(0, 5);
        
        setCounts({
          projects: projects.length,
          team: team.length,
          services: services.length,
          testimonials: testimonials.length,
          jobs: jobs.length,
          contacts: contacts.length,
          newsletter: newsletter.length,
          images: images.length,
          adminUsers: adminUsers.length,
        });
        
        setUnreadContacts(unread);
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

      {/* Unread Contact Messages */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-400" />
            Unread Messages
          </h2>
          {unreadContacts.length > 0 && (
            <Link
              to="/secret-admin/contacts"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {unreadContacts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <Mail size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No unread messages</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-gray-900 border border-orange-500/30 rounded-xl p-4 hover:border-orange-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center gap-2">
                      <Eye size={16} className="text-orange-400" />
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{contact.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                  {contact.message}
                </p>
                <div className="flex items-center justify-between">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {contact.email}
                  </a>
                  <Link
                    to="/secret-admin/contacts"
                    className="text-xs bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    Reply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
