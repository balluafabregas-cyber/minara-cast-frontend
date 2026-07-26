'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlayCircle, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-hero-gradient pt-24">
      <div className="bg-islamic-pattern pointer-events-none absolute inset-0 opacity-10" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl animate-float" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-float" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="glass mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
            Islamic Digital Platform
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Strengthen Your Faith with{' '}
            <span className="bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">MINARA CAST</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/70">
            Read the Holy Quran, watch inspiring lectures, explore Islamic art, learn from scholars, and
            connect with a global Muslim community — all in one beautifully designed place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/quran" className="btn-gold">
              <BookOpen size={18} /> Read Quran
            </Link>
            <Link href="/videos" className="btn-ghost text-white">
              <PlayCircle size={18} /> Watch Videos
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-[2.5rem]"
        >
          <span className="font-arabic text-7xl text-gold-400">﷽</span>
        </motion.div>
      </div>
    </section>
  );
}
