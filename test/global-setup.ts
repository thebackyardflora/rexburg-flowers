import { faker } from '@faker-js/faker';

export default function () {
  process.env.MAILCHIMP_API_KEY = faker.datatype.uuid();
  process.env.MAILCHIMP_LIST_ID = faker.datatype.uuid();
  process.env.MAILCHIMP_SERVER = faker.word.noun();
  process.env.SESSION_SECRET = faker.datatype.uuid();
}
