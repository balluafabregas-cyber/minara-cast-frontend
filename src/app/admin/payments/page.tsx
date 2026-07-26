'use client';

import { useEffect, useState } from 'react';
import { Check, X, ExternalLink, Search } from 'lucide-react';
import api from '@/lib/api';

interface Payment {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  amount: number;
  estimatedDurationDays: number;
  paymentDate: string;
  transactionId?: string;
  notes?: string;
  proof?: { url: string };
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
  expired: 'bg-black/10 text-black/50',
  cancelled: 'bg-black/10 text-black/50',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/payments', { params: { status: status || undefined, search: search || undefined } });
      setPayments(res.data.payments || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleApprove(id: string) {
    setActioningId(id);
    setMessage('');
    try {
      await api.patch(`/payments/${id}/approve`);
      setMessage('Payment approved and membership activated.');
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to approve payment.');
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt('Reason for rejection (shown to the user):') || undefined;
    setActioningId(id);
    setMessage('');
    try {
      await api.patch(`/payments/${id}/reject`, { adminNotes: reason });
      setMessage('Payment rejected.');
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to reject payment.');
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div>
      <h1 className="section-title mb-6">Payments</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-full border border-black/10 dark:border-white/20">
          {['pending', 'approved', 'rejected', ''].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 text-sm font-medium capitalize transition ${
                status === s ? 'bg-emerald-600 text-white' : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 dark:border-white/20">
          <Search size={14} className="text-black/40" />
          <input
            placeholder="Search username, email, transaction ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="w-56 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {message && <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600">{message}</div>}

      {loading && <p className="text-sm text-black/40">Loading...</p>}
      {!loading && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-black/40 dark:border-white/10">
          No payments found for this filter.
        </div>
      )}

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p._id} className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{p.fullName} <span className="font-normal text-black/40">@{p.username}</span></p>
                <p className="text-xs text-black/50 dark:text-white/50">{p.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status]}`}>{p.status}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div>
                <p className="text-black/40 dark:text-white/40">Amount</p>
                <p className="font-semibold">{p.amount.toLocaleString()} RWF</p>
              </div>
              <div>
                <p className="text-black/40 dark:text-white/40">Duration</p>
                <p className="font-semibold">{p.estimatedDurationDays} days</p>
              </div>
              <div>
                <p className="text-black/40 dark:text-white/40">Payment Date</p>
                <p className="font-semibold">{new Date(p.paymentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-black/40 dark:text-white/40">Transaction ID</p>
                <p className="font-semibold">{p.transactionId || '—'}</p>
              </div>
            </div>

            {p.notes && <p className="mt-2 text-sm text-black/60 dark:text-white/60">Note: {p.notes}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {p.proof?.url && (
                <a href={p.proof.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline">
                  View Proof <ExternalLink size={14} />
                </a>
              )}

              {p.status === 'pending' && (
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => handleApprove(p._id)}
                    disabled={actioningId === p._id}
                    className="flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(p._id)}
                    disabled={actioningId === p._id}
                    className="flex items-center gap-1 rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
