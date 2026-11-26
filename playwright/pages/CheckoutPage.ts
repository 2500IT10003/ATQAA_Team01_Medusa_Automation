import { Page, Locator, expect } from '@playwright/test'; 

import { BasePage } from './BasePage'; 

 

export interface ShippingDetails { 

  firstName: string; 

  lastName: string; 

  address: string; 

  postalCode: string; 

  city: string; 

  email: string; 

  phone?: string; 

} 

 

export class CheckoutPage extends BasePage { 

  readonly firstNameInput: Locator; 

  readonly lastNameInput: Locator; 

  readonly addressInput: Locator; 

  readonly postalCodeInput: Locator; 

  readonly cityInput: Locator; 

  readonly emailInput: Locator; 

  readonly continueToDeliveryButton: Locator; 

  readonly shippingMethodRadio: Locator; 

  readonly continueToPaymentButton: Locator; 

  readonly paymentMethodRadio: Locator; 

  readonly continueToReviewButton: Locator; 

  readonly placeOrderButton: Locator; 

  readonly orderConfirmationHeading: Locator; 

  readonly orderIdText: Locator; 

 

  constructor(page: Page) { 

    super(page); 
    const box = page.getByRole('textbox'); // ADDED: field order from the snapshot: 0 first, 1 last, 2 address, 3 company, 4 postal, 5 city, 6 state, 7 email, 8 phone

    // Guest Shipping Address Form Locators 

    this.firstNameInput = page.getByTestId('shipping-first-name-input').or(page.getByLabel(/first name/i)).or(box.nth(0)).first();
    this.lastNameInput = page.getByTestId('shipping-last-name-input').or(page.getByLabel(/last name/i)).or(box.nth(1)).first();
    this.addressInput = page.getByTestId('shipping-address-input').or(page.getByLabel(/address/i).first()).or(box.nth(2)).first();
    this.postalCodeInput = page.getByTestId('shipping-postal-code-input').or(page.getByLabel(/postal code|zip/i)).or(box.nth(4)).first();
    this.cityInput = page.getByTestId('shipping-city-input').or(page.getByLabel(/city/i)).or(box.nth(5)).first();
    this.emailInput = page.getByTestId('shipping-email-input').or(page.getByLabel(/email/i)).or(box.nth(7)).first();
    this.continueToDeliveryButton = page.getByTestId('submit-address-button').or(page.getByRole('button', { name: /continue to delivery/i })).first();

 

    // Delivery / Shipping Step Locators 
    this.shippingMethodRadio = page.getByTestId('delivery-option-radio').first().or(page.getByRole('radio').first()).first();
    this.continueToPaymentButton = page.getByTestId('submit-delivery-option-button').or(page.getByRole('button', { name: /continue to payment/i })).first(); 

    // Payment Step Locators 
    this.paymentMethodRadio = page.getByTestId('payment-method-radio').first().or(page.getByRole('radio').first()).first();
    this.continueToReviewButton = page.getByTestId('submit-payment-button').or(page.getByRole('button', { name: /continue to review/i })).first();
 

    // Final Order Placement & Confirmation Locators 
    this.placeOrderButton = page.getByTestId('submit-order-button').or(page.getByRole('button', { name: /place order/i })).first();
    this.orderConfirmationHeading = page.getByRole('heading', { name: /thank you|order was placed/i }).first();
    this.orderIdText = page.getByTestId('order-id').or(page.getByText(/order_[a-zA-Z0-9]+/)).first();

  } 

 

  async fillShippingAddress(details: ShippingDetails): Promise<void> { 

    await this.fillInput(this.firstNameInput, details.firstName); 

    await this.fillInput(this.lastNameInput, details.lastName); 

    await this.fillInput(this.addressInput, details.address); 

    await this.fillInput(this.postalCodeInput, details.postalCode); 

    await this.fillInput(this.cityInput, details.city); 

    await this.fillInput(this.emailInput, details.email); 

    await this.clickElement(this.continueToDeliveryButton); 

  } 

 

  async selectShippingMethod(): Promise<void> { 

    await this.clickElement(this.shippingMethodRadio); 

    await this.clickElement(this.continueToPaymentButton); 

  } 

 

    async selectPaymentAndReview(): Promise<void> {
    await this.paymentMethodRadio.waitFor({ state: 'visible', timeout: 30 * 1000 }).catch(() => {}); // ADDED
    if (await this.paymentMethodRadio.isVisible()) {
      await this.clickElement(this.paymentMethodRadio);
    }
    await this.continueToReviewButton.waitFor({ state: 'visible', timeout: 30 * 1000 }).catch(() => {}); // ADDED
    if (await this.continueToReviewButton.isVisible()) {
      await this.clickElement(this.continueToReviewButton);
    }
  }

 
    async placeOrderAndCaptureId(): Promise<string> {
    await this.clickElement(this.placeOrderButton);
    await expect(this.orderConfirmationHeading).toBeVisible({ timeout: 30 * 1000 });

    const fromUrl = this.page.url().match(/order_[a-zA-Z0-9]+/); // ADDED: confirmation URL is /vn/order/<id>/confirmed
    if (fromUrl) return fromUrl[0];

    const rawOrderText = await this.orderIdText.innerText();
    const match = rawOrderText.match(/order_[a-zA-Z0-9]+/);
    return match ? match[0] : rawOrderText.trim();
  }

} 