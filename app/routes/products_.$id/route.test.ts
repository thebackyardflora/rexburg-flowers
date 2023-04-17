import { loader } from './route';
import type { LoaderArgs } from '@remix-run/node';
import { getProducts } from '~/models/product.server';

vi.mock('~/models/product.server', () => ({
  getProducts: vi.fn(),
}));

const mockedGetProducts = vi.mocked(getProducts);

describe('FlowersTypeRoute', () => {
  beforeEach(() => {
    mockedGetProducts.mockClear();
  });

  test('the loader throws a 404 if the product does not exist', async () => {
    mockedGetProducts.mockResolvedValueOnce([]);

    await expect(loader({ params: { id: 'invalid' } } as unknown as LoaderArgs)).rejects.toSatisfy((res) => {
      if (res instanceof Response) {
        return res.status === 404;
      }

      return false;
    });
  });
});
