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
  readonly modal: Locator;
  readonly agreeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.getByRole('dialog').filter({ hasText: new RegExp(MODALS.REGISTRATION_NOTICE, 'i') });
    this.agreeButton = this.modal.getByRole('button', { name: new RegExp(BUTTONS.AGREE_ADD_TO_CART, 'i') });
  }

  /** Accepts the notice; does nothing for the zones that do not show one. */
  async acceptWhenShown(timeout = 10000): Promise<void> {
    try {
      await this.modal.waitFor({ state: 'visible', timeout });
      await this.agreeButton.click();
    } catch {
      /* The zone has no registration notice - nothing to accept. */
    }
  }
}
