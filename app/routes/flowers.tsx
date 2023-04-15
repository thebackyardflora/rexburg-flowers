import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';
import { V2_MetaFunction } from '@remix-run/node';
const categories = [
  {
    name: 'Bouquets',
    href: '#',
    imageSrc: '/images/bouquets-thumbnail.jpg',
    imageAlt: 'Brown leather key ring with brass metal loops and rivets on wood table.',
    description: 'Keep your phone, keys, and wallet together, so you can lose everything at once.',
  },
  {
    name: 'Arrangements',
    href: '#',
    imageSrc: '/images/arrangements-thumbnail.jpg',
    imageAlt: 'Natural leather mouse pad on white desk next to porcelain mug and keyboard.',
    description: 'The rest of the house will still be a mess, but your desk will look great.',
  },
  {
    name: 'CSA Subscription',
    href: '#',
    imageSrc: '/images/csa.png',
    imageAlt: 'Person placing task list card into walnut card holder next to felt carrying case on leather desk pad.',
    description: 'Be more productive than enterprise project managers with a single piece of paper.',
  },
];

export default function Flowers() {
  return (
    <div className="bg-white">
      <SiteHeader />

      <main>
        <section className="bg-white" data-testid="flower-categories">
          <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop Our Flowers</h2>
            <p className="mt-4 text-base text-gray-500">
              Each season, we collaborate with world-class designers to create a collection inspired by the natural
              world.
            </p>

            <div className="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
              {categories.map((category) => (
                <a key={category.name} href={category.href} className="group block">
                  <div
                    aria-hidden="true"
                    className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg lg:aspect-h-6 lg:aspect-w-5 group-hover:opacity-75"
                  >
                    <img
                      src={category.imageSrc}
                      alt={category.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{category.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{category.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
