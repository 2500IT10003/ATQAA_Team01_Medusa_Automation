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

    // Guest Shipping Address Form Locators 

    this.firstNameInput = page.getByTestId('shipping-first-name-input').or(page.getByLabel(/first name/i)); 

    this.lastNameInput = page.getByTestId('shipping-last-name-input').or(page.getByLabel(/last name/i)); 

    this.addressInput = page.getByTestId('shipping-address-input').or(page.getByLabel(/address/i).first()); 

    this.postalCodeInput = page.getByTestId('shipping-postal-code-input').or(page.getByLabel(/postal code|zip/i)); 

    this.cityInput = page.getByTestId('shipping-city-input').or(page.getByLabel(/city/i)); 

    this.emailInput = page.getByTestId('shipping-email-input').or(page.getByLabel(/email/i)); 

    this.continueToDeliveryButton = page.getByTestId('submit-address-button').or(page.getByRole('button', { name: /continue to delivery/i })); 

 

    // Delivery / Shipping Step Locators 

    this.shippingMethodRadio = page.getByTestId('delivery-option-radio').first().or(page.getByRole('radio').first()); 

    this.continueToPaymentButton = page.getByTestId('submit-delivery-option-button').or(page.getByRole('button', { name: /continue to payment/i })); 

 

    // Payment Step Locators 

    this.paymentMethodRadio = page.getByTestId('payment-method-radio').first().or(page.getByRole('radio').first()); 

    this.continueToReviewButton = page.getByTestId('submit-payment-button').or(page.getByRole('button', { name: /continue to review/i })); 

 

    // Final Order Placement & Confirmation Locators 

    this.placeOrderButton = page.getByTestId('submit-order-button').or(page.getByRole('button', { name: /place order/i })); 

    this.orderConfirmationHeading = page.getByRole('heading', { name: /thank you|order was placed/i }); 

    this.orderIdText = page.getByTestId('order-id').or(page.locator('span:has-text("order_")')); 

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

    if (await this.paymentMethodRadio.isVisible()) { 

      await this.clickElement(this.paymentMethodRadio); 

    } 

    if (await this.continueToReviewButton.isVisible()) { 

      await this.clickElement(this.continueToReviewButton); 

    } 

  } 

 

  async placeOrderAndCaptureId(): Promise<string> { 

    await this.clickElement(this.placeOrderButton); 

    await expect(this.orderConfirmationHeading).toBeVisible({ timeout: 30 * 1000 }); 

     

    const rawOrderText = await this.orderIdText.innerText(); 

    const match = rawOrderText.match(/order_[a-zA-Z0-9]+/); 

    return match ? match[0] : rawOrderText.trim(); 

  } 

} 