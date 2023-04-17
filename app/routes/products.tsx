import { getProducts } from '~/models/product.server';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

export async function loader() {
  const products = await getProducts();

  return json({
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
    })),
  });
}

export default function Products() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <section className="bg-white" data-testid="flower-categories">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop Our Flowers</h2>
        <p className="mt-4 text-base text-gray-500">
          Each season, we collaborate with world-class designers to create a collection inspired by the natural world.
        </p>

        <div className="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {products.map((product) => (
            <Link key={product.name} to={`/products/${product.id}`} className="group block">
              <div
                aria-hidden="true"
                className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg lg:aspect-h-6 lg:aspect-w-5 group-hover:opacity-75"
              >
                {product.imageSrc ? (
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                ) : null}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{product.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
