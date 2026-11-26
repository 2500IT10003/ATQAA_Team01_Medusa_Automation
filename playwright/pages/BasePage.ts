import { Page, Locator, expect } from '@playwright/test'; 

 

export abstract class BasePage { 

  readonly page: Page; 

 

  constructor(page: Page) { 

    this.page = page; 

  } 

 

  /** 

   * Navigates to a specific path relative to the baseURL 

   * @param path Relative URL path 

   */ 

  async navigateTo(path: string = ''): Promise<void> { 

    await this.page.goto(path, { waitUntil: 'domcontentloaded' }); 

  } 

 

  /** 

   * Waits for network and DOM stabilization without hardcoded sleep commands 

   */ 

  async waitForPageLoaded(): Promise<void> { 

    await this.page.waitForLoadState('domcontentloaded'); 

  } 

 

  /** 

   * Safe click enforcing Playwright built-in auto-waiting 

   */ 

  async clickElement(locator: Locator): Promise<void> { 
    await locator.first().waitFor({ state: 'visible' }); 
    await locator.click(); 

  } 

 

  /** 

   * Fills an input field using accessibility-friendly actionability 

   */ 

  async fillInput(locator: Locator, text: string): Promise<void> { 
    await locator.first().waitFor({ state: 'visible' });
    await locator.fill(text); 

  } 

} 