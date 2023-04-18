import { createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { Cart } from '~/routes/cart/cart.types';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

const CART_SESSION_KEY = 'cart';

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getCart(request: Request) {
  const session = await getSession(request);
  const cart = session.get(CART_SESSION_KEY);

  if (!cart) return null;

  return JSON.parse(cart) as Cart;
}

export async function saveCartSession({
  request,
  cart,
  redirectTo,
}: {
  request: Request;
  cart: Cart;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(CART_SESSION_KEY, JSON.stringify(cart));
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7,
      }),
    },
  });
}

export async function clearCartSession(request: Request, redirectUrl: string) {
  const session = await getSession(request);
  return redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
