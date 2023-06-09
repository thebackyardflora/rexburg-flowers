import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
});

test('has proper metadata', async ({ page }) => {
  await expect(page).toHaveTitle(/The Backyard Flora/);
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content', /The Backyard Flora/);
});

test('has a header', async ({ page }) => {
  const header = await page.locator('header');
  await expect(header).toBeVisible();
  await expect(header.getByRole('link', { name: /the backyard flora/i })).toBeVisible();
  await expect(header.getByRole('button', { name: /flowers/i })).toBeVisible();
  await expect(header.getByRole('link', { name: /diy weddings/i })).toBeVisible();
  await expect(header.getByRole('link', { name: /the flower cart/i })).toBeVisible();
});

test('flowers button in header opens the flowers menu', async ({ page }) => {
  const header = await page.locator('header');
  const headerFlyoutPanel = await header.getByTestId('header-flyout-panel');

  await expect(headerFlyoutPanel).toBeHidden();
  await header.getByRole('button', { name: /flowers/i }).click();
  await expect(headerFlyoutPanel).toBeVisible();
  await expect(headerFlyoutPanel.getByRole('link', { name: /csa membership/i })).toBeVisible();
  await expect(headerFlyoutPanel.getByRole('link', { name: /bouquet/i })).toBeVisible();
  await expect(headerFlyoutPanel.getByRole('link', { name: /arrangement/i })).toBeVisible();
});

test('has a hero section with the title, image, and call to action', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Rexburg Grown, Never Flown/ })).toBeVisible();
  await expect(page.getByAltText(/a dahlia flower/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /shop local flowers/i })).toBeVisible();

  await page.getByRole('link', { name: /shop local flowers/i }).click();
  await page.waitForURL(/\/products/);
});

test('has a footer', async ({ page }) => {
  const footer = await page.locator('footer');
  await expect(footer).toBeVisible();
  await expect(footer.getByRole('heading', { name: /products/i })).toBeVisible();
  await expect(footer.getByRole('heading', { name: /company/i })).toBeVisible();
  await expect(footer.getByRole('heading', { name: /services/i })).toBeVisible();

  await expect(footer.getByRole('heading', { name: /sign up for our newsletter/i })).toBeVisible();
  await expect(footer.getByRole('textbox', { name: /email address/i })).toBeVisible();
  await expect(footer.getByRole('button', { name: /sign up/i })).toBeVisible();
});

test('can navigate to the cart', async ({ page }) => {
  await page.getByRole('link', { name: /view cart/i }).click();
  await page.waitForURL(/\/cart/);
});
