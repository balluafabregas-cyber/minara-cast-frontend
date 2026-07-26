'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Clock } from 'lucide-react';
import api from '@/lib/api';
import SectionShell, { CardSkeleton, EmptyState } from './SectionShell';

// ---------- Featured Videos ----------
export function FeaturedVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/videos', { params: { limit: 4, trending: true } })
      .then((res) => setVideos(res.data.videos || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionShell eyebrow="Watch & Learn" title="Featured Videos" viewAllHref="/videos">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        {!loading && videos.length === 0 && <EmptyState message="No videos published yet. Check back soon." />}
        {videos.map((v) => (
          <Link
            key={v._id}
            href={`/videos/${v.slug}`}
            className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-navy-800"
          >
            <div className="relative aspect-video overflow-hidden bg-navy-900">
              {v.thumbnail?.url && (
                <Image src={v.thumbnail.url} alt={v.title} fill className="object-cover transition group-hover:scale-105" />
              )}
              {v.isPremium && (
                <span className="absolute right-2 top-2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-navy-900">
                  PREMIUM
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-semibold">{v.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-black/50 dark:text-white/50">
                <span className="flex items-center gap-1"><Eye size={12} /> {v.views || 0}</span>
                <span className="flex items-center gap-1"><Heart size={12} /> {v.likes?.length || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------- Featured Articles ----------
export function FeaturedArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/articles', { params: { limit: 3, featured: true } })
      .then((res) => setArticles(res.data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionShell eyebrow="Read & Reflect" title="Islamic Articles" viewAllHref="/articles">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        {!loading && articles.length === 0 && <EmptyState message="No articles published yet." />}
        {articles.map((a) => (
          <Link
            key={a._id}
            href={`/articles/${a.slug}`}
            className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-navy-800"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-emerald-900">
              {a.featuredImage?.url && (
                <Image src={a.featuredImage.url} alt={a.title} fill className="object-cover transition group-hover:scale-105" />
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-semibold">{a.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-black/60 dark:text-white/60">{a.excerpt}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                <Clock size={12} /> {a.readingTimeMinutes || 1} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------- Daily Quote Slider ----------
export function DailyQuote() {
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    api.get('/quotes/of-the-day').then((res) => setQuote(res.data.quote)).catch(() => setQuote(null));
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-emerald-500">Daily Reminder</span>
      <div className="glass-card mt-6 mx-auto">
        {quote ? (
          <>
            <p className="font-display text-xl italic md:text-2xl">&ldquo;{quote.text}&rdquo;</p>
            {quote.source && <p className="mt-4 text-sm text-gold-500">— {quote.source}</p>}
          </>
        ) : (
          <p className="text-black/40 dark:text-white/40">A new reminder is published here every day. Check back soon.</p>
        )}
      </div>
    </section>
  );
}

// ---------- Featured Images (masonry) ----------
export function FeaturedImages() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/images', { params: { limit: 8 } })
      .then((res) => setImages(res.data.images || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionShell eyebrow="Visual Inspiration" title="Islamic Gallery" viewAllHref="/gallery">
      {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}</div>}
      {!loading && images.length === 0 && <EmptyState message="No images uploaded yet." />}
      {images.length > 0 && (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((img) => (
            <div key={img._id} className="group relative overflow-hidden rounded-2xl">
              <Image src={img.url} alt={img.title || 'Islamic image'} width={400} height={400} className="w-full object-cover transition group-hover:scale-105" />
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
