import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/cart');
});

test('has a heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Shopping Cart/ })).toBeVisible();
});

test('Has an order summary', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Order summary/ })).toBeVisible();
  await expect(page.getByText(/Subtotal/)).toBeVisible();
  await expect(page.getByText(/Tax/)).toBeVisible();
  await expect(page.getByText(/Order total/)).toBeVisible();
});

test('Has a checkout form', async ({ page }) => {
  await expect(page.getByRole('button', { name: /checkout/i })).toBeVisible();
});
