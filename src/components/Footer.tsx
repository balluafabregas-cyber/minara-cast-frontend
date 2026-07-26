import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Send } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { href: '/quran', label: 'Quran' },
      { href: '/videos', label: 'Videos' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/courses', label: 'Courses' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/premium', label: 'Premium' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/support', label: 'Support' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 pt-16 text-white">
      <div className="bg-islamic-pattern pointer-events-none absolute inset-0 opacity-5" />
      <div className="relative mx-auto max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-8 pb-12 md:grid-cols-5">
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-1">
              <span className="font-display text-2xl font-extrabold text-gold-400">MINARA</span>
              <span className="font-display text-2xl font-light">CAST</span>
            </div>
            <p className="max-w-xs text-sm text-white/60">
              Your complete Islamic digital platform — Quran, learning, media, and community, all in one place.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="rounded-full bg-white/10 p-2 transition hover:bg-gold-500 hover:text-navy-900">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 font-semibold text-gold-400">{group.title}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-3 font-semibold text-gold-400">Newsletter</h4>
            <p className="mb-3 text-sm text-white/60">Get daily reminders in your inbox.</p>
            <form className="flex overflow-hidden rounded-full border border-white/20">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <button type="submit" className="bg-emerald-600 px-3 text-white">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} MINARA CAST. All rights reserved.</p>
          <p>Built with care for the Ummah.</p>
        </div>
      </div>
    </footer>
  );
}
