import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Form, Link, useFetcher, useLoaderData } from '@remix-run/react';
import { getCart } from '~/session.server';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { cartCheckout, getCartDetails, removeCartItem, updateCartQty } from '~/routes/cart/cart.server';

export async function loader({ request }: LoaderArgs) {
  const cart = await getCart(request);

  if (!cart) {
    return json({
      cart: null,
    });
  }

  const { cartProducts, subtotal, shippingEstimate, taxEstimate, orderTotal } = await getCartDetails(cart);

  return json({
    cart: {
      products: cartProducts,
      subtotal,
      shippingEstimate,
      taxEstimate,
      orderTotal,
    },
  });
}

export async function action({ request }: ActionArgs) {
  if (request.method === 'DELETE') {
    return await removeCartItem({ request });
  } else if (request.method === 'PUT') {
    return await updateCartQty(request);
  } else if (request.method === 'POST') {
    return cartCheckout(request);
  } else {
    throw new Response(null, { status: 405 });
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function ShoppingCart() {
  const { cart } = useLoaderData<typeof loader>();

  const qtyFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="h-full lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            {cart?.products.length ? (
              <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cart.products.map((product, productIdx) => {
                  const variation = product.variants.find((v) => v.id === product.variationId);

                  if (!variation) return null;

                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        {variation.imageSrc ? (
                          <img
                            src={variation.imageSrc}
                            alt={variation.imageAlt}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : product.imageSrc ? (
                          <img
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : null}
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link to={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                                  {product.name}
                                </Link>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              {variation.name ? (
                                <p className="border-gray-200 text-gray-500">{variation.name}</p>
                              ) : null}
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {currencyFormatter.format(variation.price)}{' '}
                              <span className="font-normal text-gray-500">each</span>
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <qtyFetcher.Form method="put">
                              <input type="hidden" name="productId" value={product.id} />
                              <input type="hidden" name="variationId" value={variation.id} />
                              <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                                Quantity, {product.name}
                              </label>
                              <select
                                id={`quantity-${productIdx}`}
                                name="quantity"
                                className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                                defaultValue={product.quantity}
                                onChange={(e) => qtyFetcher.submit(e.target.form, { method: 'put' })}
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={8}>9</option>
                                <option value={8}>10</option>
                              </select>
                            </qtyFetcher.Form>

                            <deleteFetcher.Form method="delete" className="absolute right-0 top-0">
                              <input type="hidden" name="productId" value={product.id} />
                              <input type="hidden" name="variationId" value={variation.id} />
                              <button type="submit" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Remove</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </deleteFetcher.Form>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="prose flex h-full w-full flex-col items-center justify-center text-gray-500">
                <div>Your cart is empty.</div>
                <div>
                  Why not buy some{' '}
                  <Link to="/products" className="text-primary-600">
                    flowers?
                  </Link>{' '}
                  💐
                </div>
              </div>
            )}
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cart ? currencyFormatter.format(cart.subtotal) : '-'}
                </dd>
              </div>
              {/*<div className="flex items-center justify-between border-t border-gray-200 pt-4">*/}
              {/*  <dt className="flex items-center text-sm text-gray-600">*/}
              {/*    <span>Shipping estimate</span>*/}
              {/*    <Link to="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">*/}
              {/*      <span className="sr-only">Learn more about how shipping is calculated</span>*/}
              {/*      <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />*/}
              {/*    </Link>*/}
              {/*  </dt>*/}
              {/*  <dd className="text-sm font-medium text-gray-900">*/}
              {/*    {cart ? currencyFormatter.format(cart.shippingEstimate) : '-'}*/}
              {/*  </dd>*/}
              {/*</div>*/}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <Link to="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Learn more about how tax is calculated</span>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cart ? currencyFormatter.format(cart.taxEstimate) : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">
                  {cart ? currencyFormatter.format(cart.orderTotal) : '-'}
                </dd>
              </div>
            </dl>

            <Form method="post" className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                disabled={
                  !cart?.products.length || qtyFetcher.state === 'submitting' || deleteFetcher.state === 'submitting'
                }
              >
                Checkout
              </button>
            </Form>
          </section>
        </div>
      </div>
    </div>
  );
}
