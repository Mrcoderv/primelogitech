import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminContacts,
  fetchAdminContact,
} from '../../services/api';
import { Mail, ChevronDown, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminContacts();
      setContacts(data);
    } catch {
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function openDetail(id) {
    setSelected(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await fetchAdminContact(id);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <span className="text-sm text-gray-400">{contacts.length} total</span>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Mail size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => {
            const isOpen = selected === c.id;
            return (
              <div
                key={c.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Summary row */}
                <button
                  onClick={() => openDetail(c.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        c.is_read ? 'bg-gray-600' : 'bg-cyan-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {c.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {c.subject || '(no subject)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Detail panel */}
                {isOpen && (
                  <div className="border-t border-gray-800 px-5 py-4">
                    {detailLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-cyan-400" size={20} />
                      </div>
                    ) : detail ? (
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-500">Name</span>
                            <p className="text-white">{detail.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Email</span>
                            <p className="text-white">{detail.email}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Subject</span>
                          <p className="text-white">{detail.subject}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Message</span>
                          <p className="text-white whitespace-pre-wrap">{detail.message}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                          <span>
                            Received: {new Date(detail.created_at).toLocaleString()}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              detail.is_read ? 'text-green-400' : 'text-yellow-400'
                            }`}
                          >
                            {detail.is_read ? <Eye size={14} /> : <EyeOff size={14} />}
                            {detail.is_read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Failed to load details.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}