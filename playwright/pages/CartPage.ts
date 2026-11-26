import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export class CartPage extends BasePage { 

  readonly cartTriggerButton: Locator; 

  readonly cartDrawer: Locator; 

  readonly cartItemsTable: Locator; 

  readonly subtotalText: Locator; 

  readonly checkoutButton: Locator; 

 

  constructor(page: Page) { 

    super(page); 

    this.cartTriggerButton = page.getByRole('button', { name: /cart/i }).or(page.getByTestId('nav-cart-link')); 

    this.cartDrawer = page.locator('div[data-testid="cart-drawer"]').or(page.getByRole('dialog')); 

    this.cartItemsTable = page.locator('table').or(page.getByTestId('cart-items-table')); 

    this.subtotalText = page.getByText(/subtotal|total/i).first(); 

    this.checkoutButton = page.getByRole('button', { name: /go to checkout|checkout/i }); 

  } 

 

  async openCart(): Promise<void> { 

    await this.cartTriggerButton.click(); 

  } 

 

  async proceedToCheckout(): Promise<void> { 

    await this.checkoutButton.waitFor({ state: 'visible' }); 

    await this.checkoutButton.click(); 

  } 

} 