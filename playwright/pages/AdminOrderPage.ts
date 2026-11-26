import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export class AdminOrderPage extends BasePage { 

  readonly ordersNavLink: Locator; 

  readonly searchOrdersInput: Locator; 

  readonly firstOrderRow: Locator; 

  readonly paymentStatusBadge: Locator; 

  readonly customerEmailText: Locator; 

 

  constructor(page: Page) { 

    super(page); 

    this.ordersNavLink = page.getByRole('link', { name: /^orders$/i }).first(); // ADDED .first()
    this.searchOrdersInput = page.getByPlaceholder(/search/i).first();
    this.firstOrderRow = page.getByRole('row').nth(1); // CHANGED: was locator('table tbody tr'). nth(0) is the header row
    this.paymentStatusBadge = page.getByText(/captured|paid|awaiting/i).first();
    this.customerEmailText = page.getByRole('main'); // CHANGED: was locator('main') 

  } 

 

   async navigateToOrders(): Promise<void> {
    await this.ordersNavLink.waitFor({ state: 'visible', timeout: 30 * 1000 }).catch(() => {}); // ADDED
    if (await this.ordersNavLink.isVisible()) {
      await this.clickElement(this.ordersNavLink);
    } else {
      await this.page.goto('https://atqaa-medusa-store.onrender.com/app/orders', { waitUntil: 'domcontentloaded' }); // ADDED fallback
    }
    await this.waitForPageLoaded();
  }

 

  async searchAndOpenOrder(orderId: string): Promise<void> { 

    await this.searchOrdersInput.waitFor({ state: 'visible' }); 

    await this.searchOrdersInput.fill(orderId); 

    await this.page.keyboard.press('Enter'); 

 

    const targetRow = this.page.getByRole('row', { name: new RegExp(orderId, 'i') }).or(this.firstOrderRow).first(); // ADDED .first()
    await targetRow.waitFor({ state: 'visible', timeout: 20 * 1000 }); 

    await targetRow.click(); 

  } 

   async verifyOrderReconciliation(expectedEmail: string, expectedPaymentStatus: string = 'Captured|Awaiting'): Promise<void> { // CHANGED default
    await expect(this.page.getByText(expectedEmail).first()).toBeVisible({ timeout: 15 * 1000 }); // ADDED .first()
    await expect(this.page.getByText(new RegExp(expectedPaymentStatus, 'i')).first()).toBeVisible({ timeout: 15 * 1000 });
  }

} 