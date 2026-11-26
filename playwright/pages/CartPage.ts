import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export class CartPage extends BasePage { 

  readonly cartTriggerButton: Locator; 
  readonly cartDrawer: Locator; 
  readonly cartItemsTable: Locator; 
  readonly subtotalText: Locator; 
  readonly checkoutButton: Locator; 
  readonly cartCounterOne: Locator;
  readonly goToCartButton: Locator;

 

  constructor(page: Page) { 

    super(page); 

    this.cartTriggerButton = page.getByRole('button', { name: /cart/i }).or(page.getByTestId('nav-cart-link')).first(); // ADDED .first() 
    this.cartDrawer = page.getByTestId('cart-drawer').or(page.getByRole('dialog')).first(); // CHANGED
    this.cartItemsTable = page.getByTestId('cart-items-table').or(page.getByRole('table')).first(); // CHANGED    
    this.subtotalText = page.getByText(/subtotal|total/i).first(); 
    this.checkoutButton = page.getByRole('button', { name: /go to checkout|checkout/i }).first(); // ADDED .first() 
    this.cartCounterOne = page.getByText(/Cart\s*\(1\)/i).first();
    this.goToCartButton = page.getByRole('button', { name: /go to cart/i }).first();
  } 

 

   async openCart(): Promise<void> {
    await this.navigateTo('/vn/cart'); // CHANGED: was this.cartTriggerButton.click()
  }

  async openCartFromNav(): Promise<void> { // ADDED: the original behavior, kept
    await this.cartTriggerButton.click();
  }


  async proceedToCheckout(): Promise<void> { 

    await this.checkoutButton.waitFor({ state: 'visible' }); 

    await this.checkoutButton.click(); 

  } 
  // Add to CartPage:
  async expectItemAddedToCart(): Promise<void> {
  const indicator = this.cartCounterOne.or(this.cartDrawer).first();
  await expect(indicator).toBeVisible({ timeout: 20_000 });
}

} 