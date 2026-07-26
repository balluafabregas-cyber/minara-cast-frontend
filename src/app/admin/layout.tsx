'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CreditCard, Users, FileText, Video, Image as ImageIcon, Quote, GraduationCap, Tv, Settings, Lock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
  { href: '/admin/quotes', label: 'Quotes', icon: Quote },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/channels', label: 'Channels', icon: Tv },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setChecked(true);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center pt-16 text-sm text-black/40">Checking access...</div>;
  }

  const isAdmin = user && ['admin', 'super_admin'].includes(user.role);

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 pt-16 text-center">
        <Lock size={32} className="mb-4 text-black/30" />
        <h1 className="text-xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-black/50">
          You need an admin or super admin account to view this page.
        </p>
        <button onClick={() => router.push('/login')} className="btn-primary mt-6">
          Sign in as admin
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pt-16">
      <aside className="hidden w-60 shrink-0 border-r border-black/5 bg-white p-4 dark:border-white/10 dark:bg-navy-900 md:block">
        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40">Admin Panel</p>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-emerald-600 text-white' : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'
                }`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
