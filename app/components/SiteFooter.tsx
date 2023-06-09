import Logo from '~/components/Logo';
import { Link, useFetcher } from '@remix-run/react';
import { useRootLoaderData } from '~/root';

export function SiteFooter() {
  const emailListFetcher = useFetcher();
  const { featuredProducts } = useRootLoaderData();

  const footerNavigation = {
    products: featuredProducts.map((product) => ({
      name: product.name,
      href: `/products/${product.id}`,
    })),
    company: [
      { name: 'About Us', href: '#' },
      { name: 'No-till farming', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    services: [
      { name: 'DIY Weddings', href: '#' },
      { name: 'The Flower Cart', href: '#' },
    ],
  };

  return (
    <footer aria-labelledby="footer-heading" className="bg-gray-50">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-20">
          {/* Image section */}
          <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
            <div className="col-span-6 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-2">
              <Logo className="h-12 w-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
            {/* Sitemap sections */}
            <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 lg:col-span-6 lg:col-start-2">
              <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Products</h3>
                  <ul className="mt-6 space-y-6">
                    {footerNavigation.products.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Company</h3>
                  <ul className="mt-6 space-y-6">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Services</h3>
                <ul className="mt-6 space-y-6">
                  {footerNavigation.services.map((item) => (
                    <li key={item.name} className="text-sm">
                      <Link to={item.href} className="text-gray-500 hover:text-gray-600">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter section */}
            <div className="mt-12 md:col-span-8 md:col-start-3 md:row-start-2 md:mt-0 lg:col-span-4 lg:col-start-9 lg:row-start-1">
              <h3 className="text-sm font-medium text-gray-900">Sign up for our newsletter</h3>
              <p className="mt-6 text-sm text-gray-500">Get the latest from The Backyard Flora.</p>
              {emailListFetcher.data?.success ? (
                <div className="mt-2 flex items-center justify-center rounded-md bg-primary-50 p-2 text-center text-sm font-medium text-primary-600 sm:max-w-md">
                  <span>Thank you for subscribing! Check your email to confirm your subscription.</span>
                </div>
              ) : emailListFetcher.data?.success === false ? (
                <div className="mt-2 flex items-center justify-center rounded-md bg-red-100 p-2 text-center text-sm font-medium text-red-900 sm:max-w-md">
                  <span>Hmm... Something went wrong when trying to add you. Please try again later!</span>
                </div>
              ) : (
                <emailListFetcher.Form method="post" action="/api/join-mail-list" className="mt-2 flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="submit"
                      disabled={emailListFetcher.state === 'submitting'}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Sign up
                    </button>
                  </div>
                </emailListFetcher.Form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-10 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Backyard Flora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
