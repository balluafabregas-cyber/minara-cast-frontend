'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus, X, Star } from 'lucide-react';
import api from '@/lib/api';

interface Quote {
  _id: string;
  text: string;
  source?: string;
  category?: string;
  isQuoteOfTheDay: boolean;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ text: '', source: '', category: '' });

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/quotes', { params: { limit: 50 } });
      setQuotes(res.data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.text) {
      setError('Quote text is required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/quotes', form);
      setShowForm(false);
      setForm({ text: '', source: '', category: '' });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create quote.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this quote?')) return;
    await api.delete(`/quotes/${id}`);
    load();
  }

  async function setAsQuoteOfDay(id: string) {
    await api.patch(`/quotes/${id}`, { isQuoteOfTheDay: true });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Daily Quotes</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !px-4 text-sm">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'Add Quote'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-navy-800">
          {error && <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}
          <textarea
            placeholder="Quote text"
            rows={3}
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Source (e.g. Quran 2:153)"
              value={form.source}
              onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
            />
            <input
              placeholder="Category (optional)"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Add Quote'}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      <div className="space-y-2">
        {quotes.map((q) => (
          <div key={q._id} className="flex items-start justify-between gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <div>
              <p className="italic">&ldquo;{q.text}&rdquo;</p>
              {q.source && <p className="mt-1 text-xs text-gold-500">— {q.source}</p>}
              {q.isQuoteOfTheDay && <span className="mt-1 inline-block rounded-full bg-gold-500/20 px-2 py-0.5 text-xs text-gold-600">Quote of the Day</span>}
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => setAsQuoteOfDay(q._id)} title="Set as Quote of the Day" className="rounded-lg p-2 text-black/30 hover:bg-black/5 dark:hover:bg-white/10">
                <Star size={16} fill={q.isQuoteOfTheDay ? 'currentColor' : 'none'} className={q.isQuoteOfTheDay ? 'text-gold-500' : ''} />
              </button>
              <button onClick={() => handleDelete(q._id)} title="Delete" className="rounded-lg p-2 text-red-500 hover:bg-red-500/10">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
