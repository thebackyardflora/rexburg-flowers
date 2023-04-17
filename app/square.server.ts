import type { CatalogItem } from 'square';
import { ApiError, Client, Environment } from 'square';
import invariant from 'tiny-invariant';
import type { CatalogObject } from 'square/src/models/catalogObject';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production, // process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

const { catalogApi } = client;

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
