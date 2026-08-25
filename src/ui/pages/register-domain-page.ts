import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { CartBarComponent } from '@pages/components/cart/cart-bar-component';
import { RegistrationNoticeComponent } from '@pages/components/modals/registration-notice-component';
import { ROUTES } from '@common/constants/routes';
import { API_ROUTES } from '@api/constants/api-routes';
import { BUTTONS } from '@pages/constants/buttons';
import { DOMAIN_SEARCH } from '@pages/constants/cart';
import { parseLastPrice } from '@utils/price';
import { DomainZone } from '@common/types/test-data.types';

export class RegisterDomainPage extends BasePage {
  readonly cartBar: CartBarComponent;
  readonly registrationNotice: RegistrationNoticeComponent;
  readonly searchInput: Locator;
  readonly resultsList: Locator;
  readonly resultRows: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBar = new CartBarComponent(page);
    this.registrationNotice = new RegistrationNoticeComponent(page);
    this.searchInput = page.getByPlaceholder(DOMAIN_SEARCH.SEARCH_PLACEHOLDER);
    this.resultsList = page.locator('.va-list');
    this.resultRows = this.resultsList.getByRole('listitem');
  }

  async openRegisterDomainPage(): Promise<void> {
    await this.page.goto(ROUTES.REGISTER_DOMAIN);
    await this.assertElementExist(this.searchInput);
  }

  async searchDomain(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.assertElementExist(this.rowByDomain(searchTerm), { timeout: 30000 });
  }

  rowByDomain(domain: string): Locator {
    return this.resultRows.filter({ hasText: domain }).first();
  }

  /** Price shown in the search results, promo rows included. */
  async getDomainPrice(domain: string): Promise<number> {
    const row = this.rowByDomain(domain);
    await this.assertElementExist(row.getByRole('button', { name: BUTTONS.ADD_TO_CART }));
    return parseLastPrice(await row.innerText());
  }

  /**
   * Waiting for the request itself keeps the action deterministic: the result
   * list re-renders while the remaining zones load, so a click can land on a
   * row that is being replaced, and the failure would otherwise be silent.
   */
  async addDomainToCart(domain: string, { hasRegistrationNotice }: DomainZone): Promise<void> {
    await this.rowByDomain(domain).getByRole('button', { name: BUTTONS.ADD_TO_CART }).click();
    if (hasRegistrationNotice) {
      await this.registrationNotice.accept(domain);
    }
    await this.waitForResponse('POST', `${API_ROUTES.REGISTER_DOMAIN.ADD_TO_CART}/${domain}/add-to-cart`);
  }

  async proceedToCart(): Promise<void> {
    await this.cartBar.proceedToCart();
    await this.assertUrlContains(ROUTES.CART);
  }

  async assertDomainIsAvailable(domain: string): Promise<void> {
    await this.assertElementContainText(this.rowByDomain(domain), DOMAIN_SEARCH.AVAILABLE);
  }
}
