import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { TableComponent } from '@pages/components/tables/table-component';
import { CART } from '@pages/constants/cart';
import { formatUsd } from '@utils/price';

export class CartPage extends BasePage {
  readonly table: TableComponent;
  readonly totalSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.table = new TableComponent(page);
    this.totalSummary = page.getByText(new RegExp(`${CART.TOTAL_PREFIX}\\s*\\$`)).first();
  }

  async assertItemInCart(domain: string): Promise<void> {
    await this.table.assertRowExists(domain);
  }

  async assertItemsCount(count: number): Promise<void> {
    await this.table.assertRowsCount(count);
  }

  async assertItemTotal(domain: string, expectedPrice: number): Promise<void> {
    await this.table.assertRowCell(domain, CART.COLUMN.TOTAL, formatUsd(expectedPrice));
  }

  async assertCartTotal(expectedPrice: number): Promise<void> {
    await expect(this.totalSummary).toHaveText(new RegExp(`${CART.TOTAL_PREFIX}\\s*\\${formatUsd(expectedPrice)}`));
  }
}
