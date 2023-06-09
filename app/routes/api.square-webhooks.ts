import type { ActionArgs } from '@remix-run/node';
import type { SquareEvent } from 'square';
import { WebhooksHelper } from 'square';
import { refreshProductCatalogCache } from '~/models/product.server';
import invariant from 'tiny-invariant';
import { refreshTaxesCache } from '~/models/taxes.server';

export async function action({ request }: ActionArgs) {
  invariant(process.env.SQUARE_WEBHOOKS_SECRET, 'Missing SQUARE_WEBHOOKS_SECRET env var');

  // HMAC-SHA-256 signature
  const signature = request.headers.get('x-square-hmacsha256-signature');
  const environment = request.headers.get('square-environment');

  if (!signature || !environment) {
    console.error('Missing headers', { signature, environment });
    return new Response('Missing headers', { status: 400 });
  }

  if (environment !== 'Production') {
    return new Response('Not in production', { status: 200 });
  }

  const body = await request.text();

  const url = new URL(request.url);
  url.protocol = 'https';

  if (
    !WebhooksHelper.isValidWebhookEventSignature(body, signature, process.env.SQUARE_WEBHOOKS_SECRET, url.toString())
  ) {
    console.error('Invalid signature', { signature, body, requestUrl: url.toString() });
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body) as SquareEvent;

  if (event.type === 'catalog.version.updated') {
    console.info('Catalog version updated, refreshing products');
    await refreshCatalogCache();
  }

  return new Response('OK', { status: 200 });
}

async function refreshCatalogCache() {
  await refreshProductCatalogCache();
  await refreshTaxesCache();
}
