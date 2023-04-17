import type { LinksFunction, LoaderArgs, SerializeFrom, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from '@remix-run/react';

import tailwindStylesheetUrl from '~/tailwind.css';
import type { V2_ErrorBoundaryComponent } from '@remix-run/react/dist/routeModules';
import Route404 from '~/components/Route404';
import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';
import { getFeaturedProducts } from '~/models/product.server';
import { getCart } from '~/session.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];

export const loader = async ({ request }: LoaderArgs) => {
  const cart = await getCart(request);

  const cartQty = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return json({
    cartQty,
    featuredProducts: await getFeaturedProducts(),
  });
};

export const meta: V2_MetaFunction = () => [
  { title: 'The Backyard Flora - Locally Grown Flowers' },
  {
    name: 'description',
    content:
      'The Backyard Flora is a small, family-owned flower farm in Rexburg, ID. We grow a wide variety of flowers, including dahlias, zinnias, sunflowers, and more.',
  },
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="bg-white">
          <SiteHeader />
          <main>
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  return <Route404 />;
};

export function useRootLoaderData() {
  const loaderData = useRouteLoaderData('root') as SerializeFrom<typeof loader>;

  if (!loaderData) throw new Error('Root Loader data is missing');

  return loaderData;
}
