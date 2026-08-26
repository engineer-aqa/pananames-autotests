import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { BUTTONS } from '@pages/constants/buttons';
import { MODALS } from '@pages/constants/messages';

/**
 * Registration notice some zones (.net among them) show before a domain can be
 * added to the cart. The application renders the labels in upper case, so the
 * buttons are matched case-insensitively.
 */
export class RegistrationNoticeComponent extends BasePage {
  private readonly notice: Locator;

  constructor(page: Page) {
    super(page);
    this.notice = page.getByRole('dialog').filter({ hasText: new RegExp(MODALS.REGISTRATION_NOTICE, 'i') });
  }

  /** The notice of one domain: the dialog names the domain it was opened for. */
  modalFor(domain: string): Locator {
    return this.notice.filter({ hasText: domain });
  }

  /** Agrees to the notice - until that happens the domain never reaches the cart. */
  async agreeAndAddToCart(domain: string): Promise<void> {
    await this.modalFor(domain)
      .getByRole('button', { name: new RegExp(BUTTONS.AGREE_ADD_TO_CART, 'i') })
      .click();
  }
}
