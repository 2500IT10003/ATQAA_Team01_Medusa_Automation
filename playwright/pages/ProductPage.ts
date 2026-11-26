import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export class ProductPage extends BasePage { 

  readonly productGrid: Locator; 

  readonly firstProductCard: Locator; 

  readonly variantSelector: Locator; 

  readonly addToCartButton: Locator; 

 

  constructor(page: Page) { 

    super(page); 

    this.productGrid = page.locator('ul[data-testid="products-list"]').or(page.getByRole('list')); 

    this.firstProductCard = page.getByTestId('product-wrapper').first(); 

    this.variantSelector = page.getByRole('button', { name: /select variant|size|color/i }).first(); 

    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }); 

  } 

 

  async openCatalog(): Promise<void> { 

    await this.navigateTo('/store'); 

    await this.waitForPageLoaded(); 

  } 

 

  async selectFirstProduct(): Promise<void> { 

    await this.firstProductCard.waitFor({ state: 'visible' }); 

    await this.firstProductCard.click(); 

  } 

 

  async addItemToCart(): Promise<void> { 

    // Select variant if available 

    if (await this.variantSelector.isVisible()) { 

      await this.variantSelector.click(); 

    } 

    await this.addToCartButton.waitFor({ state: 'visible' }); 

    await this.addToCartButton.click(); 

  } 

} 