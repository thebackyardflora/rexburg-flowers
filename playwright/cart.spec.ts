import { test, expect } from '@playwright/test';

test.describe('static elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/cart');
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Shopping Cart/ })).toBeVisible();
  });

  test('has an order summary', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Order summary/ })).toBeVisible();
    await expect(page.getByText(/Subtotal/)).toBeVisible();
    await expect(page.getByText(/Tax/)).toBeVisible();
    await expect(page.getByText(/Order total/)).toBeVisible();
  });

  test('has a checkout button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /checkout/i })).toBeVisible();
  });

  test('has an empty state', async ({ page }) => {
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
  });
});

test('allows a user to update item quantity', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/products');
  const flowerSection = await page.getByTestId('flower-categories');
  await flowerSection.getByRole('link', { name: /Bouquet/ }).click();
  await page.waitForURL(/\/products\/\w+/);
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.waitForURL(/\/cart/);
  await expect(page.getByRole('link', { name: /1 items in cart/ })).toBeVisible();
  const itemsRegion = await page.getByRole('region', { name: /items in your shopping cart/i });
  await expect(itemsRegion.getByRole('link', { name: /Bouquet/ })).toBeVisible();
  await page.getByRole('combobox', { name: /quantity/i }).selectOption('4');
  await page.getByRole('link', { name: /4 items in cart/ }).click();
});

test('allows a user to remove an item from the cart', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/products');
  const flowerSection = await page.getByTestId('flower-categories');
  await flowerSection.getByRole('link', { name: /Bouquet/ }).click();
  await page.waitForURL(/\/products\/\w+/);
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.waitForURL(/\/cart/);
  await expect(page.getByRole('link', { name: /1 items in cart/ })).toBeVisible();
  const itemsRegion = await page.getByRole('region', { name: /items in your shopping cart/i });
  await expect(itemsRegion.getByRole('link', { name: /Bouquet/ })).toBeVisible();
  await page.getByRole('button', { name: /remove/i }).click();
  await expect(page.getByRole('link', { name: /0 items in cart/ })).toBeVisible();
});
