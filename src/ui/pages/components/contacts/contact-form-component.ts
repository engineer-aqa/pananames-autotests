import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { PhonePrefixComponent } from './phone-prefix-component';
import { BUTTONS } from '@pages/constants/buttons';
import { CONTACTS } from '@pages/constants/contacts';
import { ContactData } from '@common/types/test-data.types';

export class ContactFormComponent extends BasePage {
  readonly phonePrefix: PhonePrefixComponent;
  readonly createButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.phonePrefix = new PhonePrefixComponent(page);
    this.createButton = page.getByRole('button', { name: BUTTONS.CREATE });
    this.saveButton = page.getByRole('button', { name: BUTTONS.SAVE });
  }

  async fillContactForm(contact: ContactData): Promise<void> {
    await this.fillField(CONTACTS.FIELD.CONTACT_NAME, contact.name);
    await this.fillField(CONTACTS.FIELD.FIRST_NAME, contact.firstName);
    await this.fillField(CONTACTS.FIELD.LAST_NAME, contact.lastName);
    await this.fillField(CONTACTS.FIELD.EMAIL, contact.email);
    await this.phonePrefix.selectCountry(contact.phoneCountry);
    await this.fillField(CONTACTS.FIELD.PHONE_NUMBER, contact.phoneNumber);

    if (contact.comment !== undefined) {
      await this.fillField(CONTACTS.FIELD.COMMENT, contact.comment);
    }
  }

  async setEmailSubscriptions(subscriptions: Record<string, boolean>): Promise<void> {
    for (const [checkboxLabel, checked] of Object.entries(subscriptions)) {
      await this.setCheckbox(checkboxLabel, checked);
    }
  }

  async submitCreate(): Promise<void> {
    await this.createButton.click();
  }

  async submitSave(): Promise<void> {
    await this.saveButton.click();
  }

  async assertFormIsOpened(): Promise<void> {
    await this.assertElementExist(this.getFieldInput(CONTACTS.FIELD.CONTACT_NAME));
  }

  async assertContactFormValues(contact: ContactData): Promise<void> {
    await this.assertFieldValue(CONTACTS.FIELD.CONTACT_NAME, contact.name);
    await this.assertFieldValue(CONTACTS.FIELD.FIRST_NAME, contact.firstName);
    await this.assertFieldValue(CONTACTS.FIELD.LAST_NAME, contact.lastName);
    await this.assertFieldValue(CONTACTS.FIELD.EMAIL, contact.email);
    await this.assertFieldValue(CONTACTS.FIELD.PHONE_NUMBER, contact.phoneNumber);
    await this.phonePrefix.assertSelectedPrefix(contact.phonePrefix);
  }

  async assertEmailSubscriptions(subscriptions: Record<string, boolean>): Promise<void> {
    for (const [checkboxLabel, checked] of Object.entries(subscriptions)) {
      await this.assertCheckboxState(checkboxLabel, { checked });
    }
  }
}
