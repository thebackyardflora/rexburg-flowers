import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/products');
});

test('has a heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Shop Our Flowers/ })).toBeVisible();
});

test('lists the available products', async ({ page }) => {
  const flowerSection = await page.getByTestId('flower-categories');

  await expect(flowerSection.getByRole('link', { name: /Bouquet/ })).toBeVisible();
  await expect(flowerSection.getByRole('link', { name: /Arrangement/ })).toBeVisible();
  await expect(flowerSection.getByRole('link', { name: /CSA Membership/ })).toBeVisible();
});
