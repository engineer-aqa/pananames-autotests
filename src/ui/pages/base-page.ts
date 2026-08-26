import { expect, Locator, Page } from '@playwright/test';
import { CheckboxOptions, StateCheckOptions } from '@ui/types/action-options.types';

/**
 * Base class for every page object and component.
 * Holds the locators, actions and assertions shared across the app,
 * so that pages and components only describe what is specific to them.
 */
export abstract class BasePage {
  readonly page: Page;

  readonly fieldWrapper: Locator;
  readonly button: Locator;
  readonly tableCell: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.fieldWrapper = page.locator('div.relative');
    this.button = page.getByRole('button');
    this.tableCell = page.getByRole('cell');
  }

  /* ---------- FORM FIELDS ---------- */
  /**
   * The application gives its inputs no accessible name: no `id` or `for` on the
   * label, no `placeholder`, and an `aria-label` that leaks the raw i18n key
   * `$t:inputField` - so `getByLabel`, `getByPlaceholder` and `getByRole` with a
   * name all find nothing. A field is therefore taken as the wrapper holding
   * that label, and the control inside it is addressed by its role.
   */
  getField(label: string): Locator {
    return this.fieldWrapper.filter({ has: this.page.getByText(label, { exact: true }) });
  }

  getFieldInput(label: string): Locator {
    return this.getField(label).getByRole('textbox');
  }

  async fillField(label: string, value: string): Promise<void> {
    await this.getFieldInput(label).fill(value);
  }

  /* ---------- CHECKBOXES ---------- */
  /** Checkboxes are properly labelled, so they are addressed by their label. */
  getCheckbox(label: string): Locator {
    return this.page.getByLabel(label);
  }

  /**
   * The real input is a 1x1 px control sitting under the styled square, so
   * `check()` and `setChecked()` cannot be used: without `force` the
   * actionability check times out, and with `force` the click lands on the
   * input while the component keeps rendering from its own model, which
   * Playwright reports as "clicking the checkbox did not change its state".
   * Clicking the label is what a user does anyway, and it works.
   */
  async setCheckbox(label: string, checked: boolean): Promise<void> {
    if ((await this.getCheckbox(label).isChecked()) !== checked) {
      await this.page.locator('label').filter({ hasText: label }).click();
    }

    await this.assertCheckboxState(label, { checked });
  }

  /* ---------- BASIC ACTIONS ---------- */
  async clickOnButtonByName(button: string): Promise<void> {
    await this.page.getByRole('button', { name: button }).click();
  }

  /* ---------- ASSERTIONS ---------- */
  /** The path of the open page starts with `route`; origin and query are ignored. */
  async assertUrlPath(route: string): Promise<void> {
    await expect(this.page).toHaveURL(url => url.pathname.startsWith(route));
  }

  async assertElementExist(locator: Locator, options?: StateCheckOptions): Promise<void> {
    await expect(locator).toBeVisible(options);
  }

  async assertElementNotExist(locator: Locator, options?: StateCheckOptions): Promise<void> {
    await expect(locator).toBeHidden(options);
  }

  async assertElementContainText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async assertElementCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
  }

  /** Waits until at least `count` elements match, for a list that is still filling in. */
  async assertMinElementCount(locator: Locator, count: number, options?: StateCheckOptions): Promise<void> {
    await expect.poll(() => locator.count(), options).toBeGreaterThanOrEqual(count);
  }

  async assertFieldValue(label: string, value: string): Promise<void> {
    await expect(this.getFieldInput(label)).toHaveValue(value);
  }

  async assertCheckboxState(label: string, { checked }: CheckboxOptions): Promise<void> {
    await expect(this.getCheckbox(label)).toBeChecked({ checked });
  }
}
