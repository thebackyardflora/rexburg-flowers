import type { LinksFunction, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import tailwindStylesheetUrl from '~/tailwind.css';
import { getUser } from '~/session.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
