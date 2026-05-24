import { useState, useEffect, useCallback } from 'react';
import { fetchAdminNewsletter } from '../../services/api';
import { Bell, Loader2, Search } from 'lucide-react';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminNewsletter();
      setSubscribers(data);
    } catch {
      setError('Failed to load subscribers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = search
    ? subscribers.filter(
        (s) =>
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <span className="text-sm text-gray-400">{subscribers.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">
            {search ? 'No matching subscribers' : 'No subscribers yet'}
          </p>
          <p className="text-sm">
            {search ? 'Try a different search term.' : 'Newsletter signups will appear here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 text-white">{s.email}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.is_active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(s.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}