'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, MessageSquare, PlayCircle, Image as ImageIcon, Quote,
  CreditCard, Users, GraduationCap, Tv, Sparkles,
} from 'lucide-react';

const ITEMS = [
  { href: '/quran', label: 'Quran', icon: BookOpen, color: 'from-emerald-500 to-emerald-700' },
  { href: '/chat', label: 'Live Chat', icon: MessageSquare, color: 'from-purple-500 to-purple-700' },
  { href: '/videos', label: 'Videos', icon: PlayCircle, color: 'from-pink-500 to-pink-700' },
  { href: '/gallery', label: 'Images', icon: ImageIcon, color: 'from-gold-500 to-gold-700' },
  { href: '/quotes', label: 'Daily Quotes', icon: Quote, color: 'from-navy-500 to-navy-700' },
  { href: '/premium', label: 'Premium', icon: CreditCard, color: 'from-emerald-600 to-gold-500' },
  { href: '/community', label: 'Community', icon: Users, color: 'from-purple-600 to-pink-600' },
  { href: '/courses', label: 'Courses', icon: GraduationCap, color: 'from-gold-600 to-emerald-600' },
  { href: '/channels', label: 'Channels', icon: Tv, color: 'from-pink-600 to-purple-600' },
];

export default function QuickAccess() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-emerald-500">Quick Access</span>
        <h2 className="section-title mt-2">Everything You Need</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={item.href}
              className="group flex flex-col items-center justify-center gap-3 rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-navy-800"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <item.icon size={26} />
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
