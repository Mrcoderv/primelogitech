import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} from '../../services/api';
import { Briefcase, Plus, Edit3, Trash2, Loader2, X, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../../components/BrandIcons';

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', tech_stack: '',
    live_url: '', github_url: '', pinned: false, order: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await fetchAdminProjects());
    } catch { setError('Failed to load projects.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ title: '', category: '', description: '', tech_stack: '', live_url: '', github_url: '', pinned: false, order: 0 });
  }

  function openNew() {
    resetForm();
    setEditing('new');
  }

  function openEdit(item) {
    setForm({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : (item.tech_stack || ''),
      live_url: item.live_url || '',
      github_url: item.github_url || '',
      pinned: item.pinned ?? false,
      order: item.order ?? 0,
    });
    setEditing(item.id);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        order: Number(form.order),
        pinned: Boolean(form.pinned),
      };
      if (editing === 'new') {
        await createAdminProject(payload);
      } else {
        await updateAdminProject(editing, payload);
      }
      setEditing(null);
      await load();
    } catch { setError('Failed to save project.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteAdminProject(id);
      await load();
    } catch { setError('Failed to delete project.'); }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">{error}</div>}

      {/* Inline form */}
      {editing && (
        <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing === 'new' ? 'New Project' : 'Edit Project'}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tech Stack (comma separated)</label>
              <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Django, PostgreSQL" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Live URL</label>
              <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
              <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
              Pinned
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white text-sm font-medium rounded-lg transition-colors">
              {saving && <Loader2 className="animate-spin" size={14} />}
              {editing === 'new' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Briefcase size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm">Click "Add Project" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  {item.pinned && <span className="text-xs bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">Pinned</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.live_url && <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400"><ExternalLink size={16} /></a>}
                {item.github_url && <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400"><GithubIcon className="h-4 w-4" /></a>}
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