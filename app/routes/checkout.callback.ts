import type { LoaderArgs } from '@remix-run/node';
import { clearCartSession } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  return clearCartSession(request, `/checkout/success?${url.searchParams.toString()}`);
}
