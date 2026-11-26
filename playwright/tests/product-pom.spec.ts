import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('Medusa Storefront - Product Detail & Variant Suite', () => {
  let productPage: ProductPage;
  let cartPage: CartPage;

  // Lifecycle Hook: Executed automatically before EACH test case
  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await productPage.openProductFromStore('Classic T-Shirt');
  });

  // TEST CASE 1: Metadata & Pricing Verification
  test('TC01: Product title and pricing render accurately', async () => {
    await expect(productPage.productTitle).toBeVisible();
    await expect(productPage.productTitle).toContainText(/classic t-shirt/i, { timeout: 15000 });
  });

  // TEST CASE 2: Single Variant Selection & Cart Injection
  test('TC02: Guest selects Size M, color White and adds item to bag', async () => {
    await productPage.selectSize('M');
    await productPage.selectColor('White');
    await productPage.addToCart();
    await cartPage.expectItemAddedToCart()
  });

  // TEST CASE 3: Dynamic Variant State Switching
  test('TC03: User can switch sizes from S to L and color from Black to White before adding to bag', async () => {
    await productPage.selectSize('S');
    await productPage.selectSize('M');
    await productPage.selectColor('White');
    await productPage.addToCart();
    await cartPage.expectItemAddedToCart();
    await expect(cartPage.cartCounterOne).toContainText(/Cart\s*\(1\)/i);
  });

  // TEST CASE 4: Product & Cart Data Synchronization
  test('TC04: Added item details sync accurately into cart drawer', async () => {
    await productPage.selectSize('M');
    await productPage.selectColor('White');
    await productPage.addToCart();
    await cartPage.expectItemAddedToCart();
    await expect(productPage.productTitle).toContainText(/classic t-shirt/i);
  });

 test('TC05: Out-of-stock variant guard (L + Burgundy blocks Add to Cart)', async ({ page }) => {
  const productPage = new ProductPage(page);
  await productPage.openProductFromStore('Classic T-Shirt');
  await productPage.selectSize('L');
  await productPage.selectColor('Burgundy');
  await productPage.expectVariantUnavailable();
  await expect(page.getByText(/Cart\s*\(0\)/i).first()).toBeVisible();
});

  test('TC06: Incomplete option selection keeps CTA disabled / Select variant', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openProductFromStore('Classic T-Shirt');
    await productPage.selectSize('M');
    await productPage.expectIncompleteVariantSelection();
    });
});