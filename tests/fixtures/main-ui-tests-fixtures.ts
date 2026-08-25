import { test as base } from '@playwright/test';
import { ContactsPage, LoginPage } from '@pages';
import { ContactsService } from '@api/services/contacts-service';
import { credentials } from '@support/env-config';
import { TestFixtures } from './fixtures.types';

const defaultUser = credentials().user;

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },
  contactsService: async ({}, use) => {
    await use(new ContactsService());
  },
  user: async ({}, use) => {
    await use(defaultUser);
  },
});

export { expect, Locator } from '@playwright/test';
