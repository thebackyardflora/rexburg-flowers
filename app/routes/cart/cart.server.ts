import { getCart, saveCartSession } from '~/session.server';

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
