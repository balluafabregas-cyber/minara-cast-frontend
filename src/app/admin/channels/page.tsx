'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, X, Upload } from 'lucide-react';
import api from '@/lib/api';

interface Channel {
  _id: string;
  name: string;
  category?: string;
  logo?: { url: string };
  followers: string[];
}

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/channels');
      setChannels(res.data.channels || []);
    } catch {
      setChannels([]);
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
    if (!form.name) {
      setError('Channel name is required.');
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      if (file) data.append('logo', file);
      await api.post('/channels', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setForm({ name: '', description: '', category: '' });
      setFile(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create channel.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this channel?')) return;
    await api.delete(`/channels/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Channels</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !px-4 text-sm">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'New Channel'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-navy-800">
          {error && <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}
          <input
            placeholder="Channel name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-white/20"
          />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 py-6 text-sm text-black/50 hover:border-emerald-500 dark:border-white/20 dark:text-white/50">
            <Upload size={16} />
            {file ? file.name : 'Click to select a logo image (optional)'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Create Channel'}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((c) => (
          <div key={c._id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            {c.logo?.url ? (
              <Image src={c.logo.url} alt={c.name} width={44} height={44} className="rounded-full object-cover" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {c.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="text-xs text-black/40">{c.followers?.length || 0} followers</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-500/10">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
