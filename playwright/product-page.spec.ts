import { test, expect } from '@playwright/test';

test.describe('Bouquet Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/products');
    const flowerSection = await page.getByTestId('flower-categories');
    await flowerSection.getByRole('link', { name: /Bouquet/ }).click();
    await page.waitForURL(/\/products\/\w+/);
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Bouquet/ })).toBeVisible();
  });

  test('lists the available sizes', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /Small/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Medium/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Large/ })).toBeVisible();
  });

  test('has a add-to-cart button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  });

  test('has a product information section', async ({ page }) => {
    await expect(page.getByRole('region', { name: /product information/i })).toBeVisible();
  });

  test('has a flower care section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Flower Care/ })).toBeVisible();
  });
});

// test.describe('Navigating between product pages', () => {
//   test('can navigate from the arrangement page to the bouquet page', async ({ page }) => {
//     await page.goto('http://127.0.0.1:3000/flowers/arrangements');
//     await expect(page.getByRole('heading', { name: /Arrangements/ })).toBeVisible();
//     await expect(page.getByRole('radio', { name: /Bud Vase/ })).toBeChecked();
//     await page.getByRole('button', { name: /Flowers/ }).click();
//     await page.getByTestId('header-flyout-panel').getByRole('link', { name: 'Bouquets' }).click();
//     await expect(page.getByTestId('header-flyout-panel')).toBeHidden();
//     await expect(page.getByRole('heading', { name: /Wrapped Bouquets/ })).toBeVisible();
//     await expect(page.getByRole('radio', { name: /Small/ })).toBeChecked();
//   });
// });
