import Hero from '@/components/Hero';
import MovingDescription from '@/components/MovingDescription';
import QuickAccess from '@/components/QuickAccess';
import { FeaturedVideos, FeaturedArticles, DailyQuote, FeaturedImages } from '@/components/FeaturedContent';
import PremiumSection from '@/components/PremiumSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MovingDescription />
      <QuickAccess />
      <FeaturedVideos />
      <FeaturedImages />
      <DailyQuote />
      <FeaturedArticles />
      <PremiumSection />
    </>
  );
}
