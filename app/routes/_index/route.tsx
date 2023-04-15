import type { V2_MetaFunction } from '@remix-run/node';

import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';
import { HeroSection } from '~/routes/_index/HeroSection';

export const meta: V2_MetaFunction = () => [
  { title: 'The Backyard Flora - Locally Grown Flowers' },
  {
    name: 'description',
    content:
      'The Backyard Flora is a small, family-owned flower farm in Rexburg, ID. We grow a wide variety of flowers, including dahlias, zinnias, sunflowers, and more.',
  },
];

export default function Example() {
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
