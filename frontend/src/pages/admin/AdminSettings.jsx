import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Database, Globe } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings & Configuration</h1>
      </div>

      {/* User Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield size={20} className="text-cyan-400" />
          Your Account
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Username</p>
            <p className="text-gray-100">{user?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-gray-100">{user?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database size={20} className="text-cyan-400" />
          System Information
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">API Base URL</p>
            <p className="text-gray-100 font-mono text-sm break-all">{apiUrl}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Frontend Version</p>
            <p className="text-gray-100">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Backend Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-cyan-400" />
          Deployment Information
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Frontend Host</p>
            <p className="text-gray-100">Vercel</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Backend Host</p>
            <p className="text-gray-100">Render</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Database</p>
            <p className="text-gray-100">PostgreSQL on Render</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Media Storage</p>
            <p className="text-gray-100">Cloudinary CDN</p>
          </div>
        </div>
      </div>

      {/* Admin Preferences */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={20} className="text-cyan-400" />
          Admin Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-400">Currently enabled</p>
            </div>
            <div className="w-12 h-6 bg-cyan-600 rounded-full flex items-center p-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-gray-400">8 hours of inactivity</p>
            </div>
            <p className="text-gray-400">Auto</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-400">Desktop & Email</p>
            </div>
            <p className="text-gray-400">Enabled</p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield size={20} className="text-cyan-400" />
          Security
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm font-medium mb-2">JWT Token</p>
            <p className="text-xs text-gray-400">
              Your authentication token is automatically refreshed when expired. Never share your token with anyone.
            </p>
          </div>

          <div className="p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm font-medium mb-2">Password Requirements</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Minimum 8 characters</li>
              <li>• Mix of uppercase and lowercase letters recommended</li>
              <li>• Numbers and special characters recommended</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-900 rounded border border-gray-700">
            <p className="text-sm font-medium mb-2">API Security</p>
            <p className="text-xs text-gray-400">
              All API requests use HTTPS with JWT authentication. CORS is configured for approved origins only.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Visit Website
          </a>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            About Page
          </a>
        </div>
      </div>
    </div>
  );
}
