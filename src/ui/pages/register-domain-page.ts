import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { CartBarComponent } from '@pages/components/cart/cart-bar-component';
import { RegistrationNoticeComponent } from '@pages/components/modals/registration-notice-component';
import { ROUTES } from '@common/constants/routes';
import { BUTTONS } from '@pages/constants/buttons';
import { DOMAIN_SEARCH } from '@pages/constants/cart';
import { parseLastPrice } from '@utils/price';
import { DomainOffer } from '@ui/types/domain.types';

/** Every zone is priced by a request of its own, so the results fill in slowly. */
const RESULTS_TIMEOUT = 30000;

export class RegisterDomainPage extends BasePage {
  readonly cartBar: CartBarComponent;
  readonly registrationNotice: RegistrationNoticeComponent;
  readonly searchInput: Locator;
  readonly resultsList: Locator;
  readonly resultRows: Locator;
  readonly availableRows: Locator;
  readonly availableDomainNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBar = new CartBarComponent(page);
    this.registrationNotice = new RegistrationNoticeComponent(page);
    this.searchInput = page.getByPlaceholder(DOMAIN_SEARCH.SEARCH_PLACEHOLDER);
    this.resultsList = page.locator('.va-list');
    this.resultRows = this.resultsList.getByRole('listitem');
    this.availableRows = this.resultRows
      .filter({ has: page.getByRole('button', { name: BUTTONS.ADD_TO_CART, exact: true }) })
      .filter({ hasText: DOMAIN_SEARCH.SINGLE_YEAR });
    this.availableDomainNames = this.availableRows.locator('.domain-name');
  }

  async openRegisterDomainPage(): Promise<void> {
    await this.page.goto(ROUTES.REGISTER_DOMAIN);
    await this.assertElementExist(this.searchInput);
  }

  async searchDomain(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.assertElementExist(this.resultRows.filter({ hasText: searchTerm }).first(), {
      timeout: RESULTS_TIMEOUT,
    });
  }

  /** Matched exactly, otherwise a ".car" row would also select the ".cars" one. */
  rowByDomain(domain: string): Locator {
    return this.resultRows.filter({ has: this.page.getByText(domain, { exact: true }) });
  }

  /**
   * The first free domains of the results, each with the price it is offered at,
   * in the order they are shown.
   */
  async pickAvailableDomains(count: number): Promise<DomainOffer[]> {
    await this.assertMinElementCount(this.availableRows, count, { timeout: RESULTS_TIMEOUT });
    const names = await this.availableDomainNames.allInnerTexts();
    const offers: DomainOffer[] = [];

    for (const text of names.slice(0, count)) {
      const name = text.trim();
      offers.push({ name, price: await this.getDomainPrice(name) });
    }

    return offers;
  }

  /** Price shown in the search results, promo rows included. */
  async getDomainPrice(domain: string): Promise<number> {
    const row = this.rowByDomain(domain);
    await this.assertElementExist(row.getByRole('button', { name: BUTTONS.ADD_TO_CART, exact: true }));

    return parseLastPrice(await row.innerText());
  }

  /**
   * Zones such as ".net" ask to agree to a registration notice, and until that
   * happens the domain never reaches the cart. Which zones do that is registrar
   * configuration, so rather than assume, the click is followed to whichever of
   * its two outcomes actually happens.
   */
  async addDomainToCart(domain: string): Promise<void> {
    const row = this.rowByDomain(domain);
    const addedLabel = row.getByText(DOMAIN_SEARCH.ADDED_TO_CART).first();
    const notice = this.registrationNotice.modalFor(domain);

    await row.getByRole('button', { name: BUTTONS.ADD_TO_CART, exact: true }).click();
    await this.assertElementExist(addedLabel.or(notice));

    // TODO: ".net" is the only zone known to show the notice - confirm the full list
    if (await notice.isVisible()) {
      await this.registrationNotice.agreeAndAddToCart(domain);
    }

    await this.assertElementExist(addedLabel);
  }

  async proceedToCart(): Promise<void> {
    await this.cartBar.proceedToCart();
    await this.assertUrlContains(ROUTES.CART);
  }

  async assertDomainIsAvailable(domain: string): Promise<void> {
    await this.assertElementContainText(this.rowByDomain(domain), DOMAIN_SEARCH.AVAILABLE);
  }
}
