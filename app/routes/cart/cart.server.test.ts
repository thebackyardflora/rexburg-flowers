import { removeCartItem, updateCartQty, addCartItem } from '~/routes/cart/cart.server';
import { sessionStorage } from '~/session.server';
import type { Cart } from '~/routes/cart/cart.types';
import type { Product } from '~/models/product.server';
import { getProductById } from '~/models/product.server';
import { faker } from '@faker-js/faker';

vi.mock('~/models/product.server', () => ({
  getProductById: vi.fn(),
}));

const mockedGetProductById = vi.mocked(getProductById);

async function createSessionCookie(cart: Cart) {
  const cartData = JSON.stringify(cart);

  const session = await sessionStorage.getSession();

  session.set('cart', cartData);

  return await sessionStorage.commitSession(session);
}

async function parseSessionCookie(cookie: string | null | undefined) {
  const session = await sessionStorage.getSession(cookie);

  const cartData = session.get('cart');

  return JSON.parse(cartData);
}

const mockProduct = {
  id: '2',
  name: faker.commerce.productName(),
  imageSrc: null,
  imageAlt: undefined,
  href: faker.internet.url(),
  description: faker.lorem.paragraph(),
  descriptionHtml: faker.lorem.paragraph(),
  taxIds: [],
  taxPercent: 0,
  variants: [
    {
      imageAlt: undefined,
      imageSrc: null,
      description: null,
      price: faker.datatype.number(),
      id: '1',
      name: faker.commerce.productName(),
      soldOut: false,
    },
  ],
} satisfies Product;

describe('Cart Functionality', () => {
  beforeEach(() => {
    mockedGetProductById.mockClear();
  });

  describe('removeCartItem', () => {
    test('removes the item from the cart', async () => {
      const sessionCookie = await createSessionCookie({
        items: [
          {
            productId: '1',
            variationId: '1',
            quantity: 1,
          },
          {
            productId: '2',
            variationId: '2',
            quantity: 1,
          },
        ],
      });

      const request = new Request('https://example.com/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: sessionCookie,
        },
        body: 'productId=1&variationId=1',
      });

      const response = await removeCartItem({ request });

      const cart = await parseSessionCookie(response?.headers.get('Set-Cookie'));

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('2');
    });

    test('returns null if there is no cart', async () => {
      const request = new Request('https://example.com/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'productId=1&variationId=1',
      });

      const response = await removeCartItem({ request });

      expect(response).toBeNull();
    });
  });

  describe('updateCartQty', () => {
    test('updates the quantity of the item in the cart', async () => {
      const sessionCookie = await createSessionCookie({
        items: [
          {
            productId: '1',
            variationId: '1',
            quantity: 1,
          },
          {
            productId: '2',
            variationId: '2',
            quantity: 1,
          },
        ],
      });

      const request = new Request('https://example.com/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: sessionCookie,
        },
        body: 'productId=1&variationId=1&quantity=2',
      });

      const response = await updateCartQty(request);

      const cart = await parseSessionCookie(response?.headers.get('Set-Cookie'));

      expect(cart.items).toHaveLength(2);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[1].quantity).toBe(1);
    });
  });

  describe('addItemToCart', () => {
    test('adds the item to the cart', async () => {
      mockedGetProductById.mockResolvedValueOnce(mockProduct);

      const sessionCookie = await createSessionCookie({
        items: [
          {
            productId: '1',
            variationId: '1',
            quantity: 1,
          },
        ],
      });

      const request = new Request('https://example.com/products/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: sessionCookie,
        },
        body: 'variation[id]=1',
      });

      const response = await addCartItem(request, '2');

      const cart = await parseSessionCookie(response?.headers.get('Set-Cookie'));

      expect(cart.items).toHaveLength(2);
      expect(cart.items[0].productId).toBe('1');
      expect(cart.items[1].productId).toBe('2');
    });

    test('creates a new cart if there is no cart', async () => {
      mockedGetProductById.mockResolvedValueOnce(mockProduct);

      const request = new Request('https://example.com/products/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'variation[id]=1',
      });

      const response = await addCartItem(request, '2');

      const cart = await parseSessionCookie(response?.headers.get('Set-Cookie'));

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('2');
    });

    test('adds to the existing item quantity if the item was already in the cart', async () => {
      mockedGetProductById.mockResolvedValueOnce(mockProduct);

      const sessionCookie = await createSessionCookie({
        items: [
          {
            productId: '2',
            variationId: '1',
            quantity: 1,
          },
        ],
      });

      const request = new Request('https://example.com/products/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: sessionCookie,
        },
        body: 'variation[id]=1',
      });

      const response = await addCartItem(request, '2');

      const cart = await parseSessionCookie(response?.headers.get('Set-Cookie'));

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('2');
      expect(cart.items[0].quantity).toBe(2);
    });
  });
});
