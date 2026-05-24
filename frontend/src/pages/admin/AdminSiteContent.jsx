import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminSiteContent,
  updateAdminSiteContent,
} from '../../services/api';
import { Loader2, Save, Plus, X } from 'lucide-react';

const emptyContent = {
  hero_badge: 'Prime Logic Tech is now live',
  hero_title: '',
  hero_subtitle: '',
  hero_description: '',
  hero_cta_text: 'Get Started',
  hero_cta_link: '#services',
  about_title: 'About Us',
  about_description: '',
  about_image_url: '',
  cta_title: 'Ready to Get Started?',
  cta_description: '',
  cta_button_text: 'Contact Us',
  cta_button_link: '/contact',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  footer_description: '',
  footer_email: '',
  footer_phone: '',
  footer_facebook_url: '',
  footer_twitter_url: '',
  footer_linkedin_url: '',
  footer_instagram_url: '',
  footer_github_url: '',
  stats: [{ label: 'Projects', value: '50+' }, { label: 'Clients', value: '30+' }],
  why_title: 'Why Choose Us',
  why_checklist: ['Expert Team', 'Quality Delivery'],
  trusted_by_title: 'Trusted By',
  trusted_by_logos: [],
};

export default function AdminSiteContent() {
  const [content, setContent] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminSiteContent();
      if (data) {
        setContent({
          hero_badge: data.hero_badge || '',
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_description: data.hero_description || '',
          hero_cta_text: data.hero_cta_text || 'Get Started',
          hero_cta_link: data.hero_cta_link || '#services',
          about_title: data.about_title || 'About Us',
          about_description: data.about_description || '',
          about_image_url: data.about_image_url || '',
          cta_title: data.cta_title || 'Ready to Get Started?',
          cta_description: data.cta_description || '',
          cta_button_text: data.cta_button_text || 'Contact Us',
          cta_button_link: data.cta_button_link || '/contact',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_address: data.contact_address || '',
          footer_description: data.footer_description || '',
          footer_email: data.footer_email || '',
          footer_phone: data.footer_phone || '',
          footer_facebook_url: data.footer_facebook_url || '',
          footer_twitter_url: data.footer_twitter_url || '',
          footer_linkedin_url: data.footer_linkedin_url || '',
          footer_instagram_url: data.footer_instagram_url || '',
          footer_github_url: data.footer_github_url || '',
          stats: Array.isArray(data.stats) ? data.stats : emptyContent.stats,
          why_title: data.why_title || 'Why Choose Us',
          why_checklist: Array.isArray(data.why_checklist) ? data.why_checklist : emptyContent.why_checklist,
          trusted_by_title: data.trusted_by_title || 'Trusted By',
          trusted_by_logos: Array.isArray(data.trusted_by_logos) ? data.trusted_by_logos : [],
        });
      }
    } catch {
      setError('Failed to load site content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function updateField(key, value) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  // Stats helpers
  function addStat() {
    setContent((prev) => ({ ...prev, stats: [...prev.stats, { label: '', value: '' }] }));
  }
  function removeStat(i) {
    setContent((prev) => ({ ...prev, stats: prev.stats.filter((_, idx) => idx !== i) }));
  }
  function updateStat(i, key, val) {
    setContent((prev) => {
      const stats = [...prev.stats];
      stats[i] = { ...stats[i], [key]: val };
      return { ...prev, stats };
    });
  }

  // Why checklist helpers
  function addWhyPoint() {
    setContent((prev) => ({ ...prev, why_checklist: [...prev.why_checklist, ''] }));
  }
  function removeWhyPoint(i) {
    setContent((prev) => ({ ...prev, why_checklist: prev.why_checklist.filter((_, idx) => idx !== i) }));
  }
  function updateWhyPoint(i, val) {
    setContent((prev) => {
      const checklist = [...prev.why_checklist];
      checklist[i] = val;
      return { ...prev, why_checklist: checklist };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateAdminSiteContent(content);
      setSuccess('Site content updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to save site content.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Site Content</h1>
        <span className="text-xs text-gray-500">All fields are saved as a single record</span>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-4 mb-4">{success}</div>}

      <form onSubmit={handleSave} className="space-y-8">
        {/* ── Hero Section ──────────────────────────────────── */}
        <Section title="Hero Section">
          <Field label="Badge" value={content.hero_badge} onChange={(v) => updateField('hero_badge', v)} />
          <Field label="Title" value={content.hero_title} onChange={(v) => updateField('hero_title', v)} />
          <Field label="Subtitle" value={content.hero_subtitle} onChange={(v) => updateField('hero_subtitle', v)} />
          <Field label="Description" value={content.hero_description} onChange={(v) => updateField('hero_description', v)} textarea />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CTA Text" value={content.hero_cta_text} onChange={(v) => updateField('hero_cta_text', v)} />
            <Field label="CTA Link" value={content.hero_cta_link} onChange={(v) => updateField('hero_cta_link', v)} />
          </div>
        </Section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <Section title="Stats">
          <p className="text-xs text-gray-500 mb-3">Key statistics displayed on the homepage.</p>
          {content.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input value={s.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
              <input value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
              <button type="button" onClick={() => removeStat(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
            </div>
          ))}
          <button type="button" onClick={addStat} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 mt-2">
            <Plus size={14} /> Add Stat
          </button>
        </Section>

        {/* ── About ─────────────────────────────────────────── */}
        <Section title="About Section">
          <Field label="Title" value={content.about_title} onChange={(v) => updateField('about_title', v)} />
          <Field label="Description" value={content.about_description} onChange={(v) => updateField('about_description', v)} textarea />
          <Field label="Image URL" value={content.about_image_url} onChange={(v) => updateField('about_image_url', v)} />
        </Section>

        {/* ── Why Choose Us ─────────────────────────────────── */}
        <Section title="Why Choose Us">
          <Field label="Section Title" value={content.why_title} onChange={(v) => updateField('why_title', v)} />
          {content.why_checklist.map((point, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input value={point} onChange={(e) => updateWhyPoint(i, e.target.value)} placeholder="Checklist item" className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500" />
              <button type="button" onClick={() => removeWhyPoint(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
            </div>
          ))}
          <button type="button" onClick={addWhyPoint} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 mt-2">
            <Plus size={14} /> Add Point
          </button>
        </Section>

        {/* ── Trusted By ────────────────────────────────────── */}
        <Section title="Trusted By">
          <Field label="Section Title" value={content.trusted_by_title} onChange={(v) => updateField('trusted_by_title', v)} />
          <p className="text-xs text-gray-500 mb-2">Logo image URLs (one per line)</p>
          <textarea
            value={content.trusted_by_logos.join('\n')}
            onChange={(e) => updateField('trusted_by_logos', e.target.value.split('\n').filter(Boolean))}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500"
            placeholder="https://example.com/logo1.png&#10;https://example.com/logo2.png"
          />
        </Section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <Section title="Call to Action">
          <Field label="Title" value={content.cta_title} onChange={(v) => updateField('cta_title', v)} />
          <Field label="Description" value={content.cta_description} onChange={(v) => updateField('cta_description', v)} textarea />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Button Text" value={content.cta_button_text} onChange={(v) => updateField('cta_button_text', v)} />
            <Field label="Button Link" value={content.cta_button_link} onChange={(v) => updateField('cta_button_link', v)} />
          </div>
        </Section>

        {/* ── Contact Info ──────────────────────────────────── */}
        <Section title="Contact Information">
          <Field label="Email" value={content.contact_email} onChange={(v) => updateField('contact_email', v)} />
          <Field label="Phone" value={content.contact_phone} onChange={(v) => updateField('contact_phone', v)} />
          <Field label="Address" value={content.contact_address} onChange={(v) => updateField('contact_address', v)} textarea />
        </Section>

        {/* ── Footer ────────────────────────────────────────── */}
        <Section title="Footer">
          <Field label="Description" value={content.footer_description} onChange={(v) => updateField('footer_description', v)} textarea />
          <Field label="Email" value={content.footer_email} onChange={(v) => updateField('footer_email', v)} />
          <Field label="Phone" value={content.footer_phone} onChange={(v) => updateField('footer_phone', v)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook URL" value={content.footer_facebook_url} onChange={(v) => updateField('footer_facebook_url', v)} />
            <Field label="Twitter URL" value={content.footer_twitter_url} onChange={(v) => updateField('footer_twitter_url', v)} />
            <Field label="LinkedIn URL" value={content.footer_linkedin_url} onChange={(v) => updateField('footer_linkedin_url', v)} />
            <Field label="Instagram URL" value={content.footer_instagram_url} onChange={(v) => updateField('footer_instagram_url', v)} />
            <Field label="GitHub URL" value={content.footer_github_url} onChange={(v) => updateField('footer_github_url', v)} />
          </div>
        </Section>

        {/* ── Save ──────────────────────────────────────────── */}
        <div className="flex justify-end border-t border-gray-800 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Reusable sub-components ───────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500"
        />
      )}
    </div>
  );
}