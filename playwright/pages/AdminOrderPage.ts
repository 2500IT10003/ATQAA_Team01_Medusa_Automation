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

    this.ordersNavLink = page.getByRole('link', { name: /^orders$/i }); 

    this.searchOrdersInput = page.getByPlaceholder(/search/i).first(); 

    this.firstOrderRow = page.locator('table tbody tr').first(); 

    this.paymentStatusBadge = page.getByText(/captured|paid|awaiting/i).first(); 

    this.customerEmailText = page.locator('main'); 

  } 

 

  async navigateToOrders(): Promise<void> { 

    if (await this.ordersNavLink.isVisible()) { 

      await this.clickElement(this.ordersNavLink); 

    } 

    await this.waitForPageLoaded(); 

  } 

 

  async searchAndOpenOrder(orderId: string): Promise<void> { 

    await this.searchOrdersInput.waitFor({ state: 'visible' }); 

    await this.searchOrdersInput.fill(orderId); 

    await this.page.keyboard.press('Enter'); 

 

    const targetRow = this.page.getByRole('row', { name: new RegExp(orderId, 'i') }).or(this.firstOrderRow); 

    await targetRow.waitFor({ state: 'visible', timeout: 20 * 1000 }); 

    await targetRow.click(); 

  } 

 

  async verifyOrderReconciliation(expectedEmail: string, expectedPaymentStatus: string = 'Captured'): Promise<void> { 

    await expect(this.page.getByText(expectedEmail)).toBeVisible({ timeout: 15 * 1000 }); 

    await expect(this.page.getByText(new RegExp(expectedPaymentStatus, 'i')).first()).toBeVisible({ timeout: 15 * 1000 }); 

  } 

} 