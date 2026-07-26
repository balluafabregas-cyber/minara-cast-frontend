'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Bell, Menu, Moon, Sun, Crown, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const NAV_LINKS = [
  { href: '/quran', label: 'Quran' },
  { href: '/videos', label: 'Videos' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/articles', label: 'Articles' },
  { href: '/courses', label: 'Courses' },
  { href: '/channels', label: 'Channels' },
  { href: '/community', label: 'Community' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-navy-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold text-gold-400">MINARA</span>
          <span className="font-display text-2xl font-light text-white">CAST</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/90 transition hover:text-gold-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button aria-label="Search" className="hidden rounded-full p-2 text-white hover:bg-white/10 md:block">
            <Search size={20} />
          </button>
          <button aria-label="Toggle dark mode" onClick={toggleDark} className="rounded-full p-2 text-white hover:bg-white/10">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              <button aria-label="Notifications" className="relative rounded-full p-2 text-white hover:bg-white/10">
                <Bell size={20} />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.fullName}
                    className="h-9 w-9 rounded-full border-2 border-gold-400 object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-400 bg-emerald-700 text-xs font-bold text-white">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary hidden md:inline-flex !py-2 !px-4 text-sm">
              Sign In
            </Link>
          )}

          <Link href="/premium" className="btn-gold hidden !py-2 !px-4 text-sm md:inline-flex">
            <Crown size={16} /> Premium
          </Link>

          <button className="rounded-full p-2 text-white hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass mx-4 mb-4 flex flex-col gap-1 rounded-2xl p-4 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link href="/login" className="btn-primary mt-2 justify-center">
              Sign In
            </Link>
          )}
        </motion.nav>
      )}
    </header>
  );
}
