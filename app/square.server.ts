import type { CatalogItem, CatalogTax, OrderLineItem } from 'square';
import { ApiError, Client, Environment } from 'square';
import invariant from 'tiny-invariant';
import type { CatalogObject } from 'square/src/models/catalogObject';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

const { catalogApi, checkoutApi, ordersApi, paymentsApi } = client;

export async function getLocationCatalogItems() {
  invariant(process.env.SQUARE_LOCATION_ID, 'SQUARE_LOCATION_ID is required');

  try {
    const searchCatalogItemsResponse = await catalogApi.searchCatalogItems({
      enabledLocationIds: [process.env.SQUARE_LOCATION_ID],
    });

    return (searchCatalogItemsResponse.result.items ?? []).filter(isCatalogItemObject);
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', error);
    }
    throw new Error('Unable to fetch products from Square');
  }
}

export interface CatalogItemObject extends CatalogObject {
  type: 'ITEM';
  itemData: CatalogItem;
}

function isCatalogItemObject(object: CatalogObject): object is CatalogItemObject {
  return object.type === 'ITEM';
}

export async function getAllImages(ids: string[]) {
  try {
    const response = await catalogApi.listCatalog(undefined, 'image');

    return response.result.objects ?? [];
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', error);
    }
    throw new Error('Unable to fetch products from Square');
  }
}

export async function createCheckoutUrl(origin: string, lineItems: OrderLineItem[], taxIds: string[]) {
  invariant(process.env.SQUARE_LOCATION_ID, 'SQUARE_LOCATION_ID is required');

  try {
    const response = await checkoutApi.createPaymentLink({
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        source: {
          name: 'rexburgflowers.com',
        },
        lineItems,
        taxes: taxIds.length ? taxIds.map((id) => ({ catalogObjectId: id, uid: id, scope: 'LINE_ITEM' })) : undefined,
      },
      checkoutOptions: {
        redirectUrl: `${origin}/checkout/callback`,
      },
    });

    const url = response.result.paymentLink?.url ?? null;

    if (!url) {
      throw new Error('Unable to create square payment link');
    }

    return url;
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', error);
    }
    throw new Error('Unable to create square payment link');
  }
}

export async function getOrder(orderId: string) {
  try {
    const order = await ordersApi.retrieveOrder(orderId);

    return order.result.order ?? null;
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', error);
    }
    throw new Error('Unable to fetch order from Square');
  }
}

export async function getPayment(paymentId: string) {
  try {
    const payment = await paymentsApi.getPayment(paymentId);

    return payment.result.payment ?? null;
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', error);
    }
    throw new Error('Unable to fetch payment from Square');
  }
}

export async function getTaxes() {
  try {
    const taxes = await catalogApi.listCatalog(undefined, 'tax');

    return (taxes.result.objects ?? []).filter(isCatalogTaxObject);
  } catch (err) {
    if (err instanceof ApiError) {
      err.result.errors.forEach(function (e: any) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log('Unexpected error occurred: ', err);
    }
    throw new Error('Unable to fetch taxes from Square');
  }
}

export interface CatalogTaxObject extends CatalogObject {
  type: 'TAX';
  taxData: CatalogTax;
}

function isCatalogTaxObject(object: CatalogObject): object is CatalogTaxObject {
  return object.type === 'TAX';
}
