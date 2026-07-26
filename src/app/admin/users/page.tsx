'use client';

import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Ban, PauseCircle, PlayCircle } from 'lucide-react';
import api from '@/lib/api';

interface AdminUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'banned';
  membership: { type: string; endDate: string };
  createdAt: string;
}

const ROLES = ['user', 'premium', 'editor', 'moderator', 'admin', 'super_admin'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { search: search || undefined, limit: 50 } });
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, status: string) {
    setMessage('');
    try {
      await api.patch(`/users/${id}/status`, { status });
      setMessage('User status updated.');
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update status.');
    }
  }

  async function updateRole(id: string, role: string) {
    setMessage('');
    try {
      await api.patch(`/users/${id}/role`, { role });
      setMessage('User role updated.');
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Only a super admin can change roles.');
    }
  }

  return (
    <div>
      <h1 className="section-title mb-6">Users</h1>

      <div className="mb-4 flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 dark:border-white/20 sm:w-80">
        <Search size={14} className="text-black/40" />
        <input
          placeholder="Search name, username, email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {message && <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600">{message}</div>}
      {loading && <p className="text-sm text-black/40">Loading...</p>}

      <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase text-black/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Membership</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-black/5 dark:border-white/10">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-xs text-black/40">@{u.username} · {u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="rounded-lg border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/20"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs capitalize">{u.membership?.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                      u.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {u.status !== 'suspended' ? (
                      <button title="Suspend" onClick={() => updateStatus(u._id, 'suspended')} className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                        <PauseCircle size={16} className="text-yellow-600" />
                      </button>
                    ) : (
                      <button title="Reactivate" onClick={() => updateStatus(u._id, 'active')} className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                        <PlayCircle size={16} className="text-emerald-600" />
                      </button>
                    )}
                    <button title="Ban" onClick={() => updateStatus(u._id, 'banned')} className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                      <Ban size={16} className="text-red-600" />
                    </button>
                    <button title="Verify/Active" onClick={() => updateStatus(u._id, 'active')} className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                      <ShieldCheck size={16} className="text-black/40" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
