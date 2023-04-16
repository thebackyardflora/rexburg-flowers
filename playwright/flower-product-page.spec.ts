import { test, expect } from '@playwright/test';

test.describe('Bouquet Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/flowers/bouquets');
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Wrapped Bouquets/ })).toBeVisible();
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

test.describe('Arrangement Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/flowers/arrangements');
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Arrangements/ })).toBeVisible();
  });

  test('lists the available sizes', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /Bud Vase/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Centerpiece/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Side Table/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Classic/ })).toBeVisible();
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

test.describe('CSA Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/flowers/csa');
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CSA Subscription/ })).toBeVisible();
  });

  test('lists the available sizes', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /Full Season/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Sampler/ })).toBeVisible();
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
