import type { Metadata } from 'next';
import { Inter, Poppins, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-poppins' });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri' });

export const metadata: Metadata = {
  title: 'MINARA CAST | Your Complete Islamic Digital Platform',
  description:
    'Read the Holy Quran, watch Islamic videos, explore Islamic images, learn from courses, and connect with the Muslim community on MINARA CAST.',
  openGraph: {
    title: 'MINARA CAST',
    description: 'Your Complete Islamic Digital Platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${amiri.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
