'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Star, Pin } from 'lucide-react';
import api from '@/lib/api';

interface Article {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category?: string;
  isPremium: boolean;
  featured: boolean;
  pinned: boolean;
  views: number;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/articles', { params: { limit: 50, status: undefined } });
      setArticles(res.data.articles || []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setMessage('Article deleted.');
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to delete.');
    }
  }

  async function toggleField(article: Article, field: 'featured' | 'pinned') {
    try {
      await api.patch(`/articles/${article._id}`, { [field]: !article[field] });
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update.');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Articles</h1>
        <Link href="/admin/articles/new" className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={14} /> New Article
        </Link>
      </div>

      {message && <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600">{message}</div>}
      {loading && <p className="text-sm text-black/40">Loading...</p>}
      {!loading && articles.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-black/40 dark:border-white/10">
          No articles yet. Create your first one.
        </div>
      )}

      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{a.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/40 dark:text-white/40">
                <span className="capitalize">{a.status}</span>
                {a.category && <span>· {a.category}</span>}
                {a.isPremium && <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-gold-600">Premium</span>}
                <span className="flex items-center gap-1"><Eye size={12} /> {a.views}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleField(a, 'featured')} title="Toggle featured" className={`rounded-lg p-2 ${a.featured ? 'text-gold-500' : 'text-black/30 hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <Star size={16} fill={a.featured ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => toggleField(a, 'pinned')} title="Toggle pinned" className={`rounded-lg p-2 ${a.pinned ? 'text-emerald-600' : 'text-black/30 hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <Pin size={16} fill={a.pinned ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => handleDelete(a._id)} title="Delete" className="rounded-lg p-2 text-red-500 hover:bg-red-500/10">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
