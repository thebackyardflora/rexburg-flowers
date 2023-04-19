import { getTaxes } from '~/square.server';
import { getDataFromCache, saveDataToCache } from '~/redis.server';

const CATALOG_TAXES = 'catalog-taxes';

export type TaxesMap = Record<string, number>;

export async function getTaxesMap() {
  const taxesFromCache = await getDataFromCache<TaxesMap>(CATALOG_TAXES);

  if (process.env.NODE_ENV === 'production' && taxesFromCache) return taxesFromCache;

  const taxes = await getTaxes();

  const taxesMap = taxes.reduce((acc, tax) => {
    acc[tax.id] = Number(tax.taxData.percentage ?? 0) / 100;

    return acc;
  }, {} as TaxesMap);

  await saveDataToCache(taxesMap, CATALOG_TAXES);

  return taxesMap;
}

export async function refreshTaxesCache() {
  const taxes = await getTaxesMap();

  await saveDataToCache(taxes, CATALOG_TAXES);

  return taxes;
}
