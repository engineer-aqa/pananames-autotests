import { test } from '@fixtures/main-ui-tests-fixtures';
import { CONTACTS } from '@pages/constants/contacts';
import { MODALS, TOAST_MESSAGES } from '@pages/constants/messages';
import { buildContactData, toContactBody } from '@support/contact.data';

const { FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER } = CONTACTS.FIELD;
const { PROMO_EMAILS, PRODUCT_EMAILS, FINANCE_EMAILS } = CONTACTS.CHECKBOX;

test.describe('Contacts CRUD', () => {
  test.beforeEach(async ({ loginPage, user, contactsService, contactsPage }) => {
    await loginPage.loginViaApi(user);
    await contactsService.deleteContacts();
    await contactsPage.openContactsPage();
  });

  test.afterEach(async ({ contactsService }) => {
    await contactsService.deleteContacts();
  });

  test('Verify creating a new contact', async ({ contactsPage }) => {
    const contact = buildContactData();
    const subscriptions = {
      [PROMO_EMAILS]: false,
      [PRODUCT_EMAILS]: true,
      [FINANCE_EMAILS]: true,
    };

    await test.step('Open the Create new contact form', async () => {
      await contactsPage.openAddContactPage();
    });

    await test.step('Fill in the contact details and the email subscriptions', async () => {
      await contactsPage.contactForm.fillContactForm(contact);
      await contactsPage.contactForm.setEmailSubscriptions(subscriptions);
    });

    await test.step('Submit the form and verify the success toast', async () => {
      await contactsPage.contactForm.submitCreate();
      await contactsPage.toast.assertToastTitle(TOAST_MESSAGES.SUCCESS);
    });

    await test.step('Verify the new contact is displayed in the table', async () => {
      await contactsPage.assertContactInTable(contact.name, contact.email);
    });

    await test.step('Reopen the contact and verify the values and checkbox states were saved', async () => {
      await contactsPage.openEditContactPage(contact.name);
      await contactsPage.contactForm.assertContactFormValues(contact);
      await contactsPage.contactForm.assertEmailSubscriptions(subscriptions);
    });
  });

  test('Verify editing an existing contact', async ({ contactsPage, contactsService }) => {
    const contact = buildContactData();
    const updatedContact = buildContactData({
      name: contact.name,
      firstName: 'Jane',
      lastName: 'Smith',
      phoneCountry: 'Poland',
      phonePrefix: '48',
      phoneNumber: '221230456',
    });
    const updatedSubscriptions = {
      [PROMO_EMAILS]: false,
      [PRODUCT_EMAILS]: true,
    };

    await test.step('Create a contact via API', async () => {
      await contactsService.createContact(toContactBody(contact));
      await contactsPage.openContactsPage();
      await contactsPage.assertContactInTable(contact.name, contact.email);
    });

    await test.step('Open the contact for editing and verify the prefilled values', async () => {
      await contactsPage.openEditContactPage(contact.name);
      await contactsPage.contactForm.assertContactFormValues(contact);
    });

    await test.step('Change the contact details and the email subscriptions', async () => {
      await contactsPage.contactForm.fillField(FIRST_NAME, updatedContact.firstName);
      await contactsPage.contactForm.fillField(LAST_NAME, updatedContact.lastName);
      await contactsPage.contactForm.fillField(EMAIL, updatedContact.email);
      await contactsPage.contactForm.phonePrefix.selectCountry(updatedContact.phoneCountry);
      await contactsPage.contactForm.fillField(PHONE_NUMBER, updatedContact.phoneNumber);
      await contactsPage.contactForm.setEmailSubscriptions(updatedSubscriptions);
    });

    await test.step('Save the changes and verify the success toast', async () => {
      await contactsPage.contactForm.submitSave();
      await contactsPage.toast.assertToastTitle(TOAST_MESSAGES.SUCCESS);
    });

    await test.step('Verify the updated contact is displayed in the table', async () => {
      await contactsPage.assertContactInTable(updatedContact.name, updatedContact.email);
    });

    await test.step('Reopen the contact and verify the changes were saved', async () => {
      await contactsPage.openEditContactPage(updatedContact.name);
      await contactsPage.contactForm.assertContactFormValues(updatedContact);
      await contactsPage.contactForm.assertEmailSubscriptions({
        ...updatedSubscriptions,
        [FINANCE_EMAILS]: false,
      });
    });
  });

  test('Verify deleting an existing contact', async ({ contactsPage, contactsService }) => {
    const contact = buildContactData();

    await test.step('Create a contact via API', async () => {
      await contactsService.createContact(toContactBody(contact));
      await contactsPage.openContactsPage();
      await contactsPage.assertContactInTable(contact.name, contact.email);
    });

    await test.step('Click delete and verify the confirmation modal', async () => {
      await contactsPage.table.clickRowAction(contact.name, CONTACTS.COLUMN.DELETE);
      await contactsPage.confirmModal.assertModalMessage(MODALS.DELETE_CONTACT);
    });

    await test.step('Confirm the deletion and verify the success toast', async () => {
      await contactsPage.confirmModal.confirm();
      await contactsPage.toast.assertToastMessage(TOAST_MESSAGES.CONTACT_REMOVED);
    });

    await test.step('Verify the contact is removed from the table', async () => {
      await contactsPage.assertContactNotInTable(contact.name);
    });

    await test.step('Verify the default Primary and Abuse contacts are not affected', async () => {
      await contactsPage.assertDefaultContactsPresent();
    });
  });
});
