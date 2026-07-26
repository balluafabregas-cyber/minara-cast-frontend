'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Bookmark, Bell, MessageSquare, Clock, Wallet } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

function useCountdown(endDate?: string) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;
    const tick = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return remaining;
}

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const countdown = useCountdown(user?.membership?.endDate);

  useEffect(() => {
    if (!user) {
      api.get('/auth/me').then((res) => setUser(res.data.user)).catch(() => {});
    }
  }, [user, setUser]);

  const expired = user ? new Date(user.membership.endDate).getTime() < Date.now() : false;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-16">
      <h1 className="section-title mb-8">Welcome back{user ? `, ${user.fullName.split(' ')[0]}` : ''}</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card md:col-span-2 bg-gradient-to-br from-navy-900 to-emerald-900 text-white">
          <div className="flex items-center gap-2 text-gold-400">
            <Crown size={20} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              {user?.membership?.type === 'trial' ? 'Free Trial' : 'Membership'}
            </span>
          </div>

          {expired ? (
            <div className="mt-4">
              <p className="text-lg font-semibold text-red-300">Your access has expired.</p>
              <p className="mt-1 text-sm text-white/60">Upgrade now to continue enjoying premium content.</p>
              <Link href="/premium" className="btn-gold mt-4 inline-flex">Renew Now</Link>
            </div>
          ) : (
            <>
              <p className="mt-3 text-sm text-white/60">Time remaining on your current plan:</p>
              <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Min', value: countdown.minutes },
                  { label: 'Sec', value: countdown.seconds },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl bg-white/10 py-3">
                    <div className="font-display text-2xl font-bold text-gold-400">{String(c.value).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase text-white/50">{c.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/premium" className="btn-gold mt-5 inline-flex">Upgrade / Renew</Link>
            </>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card flex flex-col gap-3 border border-black/5 bg-white text-navy-900 dark:border-white/10 dark:bg-navy-800 dark:text-white">
          {[
            { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/bookmarks' },
            { icon: Wallet, label: 'Payment History', href: '/dashboard/payments' },
            { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
            { icon: MessageSquare, label: 'Messages', href: '/chat' },
            { icon: Clock, label: 'Activity History', href: '/dashboard/activity' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-black/5 dark:hover:bg-white/10">
              <item.icon size={18} className="text-emerald-500" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
