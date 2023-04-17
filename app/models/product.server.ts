import { redisClient } from '~/redis.server';
import type { CatalogItemObject } from '~/square.server';
import { getAllImages, getLocationCatalogItems } from '~/square.server';
import type { CatalogCustomAttributeValue } from 'square';
import { roundToDecimal } from '~/utils';

export async function getProducts() {
  const productsFromCache = await getProductsFromCache();

  if (process.env.NODE_ENV === 'production' && productsFromCache) return productsFromCache;

  const items = await getLocationCatalogItems();
  const products = await processCatalogItems(items);

  await setProductsToCache(products);

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

async function getProductsFromCache() {
  const result = await redisClient.get('catalog-items');

  if (!result) return null;

  return JSON.parse(result) as Product[];
}

async function setProductsToCache(items: Product[]) {
  await redisClient.set('catalog-items', JSON.stringify(items));
}

type Product = {
  id: string;
  name: string;
  href: string;
  imageSrc: string | null;
  imageAlt?: string;
  description: string;
  descriptionHtml: string;
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

  const imageMap = images.reduce((map, image) => {
    if (!image.id || !image.imageData?.url) return map;

    map[image.id] = image.imageData?.url ?? null;
    return map;
  }, {} as Record<string, string>);

  return items.map((item) => convertCatalogItemToProduct(item, imageMap));
}

function convertCatalogItemToProduct(item: CatalogItemObject, imageMap: Record<string, string>) {
  const { name, imageIds, descriptionHtml, descriptionPlaintext, variations } = item.itemData;

  const productName = name ?? 'Untitled';

  return {
    id: item.id,
    name: productName,
    href: `/products/${item.id}`,
    imageSrc: getImageUrl(imageIds?.[0], imageMap),
    imageAlt: productName,
    description: descriptionPlaintext ?? '',
    descriptionHtml: descriptionHtml ?? '',
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
