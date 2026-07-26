'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { identifier, password, rememberMe });
      Cookies.set('accessToken', res.data.accessToken, { expires: rememberMe ? 30 : 1 });
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-hero-gradient px-4 pt-20">
      <div className="bg-islamic-pattern pointer-events-none absolute inset-0 opacity-10" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md text-white"
      >
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-extrabold text-gold-400">MINARA</span>
          <span className="font-display text-2xl font-light"> CAST</span>
          <p className="mt-2 text-sm text-white/60">Welcome back. Sign in to continue.</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-gold-400"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-gold-400"
          />

          <div className="flex items-center justify-between text-sm text-white/60">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <Link href="/forgot-password" className="hover:text-gold-400">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-gold-400 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
