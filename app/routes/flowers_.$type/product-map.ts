export const productTypes = ['bouquets', 'arrangements', 'csa'] as const;

type Product = {
  name: string;
  href: string;
  currentBreadcrumb: string;
  description: string;
  variants: { name: string; description: string; imageSrc: string; imageAlt: string; price: number }[];
};

export const productMap = {
  bouquets: {
    name: 'Wrapped Bouquets',
    href: '/flowers/bouquets',
    currentBreadcrumb: 'Bouquets',
    description: 'Our bouquets are made with the freshest flowers from our garden.',
    variants: [
      {
        name: 'Small',
        description: 'About 5 stems',
        imageSrc: '/images/bouquets/small.jpeg',
        imageAlt: 'A small bouquet of flowers',
        price: 20,
      },
      {
        name: 'Medium',
        description: 'About 10 stems',
        imageSrc: '/images/bouquets/medium.jpeg',
        imageAlt: 'A medium bouquet of flowers',
        price: 40,
      },
      {
        name: 'Large',
        description: 'About 15 stems',
        imageSrc: '/images/bouquets/large.jpeg',
        imageAlt: 'A large bouquet of flowers',
        price: 60,
      },
    ],
  },

  arrangements: {
    name: 'Arrangements',
    href: '/flowers/arrangements',
    currentBreadcrumb: 'Arrangements',
    description:
      'Our arrangements are made with the freshest flowers from our garden and come with a unique vessel of choice.',
    variants: [
      {
        name: 'Bud Vase',
        description: 'Good for small tables',
        imageSrc: '/images/arrangements/bud-vase.jpg',
        imageAlt: 'A bud vase arrangement',
        price: 15,
      },
      {
        name: 'Centerpiece',
        description: 'Good for large tables',
        imageSrc: '/images/arrangements/centerpiece.jpg',
        imageAlt: 'A centerpiece arrangement',
        price: 60,
      },
      {
        name: 'Side Table',
        description: 'Good for small tables',
        imageSrc: '/images/arrangements/side-table.jpg',
        imageAlt: 'A side table arrangement',
        price: 40,
      },
      {
        name: 'Classic',
        description: 'Good for any table',
        imageSrc: '/images/arrangements/classic.jpg',
        imageAlt: 'A classic arrangement',
        price: 50,
      },
    ],
  },

  csa: {
    name: 'CSA Subscription',
    href: '/flowers/csa-subscription',
    currentBreadcrumb: 'CSA Subscription',
    description: 'Our CSA subscription is a great way to get fresh flowers delivered to your door every week.',
    variants: [
      {
        name: 'Full Season',
        description: 'Every week from May to October',
        imageSrc: '/images/csa/full-season.jpg',
        imageAlt: 'A full season CSA subscription',
        price: 500,
      },
      {
        name: 'Sampler',
        description: 'Every other week from May to October',
        imageSrc: '/images/csa/sampler.jpg',
        imageAlt: 'A sampler CSA subscription',
        price: 250,
      },
    ],
  },
} satisfies Record<(typeof productTypes)[number], Product>;
