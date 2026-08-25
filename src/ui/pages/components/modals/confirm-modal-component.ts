import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { BUTTONS } from '@pages/constants/buttons';

export class ConfirmModalComponent extends BasePage {
  readonly modal: Locator;
  readonly okButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.locator('.va-modal');
    this.okButton = this.modal.getByRole('button', { name: BUTTONS.OK });
  }

  async confirm(): Promise<void> {
    await this.okButton.click();
    await this.assertElementNotExist(this.modal);
  }

  async assertModalMessage(message: string): Promise<void> {
    await this.assertElementContainText(this.modal, message);
  }
}
