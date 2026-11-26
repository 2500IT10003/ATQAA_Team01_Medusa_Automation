import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export class ProductPage extends BasePage { 

  readonly productGrid: Locator; 
  readonly firstProductCard: Locator; 
  readonly variantSelector: Locator; 
  readonly addToCartButton: Locator; 
  readonly productTitle: Locator;
  readonly priceTag: Locator;

 

  constructor(page: Page) { 

    super(page); 

    this.productGrid = page.getByTestId('products-list').or(page.getByRole('list')).first();  
    this.firstProductCard = page.getByTestId('product-wrapper').first(); 
    this.variantSelector = page.getByRole('button', { name: /select variant|size|color/i }).first(); 
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }); 
    this.productTitle = page.getByRole('heading').first();
    this.priceTag = page.getByTestId('product-price');

  } 

 

  async openCatalog(): Promise<void> { 

    await this.navigateTo('/vn/store'); 

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

    async openProductFromStore(productName: string): Promise<void> {
    await this.navigateTo('/vn/store');
    const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
    await expect(productLink).toBeVisible({ timeout: 20000 });
    await productLink.click();
    await expect(this.page).toHaveURL(/.*products/, { timeout: 15000 });
  }

  async selectSize(size: string): Promise<void> {
    const sizeBtn = this.page.getByRole('button', { name: size, exact: true });
    await expect(sizeBtn).toBeVisible({ timeout: 10000 });
    await sizeBtn.click();
  }

  async selectColor(color: string): Promise<void> {
    const colorBtn = this.page.getByRole('button', { name: color, exact: true });
    await expect(colorBtn).toBeVisible({ timeout: 10000 });
    await colorBtn.click();
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toHaveText(/add to cart/i, { timeout: 15000 });
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
    await this.addToCartButton.click();

    const cartOne = this.page.getByText(/Cart\s*\(1\)/i).first();
    try {
      await expect(cartOne).toBeVisible({ timeout: 15000 });
    } catch {
      if (await this.addToCartButton.isEnabled()) {
        await this.addToCartButton.click();
      }
    }
  }

} 