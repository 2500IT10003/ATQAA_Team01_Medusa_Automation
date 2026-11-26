import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage, ShippingDetails } from '../pages/CheckoutPage';

test.describe('Storefront End-to-End Checkout Suite', () => {
  const customerData: ShippingDetails = {
    firstName: 'Minh',
    lastName: 'Nguyen',
    address: '123 Nguyen Hue Street',
    postalCode: '70000',
    city: 'Ho Chi Minh City',
    email: `e2e.customer.${Date.now()}@testmail.com`,
  };

  test('Complete guest checkout journey and capture generated Order ID', async ({ page }) => {
    test.setTimeout(240_000); // ADDED: Render cold start + multi-step checkout

    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Browse Catalog & Select Product  // CHANGED: Classic T-Shirt instead of the first catalog item
    await productPage.openProductFromStore('Classic T-Shirt');

    // 2. Select Variant & Add to Cart      // CHANGED: size and color are both required
    await productPage.selectSize('L');
    await productPage.selectColor('Black');
    await productPage.addToCart();

    // 3. Open Cart & Proceed to Checkout
    await cartPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout/, { timeout: 20000 });

    // 4. Complete Shipping, Delivery & Payment Steps
    await checkoutPage.fillShippingAddress(customerData);
    await checkoutPage.selectShippingMethod();
    await checkoutPage.selectPaymentAndReview();

    // 5. Place Order & Verify Confirmation Heading
    const capturedOrderId = await checkoutPage.placeOrderAndCaptureId();
    await expect(checkoutPage.orderConfirmationHeading).toBeVisible(); // CHANGED: no raw locator in the spec
    expect(capturedOrderId).toBeTruthy();

    // Persist Order ID & Email for Task 6.1.4 Admin Reconciliation
    const stateDir = path.join(__dirname, '../.auth');
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(
      path.join(stateDir, 'order-state.json'),
      JSON.stringify({ orderId: capturedOrderId, email: customerData.email }, null, 2)
    );
  });
});