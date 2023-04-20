import { getCart, saveCartSession } from '~/session.server';
import { getProductById, getProducts } from '~/models/product.server';
import { z } from 'zod';
import type { Cart } from '~/routes/cart/cart.types';
import { createCheckoutUrl } from '~/square.server';
import { json, redirect } from '@remix-run/node';
import type { OrderLineItem } from 'square';

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

  if (variant.soldOut) {
    throw new Response('Item variant is sold out', { status: 406 });
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

export async function cartCheckout(request: Request) {
  const cart = await getCart(request);

  if (!cart) {
    throw new Response(null, { status: 406 });
  }

  const { cartProducts } = await getCartDetails(cart);

  const url = new URL(request.url);

  if (cartProducts.some((item) => item.variants.find((v) => v.id === item.variationId)?.soldOut)) {
    return json({ message: 'One or more items in your cart are sold out' }, { status: 406 });
  }

  const checkoutUrl = await createCheckoutUrl(
    url.origin,
    cartProducts.map(
      (item) =>
        ({
          quantity: item.quantity.toString(),
          catalogObjectId: item.variationId,
          appliedTaxes: item.taxIds.length ? item.taxIds.map((taxId) => ({ taxUid: taxId })) : undefined,
        } satisfies OrderLineItem)
    ),
    [...new Set(cartProducts.flatMap((item) => item.taxIds))]
  );

  return redirect(checkoutUrl);
}

export async function getCartDetails(cart: Cart) {
  const products = await getProducts();
  cart.items = cart.items.filter((item) =>
    products.find((product) => product.id === item.productId && product.variants.find((v) => v.id === item.variationId))
  );

  const cartProducts = cart.items.map((item) => ({
    ...products.find((product) => product.id === item.productId)!,
    quantity: item.quantity,
    variationId: item.variationId,
  }));

  const subtotal = cartProducts.reduce(
    (acc, product) => acc + product.variants.find((v) => v.id === product.variationId)!.price * product.quantity,
    0
  );

  const shippingEstimate = 0;

  const taxEstimate = cartProducts.reduce(
    (acc, product) =>
      acc + product.variants.find((v) => v.id === product.variationId)!.price * product.quantity * product.taxPercent,
    0
  );

  const orderTotal = subtotal + taxEstimate + shippingEstimate;

  return {
    cartProducts,
    subtotal,
    shippingEstimate,
    taxEstimate,
    orderTotal,
  };
}
