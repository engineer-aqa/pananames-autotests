import { Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { TableComponent } from '@pages/components/tables/table-component';
import { ConfirmModalComponent } from '@pages/components/modals/confirm-modal-component';
import { ContactFormComponent } from '@pages/components/contacts/contact-form-component';
import { ToastComponent } from '@pages/components/modals/toast-component';
import { ROUTES } from '@common/constants/routes';
import { BUTTONS } from '@pages/constants/buttons';
import { CONTACTS } from '@pages/constants/contacts';

export class ContactsPage extends BasePage {
  readonly table: TableComponent;
  readonly toast: ToastComponent;
  readonly confirmModal: ConfirmModalComponent;
  readonly contactForm: ContactFormComponent;

  constructor(page: Page) {
    super(page);
    this.table = new TableComponent(page);
    this.toast = new ToastComponent(page);
    this.confirmModal = new ConfirmModalComponent(page);
    this.contactForm = new ContactFormComponent(page);
  }

  async openContactsPage(): Promise<void> {
    await this.page.goto(ROUTES.CONTACTS.LIST);
    await this.table.tableIsLoaded();
  }

  async openAddContactPage(): Promise<void> {
    await this.clickOnButtonByName(BUTTONS.ADD_NEW_CONTACT);
    await this.assertUrlPath(ROUTES.CONTACTS.ADD);
    await this.contactForm.assertFormIsOpened();
  }

  async openEditContactPage(contactName: string): Promise<void> {
    await this.table.clickRowAction(contactName, CONTACTS.COLUMN.EDIT);
    await this.assertUrlPath(ROUTES.CONTACTS.EDIT);
    await this.contactForm.assertFormIsOpened();
  }

  async assertContactInTable(contactName: string, email: string): Promise<void> {
    await this.table.assertRowExists(contactName);
    await this.table.assertRowCell(contactName, CONTACTS.COLUMN.CONTACTS, email);
  }

  async assertContactNotInTable(contactName: string): Promise<void> {
    await this.table.assertRowNotExists(contactName);
  }

  /** Primary and Abuse are built-in contacts: present and without a delete action. */
  async assertDefaultContactsPresent(): Promise<void> {
    for (const contactName of Object.values(CONTACTS.DEFAULT_CONTACT)) {
      await this.table.assertRowExists(contactName);
      await this.table.assertRowActionNotExists(contactName, CONTACTS.COLUMN.DELETE);
    }
  }
}
