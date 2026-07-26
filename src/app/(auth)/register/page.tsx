'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', phone: '', country: '',
    password: '', confirmPassword: '', acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      Cookies.set('accessToken', res.data.accessToken, { expires: 7 });
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-hero-gradient px-4 py-24">
      <div className="bg-islamic-pattern pointer-events-none absolute inset-0 opacity-10" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg text-white"
      >
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-extrabold text-gold-400">MINARA</span>
          <span className="font-display text-2xl font-light"> CAST</span>
          <p className="mt-2 text-sm text-white/60">Create your account — includes a free 3-day trial.</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="input" />
            <input required placeholder="Username" value={form.username} onChange={(e) => update('username', e.target.value)} className="input" />
          </div>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input w-full" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Phone Number" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" />
            <input placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input" />
            <input required type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="input" />
          </div>

          <label className="flex items-start gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => update('acceptTerms', e.target.checked)}
              className="mt-0.5"
            />
            I agree to the <Link href="/terms" className="text-gold-400 hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-gold-400 hover:underline">Privacy Policy</Link>.
          </label>

          <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-gold-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .input:focus {
          border-color: #d4af37;
        }
      `}</style>
    </div>
  );
}
