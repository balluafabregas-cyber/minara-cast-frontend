'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Crown } from 'lucide-react';

const PLANS = [
  { amount: 500, days: 7, label: 'Weekly', features: ['Premium Articles', 'Premium Images', 'Ad-free Browsing'] },
  { amount: 1000, days: 21, label: '3 Weeks', features: ['Everything in Weekly', 'Premium Videos', 'Premium Courses'], popular: true },
  { amount: 5000, days: 90, label: '3 Months', features: ['Everything in 3 Weeks', 'VIP Live Chat', 'Priority Support'] },
  { amount: 10000, days: 365, label: 'Yearly', features: ['Everything in 3 Months', 'Exclusive Community', 'Best Value'] },
];

export default function PremiumSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      <div className="bg-islamic-pattern pointer-events-none absolute inset-0 opacity-5" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-4 flex justify-center">
          <span className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <Crown size={14} /> Free 3-Day Trial for New Members
          </span>
        </div>
        <h2 className="section-title mb-12 text-center text-white">Upgrade to Premium</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.amount}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card relative flex flex-col ${plan.popular ? 'ring-2 ring-gold-400' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-900">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.label}</h3>
              <p className="mt-2 text-3xl font-extrabold text-gold-400">
                {plan.amount.toLocaleString()} <span className="text-sm font-normal text-white/50">RWF</span>
              </p>
              <p className="mb-6 text-sm text-white/50">≈ {plan.days} days access</p>
              <ul className="mb-8 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <Check size={16} className="text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/premium/checkout?amount=${plan.amount}`} className="btn-gold w-full justify-center">
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/50">
          Pay any amount from 500 RWF — your access period is calculated automatically.
        </p>
      </div>
    </section>
  );
}
