'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const CATEGORIES = ['Ramadan', 'Hadith', 'Fiqh', 'Seerah', 'Family', 'Reflections', 'News', 'General'];

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'General', isPremium: false, status: 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.content) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/articles', form);
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create article.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title mb-6">New Article</h1>

      {error && <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Excerpt (short summary)</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Content</label>
          <textarea
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            rows={12}
            placeholder="Full article content. Basic HTML tags are supported (e.g. <p>, <b>, <i>, <h2>)."
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isPremium} onChange={(e) => update('isPremium', e.target.checked)} />
          Premium content (requires active membership to read)
        </label>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
          {saving ? 'Saving...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
}
