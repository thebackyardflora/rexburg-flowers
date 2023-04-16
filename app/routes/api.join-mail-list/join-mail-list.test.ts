import { addUserToDefaultList } from '~/mailchimp.server';
import { action } from '~/routes/api.join-mail-list/route';
import type { ActionArgs } from '@remix-run/node';
import { FormData } from '@remix-run/node';
import { faker } from '@faker-js/faker';

vi.mock('~/mailchimp.server', () => ({
  addUserToDefaultList: vi.fn(),
}));

const mockedAddUserToDefaultList = vi.mocked(addUserToDefaultList);

describe('Join Mail List', () => {
  beforeEach(() => {
    mockedAddUserToDefaultList.mockClear();
  });

  test('it should return {success: true} if the request is successful', async () => {
    mockedAddUserToDefaultList.mockResolvedValue(true);

    const formData = new FormData();
    formData.set('email', faker.internet.email());

    const response = await action({
      request: new Request(faker.internet.url(), { method: 'POST', body: formData }),
    } as ActionArgs);

    const result = await response.json();

    expect(result).toStrictEqual({ success: true });
  });

  test('it should return {success: false} if the request fails', async () => {
    mockedAddUserToDefaultList.mockResolvedValue(false);

    const formData = new FormData();
    formData.set('email', faker.internet.email());

    const response = await action({
      request: new Request(faker.internet.url(), { method: 'POST', body: formData }),
    } as ActionArgs);

    const result = await response.json();

    expect(result).toStrictEqual({ success: false });
  });
});
