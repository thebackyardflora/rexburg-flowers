import { Link, Links, LiveReload, Meta, Scripts, ScrollRestoration } from '@remix-run/react';

export default function Route404() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <main className="relative isolate min-h-full">
          <img
            src="/images/soil-blocks.jpg"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
          />
          <div className="to-red absolute inset-0 -z-10 bg-gradient-to-b from-black opacity-95" />
          <div className="z-10 mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
            <p className="text-base font-semibold leading-8 text-white">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-base font-medium text-white sm:mt-6">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10 flex justify-center">
              <Link to="/" className="text-sm font-semibold leading-7 text-white">
                <span aria-hidden="true">&larr;</span> Back to home
              </Link>
            </div>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
