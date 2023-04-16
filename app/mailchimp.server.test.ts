import nock from 'nock';
import { addUserToDefaultList } from '~/mailchimp.server';
import { faker } from '@faker-js/faker';

/**
 * I'm doing more of an integration test here with the mailchimp library because frankly, I don't trust it.
 */

describe('Mailchimp integration', () => {
  test('it should return true if the request is successful', async () => {
    nock(`https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0`)
      .post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`)
      .reply(200);

    await addUserToDefaultList({ email: faker.internet.email() });

    expect(nock.isDone()).toBe(true);
  });

  test('it should return true if the request fails because of a duplicate entry', async () => {
    nock(`https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0`)
      .post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`)
      .reply(400, {
        title: 'Member Exists',
        status: 400,
        detail: faker.lorem.sentence(),
      });

    await addUserToDefaultList({ email: faker.internet.email() });

    expect(nock.isDone()).toBe(true);
  });

  test('it should return false if the request fails because of a different error', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    nock(`https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0`)
      .post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`)
      .reply(400, {
        title: faker.lorem.sentence(),
        status: 400,
        detail: faker.lorem.sentence(),
      });

    await addUserToDefaultList({ email: faker.internet.email() });

    expect(nock.isDone()).toBe(true);

    consoleSpy.mockRestore();
  });
});
