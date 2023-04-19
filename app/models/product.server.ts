import { getDataFromCache, saveDataToCache } from '~/redis.server';
import type { CatalogItemObject } from '~/square.server';
import { getAllImages, getLocationCatalogItems } from '~/square.server';
import type { CatalogCustomAttributeValue } from 'square';
import { roundToDecimal } from '~/utils';
import type { TaxesMap } from '~/models/taxes.server';
import { getTaxesMap } from '~/models/taxes.server';

const CATALOG_ITEMS = 'catalog-items';

export async function getProducts() {
  const productsFromCache = await getDataFromCache<Product[]>(CATALOG_ITEMS);

  if (process.env.NODE_ENV === 'production' && productsFromCache) return productsFromCache;

  const items = await getLocationCatalogItems();
  const products = await processCatalogItems(items);

  await saveDataToCache(products, CATALOG_ITEMS);

  return products;
}

export async function refreshProductCatalogCache() {
  const items = await getLocationCatalogItems();
  const products = await processCatalogItems(items);

  await saveDataToCache(products, CATALOG_ITEMS);

  return products;
}

export async function getProductById(id: string) {
  const products = await getProducts();

  return products.find((product) => product.id === id) ?? null;
}

export async function getFeaturedProducts() {
  const products = await getProducts();

  return products.slice(0, 3).map((product) => ({
    id: product.id,
    name: product.name,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
  }));
}

export type Product = {
  id: string;
  name: string;
  href: string;
  imageSrc: string | null;
  imageAlt?: string;
  description: string;
  descriptionHtml: string;
  taxIds: string[];
  taxPercent: number;
  variants: {
    id: string;
    name: string;
    description: string | null;
    imageSrc: string | null;
    imageAlt?: string;
    price: number;
  }[];
};

async function processCatalogItems(items: CatalogItemObject[]) {
  const imageIds = getAllImageIds(items);
  const images = await getAllImages(imageIds);
  const taxesMap = await getTaxesMap();

  const imageMap = images.reduce((map, image) => {
    if (!image.id || !image.imageData?.url) return map;

    map[image.id] = image.imageData?.url ?? null;
    return map;
  }, {} as Record<string, string>);

  return items.map((item) => convertCatalogItemToProduct(item, imageMap, taxesMap));
}

function convertCatalogItemToProduct(item: CatalogItemObject, imageMap: Record<string, string>, taxesMap: TaxesMap) {
  const { name, imageIds, descriptionHtml, descriptionPlaintext, variations, taxIds } = item.itemData;

  const productName = name ?? 'Untitled';
  const taxes = taxIds?.map((taxId) => taxesMap[taxId]) ?? [];
  const totalTaxPercent = taxes.reduce((acc, tax) => {
    return acc + tax;
  }, 0);

  return {
    id: item.id,
    name: productName,
    href: `/products/${item.id}`,
    imageSrc: getImageUrl(imageIds?.[0], imageMap),
    imageAlt: productName,
    description: descriptionPlaintext ?? '',
    descriptionHtml: descriptionHtml ?? '',
    taxPercent: totalTaxPercent,
    taxIds: taxIds ?? [],
    variants:
      variations?.map((variation) => ({
        id: variation.id,
        name: variation.itemVariationData?.name ?? 'Untitled',
        description: getCustomAttributeByName(variation.customAttributeValues, 'Description')?.stringValue ?? null,
        imageSrc: getImageUrl(variation.itemVariationData?.imageIds?.[0], imageMap),
        imageAlt: variation.itemVariationData?.name ?? undefined,
        price: roundToDecimal((Number(variation.itemVariationData?.priceMoney?.amount) ?? 0) / 100, 2),
      })) ?? [],
  } satisfies Product;
}

function getCustomAttributeByName(
  customAttributes: Record<string, CatalogCustomAttributeValue> | null | undefined,
  name: string
) {
  if (!customAttributes) return null;

  return Object.values(customAttributes).find((attribute) => attribute.name === name);
}

function getImageUrl(imageId: string | null | undefined, imageMap: Record<string, string>) {
  return imageId ? imageMap[imageId] : null;
}

function getAllImageIds(items: CatalogItemObject[]) {
  const imageIds = items.flatMap((item) => [
    ...(item.itemData.imageIds ?? []),
    ...(item.itemData.variations?.flatMap((variation) => variation.itemVariationData?.imageIds ?? []) ?? []),
  ]);

  return [...new Set(imageIds)];
}
