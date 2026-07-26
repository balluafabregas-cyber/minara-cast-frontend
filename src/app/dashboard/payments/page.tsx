'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Plus } from 'lucide-react';
import api from '@/lib/api';

interface Payment {
  _id: string;
  amount: number;
  estimatedDurationDays: number;
  status: string;
  createdAt: string;
  adminNotes?: string;
  proof?: { url: string };
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
  expired: 'bg-black/10 text-black/50',
  cancelled: 'bg-black/10 text-black/50',
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/payments/me')
      .then((res) => setPayments(res.data.payments || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Payment History</h1>
        <Link href="/premium/checkout" className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={14} /> New Payment
        </Link>
      </div>

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      {!loading && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-black/40 dark:border-white/10">
          You haven&apos;t made any payments yet.
        </div>
      )}

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p._id} className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{p.amount.toLocaleString()} RWF</p>
                <p className="text-xs text-black/40 dark:text-white/40">{new Date(p.createdAt).toLocaleString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status]}`}>{p.status}</span>
            </div>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">{p.estimatedDurationDays} days of access</p>
            {p.adminNotes && <p className="mt-1 text-xs text-black/40">Admin note: {p.adminNotes}</p>}
            {p.proof?.url && (
              <a href={p.proof.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex w-fit items-center gap-1 text-xs font-medium text-emerald-600 hover:underline">
                View submitted proof <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
