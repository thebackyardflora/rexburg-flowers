import type { ActionArgs } from '@remix-run/node';
import { validateEmail } from '~/utils';
import { addUserToDefaultList } from '~/mailchimp.server';
import { json } from '@remix-run/node';

export async function action({ request }: ActionArgs) {
  if (request.method !== 'POST') throw new Response('Method Not Allowed', { status: 405 });

  const formData = await request.formData();
  const email = formData.get('email');

  if (!validateEmail(email)) {
    return json({ success: false }, { status: 400 });
  }

  const success = await addUserToDefaultList({ email: email as string });

  return json({ success });
}
