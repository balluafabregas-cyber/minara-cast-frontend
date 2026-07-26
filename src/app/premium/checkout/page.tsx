'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Upload, Check } from 'lucide-react';
import api from '@/lib/api';

const PAYMENT_NUMBER = '250793296662';

export default function PremiumCheckoutPage() {
  const [amount, setAmount] = useState(1000);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ paymentDate: '', transactionId: '', notes: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (amount >= 500) {
        api.get('/payments/estimate', { params: { amount } }).then((res) => setEstimate(res.data.estimatedDurationDays)).catch(() => setEstimate(null));
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [amount]);

  function copyNumber() {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('amount', String(amount));
      data.append('paymentDate', form.paymentDate);
      data.append('transactionId', form.transactionId);
      data.append('notes', form.notes);
      data.append('paymentPhoneNumber', PAYMENT_NUMBER);
      if (file) data.append('proof', file);

      await api.post('/payments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong submitting your payment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="glass-card">
          <Check size={40} className="mx-auto mb-4 text-emerald-500" />
          <h1 className="section-title">Payment Submitted</h1>
          <p className="mt-3 text-sm text-black/60 dark:text-white/60">
            Your payment is pending review. We&apos;ll notify you as soon as it&apos;s approved and your
            premium access is activated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-28 pb-16">
      <h1 className="section-title mb-2">Upgrade to Premium</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">Pay any amount from 500 RWF. Your access period is calculated automatically.</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-8 bg-gradient-to-br from-emerald-700 to-navy-900 text-white">
        <p className="text-sm text-white/60">Send Mobile Money to</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="font-display text-3xl font-bold text-gold-400">{PAYMENT_NUMBER}</span>
          <button onClick={copyNumber} className="rounded-full bg-white/10 p-2 hover:bg-white/20">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </motion.div>

      <div className="glass-card border border-black/5 bg-white text-navy-900 dark:border-white/10 dark:bg-navy-800 dark:text-white">
        <label className="mb-1 block text-sm font-medium">Amount Paid (RWF)</label>
        <input
          type="number"
          min={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mb-1 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
        />
        {estimate !== null && (
          <p className="mb-4 text-sm text-emerald-600 dark:text-emerald-400">≈ {estimate} days of premium access</p>
        )}

        {error && <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Payment Date</label>
            <input
              type="date"
              required
              value={form.paymentDate}
              onChange={(e) => setForm((f) => ({ ...f, paymentDate: e.target.value }))}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Transaction ID (optional)</label>
            <input
              value={form.transactionId}
              onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-emerald-500 dark:border-white/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Upload Payment Screenshot</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 py-8 text-sm text-black/50 hover:border-emerald-500 dark:border-white/20 dark:text-white/50">
              <Upload size={18} />
              {file ? file.name : 'Click to upload PNG, JPG, or PDF'}
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Payment for Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
