import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';

/**
 * Phone prefix picker (vue-country-intl widget).
 * It is not a Vuestic input, so it gets its own component instead of being
 * handled as a regular form field.
 */
export class PhonePrefixComponent extends BasePage {
  /** Search field of the widget; named apart from the `input` of UIBase. */
  readonly countryInput: Locator;
  readonly selectedLabel: Locator;
  readonly selectedLabelText: Locator;

  constructor(page: Page) {
    super(page);
    this.countryInput = page.locator('.country-intl-input');
    this.selectedLabel = page.locator('.country-intl-label').first();
    this.selectedLabelText = page.locator('.country-intl-label-text');
  }

  /**
   * With a country already selected its label covers the input and swallows the
   * click, so the dropdown is opened through whichever element is on top.
   */
  private async openDropdown(): Promise<void> {
    const opener = (await this.selectedLabel.isVisible()) ? this.selectedLabel : this.countryInput;
    await opener.click();
  }

  async selectCountry(country: string): Promise<void> {
    await this.openDropdown();
    await this.countryInput.fill(country);

    const option = this.listItem.filter({ hasText: country }).first();
    await this.assertElementExist(option);
    await option.click();
    await this.assertSelectedCountry(country);
  }

  async assertSelectedCountry(country: string): Promise<void> {
    await this.assertElementContainText(this.selectedLabelText, country);
  }

  /** Several countries share a calling code, so only the digits are asserted. */
  async assertSelectedPrefix(prefix: string): Promise<void> {
    await this.assertElementContainText(this.selectedLabelText, `+${prefix}`);
  }
}
