'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  children: ReactNode;
}

export default function SectionShell({ eyebrow, title, viewAllHref, children }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-500">{eyebrow}</span>
          <h2 className="section-title mt-2">{title}</h2>
        </div>
        <Link href={viewAllHref} className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline sm:flex">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      {children}
    </section>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-black/5 dark:bg-white/5">
      <div className="aspect-video rounded-t-2xl bg-black/10 dark:bg-white/10" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-black/40 dark:border-white/10 dark:text-white/40">
      {message}
    </div>
  );
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export { motion };
