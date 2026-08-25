import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class ToastComponent extends BasePage {
  readonly toast: Locator;
  readonly toastTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.toast = page.locator('.va-toast');
    this.toastTitle = this.toast.locator('.va-toast__content .font-semibold');
  }

  async assertToastTitle(title: string): Promise<void> {
    await this.assertElementContainText(this.toastTitle, title);
  }

  async assertToastMessage(message: string): Promise<void> {
    await this.assertElementContainText(this.toast, message);
  }
}
