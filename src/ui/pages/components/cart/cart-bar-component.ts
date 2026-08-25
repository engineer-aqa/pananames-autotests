import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { BUTTONS } from '@pages/constants/buttons';

/** Sticky bar at the bottom of the domain search page showing the cart summary. */
export class CartBarComponent extends BasePage {
  readonly bar: Locator;
  readonly proceedToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.bar = page.locator('#cart-block');
    this.proceedToCartButton = page.getByRole('button', {
      name: BUTTONS.PROCEED_TO_CART,
    });
  }

  async proceedToCart(): Promise<void> {
    await this.proceedToCartButton.click();
  }

  async assertDomainsCount(count: number): Promise<void> {
    await this.assertElementContainText(this.bar, `${count} domain${count === 1 ? '' : 's'} added to cart`);
  }
}
