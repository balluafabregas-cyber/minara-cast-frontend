'use client';

import { useEffect, useState } from 'react';
import { Users, Crown, Clock, Wallet, PlayCircle, ImageIcon, FileText, GraduationCap } from 'lucide-react';
import api from '@/lib/api';

interface Overview {
  totalUsers: number;
  onlineUsers: number;
  premiumUsers: number;
  trialUsers: number;
  pendingPayments: number;
  totalRevenue: number;
  content: { videos: number; images: number; articles: number; quotes: number; courses: number; channels: number };
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/overview')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load overview.'));
  }, []);

  const cards = data
    ? [
        { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'bg-emerald-600' },
        { label: 'Online Now', value: data.onlineUsers, icon: Users, color: 'bg-emerald-500' },
        { label: 'Premium Members', value: data.premiumUsers, icon: Crown, color: 'bg-gold-500' },
        { label: 'On Free Trial', value: data.trialUsers, icon: Clock, color: 'bg-purple-500' },
        { label: 'Pending Payments', value: data.pendingPayments, icon: Wallet, color: 'bg-red-500' },
        { label: 'Total Revenue (RWF)', value: data.totalRevenue.toLocaleString(), icon: Wallet, color: 'bg-navy-700' },
      ]
    : [];

  const contentCards = data
    ? [
        { label: 'Videos', value: data.content.videos, icon: PlayCircle },
        { label: 'Images', value: data.content.images, icon: ImageIcon },
        { label: 'Articles', value: data.content.articles, icon: FileText },
        { label: 'Courses', value: data.content.courses, icon: GraduationCap },
      ]
    : [];

  return (
    <div>
      <h1 className="section-title mb-6">Admin Overview</h1>

      {error && <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>}

      {!data && !error && <p className="text-sm text-black/40">Loading...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cards.map((c) => (
              <div key={c.label} className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
                <span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white ${c.color}`}>
                  <c.icon size={18} />
                </span>
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs text-black/50 dark:text-white/50">{c.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-4 mt-10 text-lg font-semibold">Content</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {contentCards.map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
                <c.icon size={20} className="text-emerald-600" />
                <div>
                  <p className="text-lg font-bold">{c.value}</p>
                  <p className="text-xs text-black/50 dark:text-white/50">{c.label}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
