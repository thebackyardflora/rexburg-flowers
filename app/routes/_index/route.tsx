import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';
import { HeroSection } from '~/routes/_index/HeroSection';

export default function Storefront() {
  return (
    <div className="bg-white">
      <SiteHeader />

      <main>
        <HeroSection />
      </main>

      <SiteFooter />
    </div>
  );
}
