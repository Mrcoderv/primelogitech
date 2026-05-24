import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminJobs,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
} from '../../services/api';
import { Megaphone, Plus, Edit3, Trash2, Loader2, X } from 'lucide-react';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

export default function AdminJobs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', department: '', location: '', job_type: 'Full-Time',
    description: '', requirements: '', is_open: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setItems(await fetchAdminJobs()); }
    catch { setError('Failed to load jobs.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ title: '', department: '', location: '', job_type: 'Full-Time', description: '', requirements: '', is_open: true });
  }
  function openNew() { resetForm(); setEditing('new'); }
  function openEdit(item) {
    setForm({
      title: item.title || '', department: item.department || '', location: item.location || '',
      job_type: item.job_type || 'Full-Time', description: item.description || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join(', ') : (item.requirements || ''),
      is_open: item.is_open ?? true,
    });
    setEditing(item.id);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editing === 'new') await createAdminJob(payload);
      else await updateAdminJob(editing, payload);
      setEditing(null);
      await load();
    } catch { setError('Failed to save job.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this job?')) return;
    try { await deleteAdminJob(id); await load(); }
    catch { setError('Failed to delete.'); }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Openings</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Job
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">{error}</div>}

      {editing && (
        <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing === 'new' ? 'New Job' : 'Edit Job'}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Job Type</label>
              <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500">
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Requirements (comma separated)</label>
            <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} placeholder="React, Python, PostgreSQL" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.is_open} onChange={(e) => setForm({ ...form, is_open: e.target.checked })} className="rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
            Open for applications
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white text-sm font-medium rounded-lg transition-colors">
              {saving && <Loader2 className="animate-spin" size={14} />}
              {editing === 'new' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Megaphone size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No jobs yet</p>
          <p className="text-sm">Click "Add Job" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  {!item.is_open && <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">Closed</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.department} &middot; {item.job_type} &middot; {item.location}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-cyan-400"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}