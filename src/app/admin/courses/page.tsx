'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = ['quran', 'tajweed', 'arabic', 'hadith', 'aqeedah', 'fiqh', 'seerah', 'ramadan', 'islamic-history', 'family', 'children', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

interface Course {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  isPremium: boolean;
  status: string;
  lessons: any[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: 'general', difficulty: 'beginner', isPremium: false, status: 'draft',
  });

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/courses', { params: { limit: 50 } });
      setCourses(res.data.courses || []);
    } catch {
      setCourses([]);
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
    if (!form.title) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/courses', { ...form, lessons: [] });
      setShowForm(false);
      setForm({ title: '', description: '', category: 'general', difficulty: 'beginner', isPremium: false, status: 'draft' });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Courses</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !px-4 text-sm">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'New Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-navy-800">
          {error && <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}
          <input
            placeholder="Course title"
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
          <div className="grid grid-cols-3 gap-3">
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-xl border border-black/10 bg-transparent px-3 py-2.5 text-sm outline-none dark:border-white/20">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} className="rounded-xl border border-black/10 bg-transparent px-3 py-2.5 text-sm outline-none dark:border-white/20">
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="rounded-xl border border-black/10 bg-transparent px-3 py-2.5 text-sm outline-none dark:border-white/20">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm((f) => ({ ...f, isPremium: e.target.checked }))} />
            Premium course
          </label>
          <p className="text-xs text-black/40">Lessons (videos/PDFs per lesson) can be added after creating the course, via the API — a dedicated lesson-builder screen isn&apos;t built yet.</p>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Create Course'}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c._id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-xs text-black/40">{c.category} · {c.difficulty} · {c.lessons?.length || 0} lessons · {c.status}</p>
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
