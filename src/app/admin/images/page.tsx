'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Plus, X } from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = ['mosques', 'quran', 'ramadan', 'islamic-art', 'nature', 'islamic-quotes', 'events', 'community', 'general'];

interface ImageAsset {
  _id: string;
  title?: string;
  url: string;
  category: string;
  isPremium: boolean;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', category: 'general', isPremium: false });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/images', { params: { limit: 60 } });
      setImages(res.data.images || []);
    } catch {
      setImages([]);
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
    if (!file) {
      setError('Please select an image file.');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      data.append('image', file);
      await api.post('/images', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setForm({ title: '', category: 'general', isPremium: false });
      setFile(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this image permanently?')) return;
    await api.delete(`/images/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Gallery</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !px-4 text-sm">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleUpload} className="mb-6 space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-navy-800">
          {error && <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 py-6 text-sm text-black/50 hover:border-emerald-500 dark:border-white/20 dark:text-white/50">
            <Upload size={16} />
            {file ? file.name : 'Click to select an image (JPG, PNG, WEBP)'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((img) => (
          <div key={img._id} className="group relative aspect-square overflow-hidden rounded-xl">
            <Image src={img.url} alt={img.title || 'Gallery image'} fill className="object-cover" />
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
