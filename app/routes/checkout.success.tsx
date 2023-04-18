import type { LoaderArgs } from '@remix-run/node';
import { z } from 'zod';
import { redirect } from '@remix-run/node';
import { getOrder, getPayment } from '~/square.server';
import { getProducts } from '~/models/product.server';
import { Link, useLoaderData } from '@remix-run/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const paymentId = z.string().safeParse(url.searchParams.get('payment_id'));
  const orderId = z.string().safeParse(url.searchParams.get('order_id'));

  if (!paymentId.success || !orderId.success) {
    throw redirect('/');
  }

  try {
    const [products, order, payment] = await Promise.all([
      getProducts(),
      getOrder(orderId.data),
      getPayment(paymentId.data),
    ]);

    if (!order || !payment) {
      throw new Response('Unable to load order details', { status: 406 });
    }

    const orderItems =
      (await order.lineItems
        ?.map((item) => {
          const product = products.find(
            (product) =>
              product.id === item.catalogObjectId || product.variants.find((v) => v.id === item.catalogObjectId)
          );

          if (!product) return null;

          return {
            ...product,
            quantity: item.quantity,
            totalCost: Number(item.grossSalesMoney?.amount ?? 0) / 100,
            variationName: item.variationName,
          };
        })
        .filter((val): val is NonNullable<typeof val> => Boolean(val))) ?? [];

    const totalTax = Number(order.totalTaxMoney?.amount ?? 0) / 100;
    const subtotal =
      (order.lineItems?.reduce((acc, item) => acc + Number(item.grossSalesMoney?.amount ?? 0), 0) ?? 0) / 100;
    const totalCost = Number(order.totalMoney?.amount ?? 0) / 100;

    return {
      orderItems,
      subtotal,
      totalTax,
      totalCost,
      receiptUrl: payment.receiptUrl,
    };
  } catch (err) {
    throw new Response('Unable to load order details', { status: 500 });
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function CheckoutSuccessPage() {
  const { orderItems, subtotal, totalTax, totalCost, receiptUrl } = useLoaderData<typeof loader>();

  return (
    <>
      <main className="relative lg:min-h-full">
        <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <img src="/images/single-flower.jpg" alt="TODO" className="h-full w-full object-cover object-center" />
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1 className="text-sm font-medium text-primary-600">Payment successful</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Thanks for supporting local flowers
              </p>
              <p className="mt-2 text-base text-gray-500">
                We appreciate your order. Hang tight and we’ll reach out to you when your order is ready to be picked
                up.
              </p>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">
                {orderItems.map((product) => (
                  <li key={product.id} className="flex space-x-6 py-6">
                    {product.imageSrc ? (
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
                      />
                    ) : null}
                    <div className="flex-auto space-y-1">
                      <h3 className="text-gray-900">
                        <Link to={product.href}>{product.name}</Link>
                      </h3>
                      <p>{product.variationName}</p>
                    </div>
                    <p className="flex-none font-medium text-gray-900">{currencyFormatter.format(product.totalCost)}</p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">{currencyFormatter.format(subtotal)}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-gray-900">{currencyFormatter.format(totalTax)}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">{currencyFormatter.format(totalCost)}</dd>
                </div>
              </dl>

              <div className="mt-16 flex items-center justify-end text-primary-600">
                <ArrowTopRightOnSquareIcon className="mr-2 h-5 w-5" />
                <a className="font-medium" href={receiptUrl} target="_blank" rel="noreferrer">
                  View your receipt
                </a>
              </div>

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
