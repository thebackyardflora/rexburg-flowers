import { loader } from './route';
import type { LoaderArgs } from '@remix-run/node';
import { productMap, productTypes } from '~/routes/flowers_.$type/product-map';

describe('FlowersTypeRoute', () => {
  test('the loader throws a 404 if the type is invalid', async () => {
    await expect(loader({ params: { type: 'invalid' } } as unknown as LoaderArgs)).rejects.toSatisfy((res) => {
      if (res instanceof Response) {
        return res.status === 404;
      }

      return false;
    });
  });

  test.each(productTypes)('the loader returns the correct data for %s', async (type) => {
    const response = await loader({ params: { type } } as unknown as LoaderArgs);

    expect(await response.json()).toStrictEqual({ product: productMap[type] });
  });
});
