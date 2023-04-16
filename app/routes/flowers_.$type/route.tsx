import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { productMap, productTypes } from '~/routes/flowers_.$type/product-map';

export async function loader({ params }: LoaderArgs) {
  const type = z.enum(productTypes).safeParse(params.type);

  if (!type.success) {
    throw new Response(null, { status: 404 });
  }

  const product = productMap[type.data];

  return json({
    product,
  });
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function Example() {
  const { product } = useLoaderData<typeof loader>();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const breadcrumbs = [
    { id: 1, name: 'Flowers', href: '/flowers' },
    { id: 2, name: product.currentBreadcrumb, href: product.href },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center text-sm">
                    <Link to={breadcrumb.href} className="font-medium text-gray-500 hover:text-gray-900">
                      {breadcrumb.name}
                    </Link>
                    {breadcrumbIdx !== breadcrumbs.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          </div>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img
              src={selectedVariant.imageSrc}
              alt={selectedVariant.imageAlt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>

            <form>
              <div className="sm:flex sm:justify-between">
                {/* Size selector */}
                <RadioGroup value={selectedVariant} onChange={setSelectedVariant}>
                  <RadioGroup.Label className="block text-sm font-medium text-gray-700">Size</RadioGroup.Label>
                  <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {product.variants.map((variant) => (
                      <RadioGroup.Option
                        as="div"
                        key={variant.name}
                        value={variant}
                        className={({ active }) =>
                          classNames(
                            active ? 'ring-2 ring-primary-500' : '',
                            'relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none'
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <RadioGroup.Label as="p" className="text-base font-medium text-gray-900">
                              {variant.name} - {currencyFormatter.format(variant.price)}
                            </RadioGroup.Label>
                            <RadioGroup.Description as="p" className="mt-1 text-sm text-gray-500">
                              {variant.description}
                            </RadioGroup.Description>
                            <div
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked ? 'border-primary-500' : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg'
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Add to cart
                </button>
              </div>
            </form>
          </section>
        </div>

        <section aria-labelledby="information-heading" className="mt-4">
          <h2 id="information-heading" className="sr-only">
            Product information
          </h2>

          <div className="mt-4 space-y-6">
            <p className="text-base text-gray-500">{product.description}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-sm font-medium text-gray-900">Flower Care</h2>

            <div className="prose prose-sm mt-4 text-gray-500">
              <ul>
                <li>When you get them home, give them a fresh cut</li>
                <li>Replace the water daily</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
