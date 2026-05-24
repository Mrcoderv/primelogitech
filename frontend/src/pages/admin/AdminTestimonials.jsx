import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from '../../services/api';
import { Star, Plus, Edit3, Trash2, Loader2, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', role: '', company: '', quote: '', avatar_url: '', order: 0, is_active: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setItems(await fetchAdminTestimonials()); }
    catch { setError('Failed to load testimonials.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() { setForm({ name: '', role: '', company: '', quote: '', avatar_url: '', order: 0, is_active: true }); }
  function openNew() { resetForm(); setEditing('new'); }
  function openEdit(item) {
    setForm({
      name: item.name || '', role: item.role || '', company: item.company || '',
      quote: item.quote || '', avatar_url: item.avatar_url || '',
      order: item.order ?? 0, is_active: item.is_active ?? true,
    });
    setEditing(item.id);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing === 'new') await createAdminTestimonial(payload);
      else await updateAdminTestimonial(editing, payload);
      setEditing(null);
      await load();
    } catch { setError('Failed to save testimonial.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this testimonial?')) return;
    try { await deleteAdminTestimonial(id); await load(); }
    catch { setError('Failed to delete.'); }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">{error}</div>}

      {editing && (
        <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Avatar URL</label>
              <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
            Active
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
          <Star size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No testimonials yet</p>
          <p className="text-sm">Click "Add Testimonial" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{item.name}</p>
                  {!item.is_active && <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Inactive</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.role}{item.company ? ` at ${item.company}` : ''}</p>
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