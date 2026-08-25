import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';

/** Vuestic data table used on the contacts and cart pages. */
export class TableComponent extends BasePage {
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.getByRole('table');
    this.rows = page.locator('tbody tr');
  }

  rowByText(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  cell(rowText: string, columnIndex: number): Locator {
    return this.rowByText(rowText).locator(this.tableCell).nth(columnIndex);
  }

  async clickRowAction(rowText: string, columnIndex: number): Promise<void> {
    await this.cell(rowText, columnIndex).locator(this.button).click();
  }

  async tableIsLoaded(): Promise<void> {
    await this.assertElementExist(this.rows.first());
  }

  async assertRowExists(rowText: string): Promise<void> {
    await this.assertElementExist(this.rowByText(rowText));
  }

  async assertRowNotExists(rowText: string): Promise<void> {
    await this.assertElementNotExist(this.rowByText(rowText));
  }

  async assertRowCell(rowText: string, columnIndex: number, expectedValue: string): Promise<void> {
    await this.assertElementContainText(this.cell(rowText, columnIndex), expectedValue);
  }

  async assertRowsCount(count: number): Promise<void> {
    await this.assertElementCount(this.rows, count);
  }

  async assertRowActionNotExists(rowText: string, columnIndex: number): Promise<void> {
    await this.assertElementCount(this.cell(rowText, columnIndex).locator(this.button), 0);
  }
}
