'use client';

import { useEffect, useState } from 'react';
import { Upload, Trash2, Eye, Plus, X } from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = ['quran', 'hadith', 'ramadan', 'islamic-history', 'islamic-stories', 'lectures', 'courses', 'kids', 'nasheeds', 'community', 'general'];

interface Video {
  _id: string;
  title: string;
  category: string;
  status: string;
  isPremium: boolean;
  views: number;
  thumbnail?: { url: string };
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'general', isPremium: false, status: 'draft' });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/videos', { params: { limit: 50 } });
      setVideos(res.data.videos || []);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title || !file) {
      setError('Title and a video file are required.');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      data.append('video', file);
      await api.post('/videos', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setForm({ title: '', description: '', category: 'general', isPremium: false, status: 'draft' });
      setFile(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this video permanently?')) return;
    await api.delete(`/videos/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Videos</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !px-4 text-sm">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'Upload Video'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleUpload} className="mb-6 space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-navy-800">
          {error && <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}
          <input
            placeholder="Video title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 py-6 text-sm text-black/50 hover:border-emerald-500 dark:border-white/20 dark:text-white/50">
            <Upload size={16} />
            {file ? file.name : 'Click to select video file (MP4, MOV, WEBM)'}
            <input type="file" accept="video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm((f) => ({ ...f, isPremium: e.target.checked }))} />
            Premium content
          </label>
          <button type="submit" disabled={uploading} className="btn-primary w-full justify-center disabled:opacity-60">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <div key={v._id} className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <p className="truncate font-semibold">{v.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/40">
              <span className="capitalize">{v.status}</span> · <span>{v.category}</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {v.views}</span>
            </div>
            <button onClick={() => handleDelete(v._id)} className="mt-3 flex items-center gap-1 text-xs font-medium text-red-500 hover:underline">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
