import { loader } from './route';
import type { LoaderArgs } from '@remix-run/node';
import { getProductById } from '~/models/product.server';

vi.mock('~/models/product.server', () => ({
  getProductById: vi.fn(),
}));

const mockedGetProductById = vi.mocked(getProductById);

describe('FlowersTypeRoute', () => {
  beforeEach(() => {
    mockedGetProductById.mockClear();
  });

  test('the loader throws a 404 if the product does not exist', async () => {
    mockedGetProductById.mockResolvedValueOnce(null);

    await expect(loader({ params: { id: 'invalid' } } as unknown as LoaderArgs)).rejects.toSatisfy((res) => {
      if (res instanceof Response) {
        return res.status === 404;
      }

      return false;
    });
  });
});
