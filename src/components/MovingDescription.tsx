'use client';

const TEXT =
  'Welcome to MINARA CAST — Your Complete Islamic Digital Platform where you can read the Holy Quran, learn Islam, watch inspiring videos, explore beautiful Islamic images, connect with the Muslim community, join live discussions, and strengthen your faith through modern technology.';

export default function MovingDescription() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy-900/60 py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <span className="mx-8 text-sm font-medium text-gold-400/90">{TEXT}</span>
        <span className="mx-8 text-sm font-medium text-gold-400/90">{TEXT}</span>
      </div>
    </div>
  );
}
