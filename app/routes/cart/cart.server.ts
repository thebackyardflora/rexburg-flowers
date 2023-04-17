import { getCart, saveCartSession } from '~/session.server';
import { getProductById } from '~/models/product.server';
import { z } from 'zod';
import type { Cart } from '~/routes/cart/cart.types';

export async function removeCartItem({ request }: { request: Request }) {
  const cart = await getCart(request);
  const body = await request.formData();

  if (!cart) {
    return null;
  }

  const productId = body.get('productId');
  const variationId = body.get('variationId');

  if (!productId || !variationId) {
    throw new Response(null, { status: 400 });
  }

  cart.items = cart.items.filter((item) => item.productId !== productId || item.variationId !== variationId);

  return saveCartSession({ request, cart, redirectTo: '/cart' });
}

export async function updateCartQty(request: Request) {
  const cart = await getCart(request);
  const body = await request.formData();

  if (!cart) {
    throw new Response(null, { status: 406 });
  }

  const productId = body.get('productId');
  const variationId = body.get('variationId');
  const quantity = body.get('quantity');

  if (!productId || !variationId || !quantity) {
    throw new Response(null, { status: 400 });
  }

  const item = cart.items.find((item) => item.productId === productId && item.variationId === variationId);

  if (!item) {
    throw new Response(null, { status: 404 });
  }

  item.quantity = Number(quantity);

  return saveCartSession({ request, cart, redirectTo: '/cart' });
}

export async function addCartItem(request: Request, productId: string) {
  if (request.method !== 'POST') {
    throw new Response(null, { status: 405 });
  }

  const product = await getProductById(productId);

  if (!product) {
    throw new Response(null, { status: 404 });
  }

  const body = await request.formData();
  const variantId = z.string().parse(body.get('variation[id]'));
  const variant = product.variants.find((variant) => variant.id === variantId);

  if (!variant) {
    throw new Response(null, { status: 400 });
  }

  let cart = await getCart(request);

  if (!cart) {
    cart = {
      items: [],
    } satisfies Cart;
  }

  const existingItem = cart.items.find((item) => item.productId === product.id && item.variationId === variant.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({
      productId: product.id,
      variationId: variant.id,
      quantity: 1,
    });
  }

  return await saveCartSession({ cart, redirectTo: `/cart`, request });
}
