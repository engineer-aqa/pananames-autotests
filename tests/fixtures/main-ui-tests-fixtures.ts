import { test as base } from '@playwright/test';
import { CartPage, ContactsPage, LoginPage, RegisterDomainPage } from '@pages';
import { ContactsService } from '@api/services/contacts-service';
import { CartService } from '@api/services/cart-service';
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
  registerDomainPage: async ({ page }, use) => {
    await use(new RegisterDomainPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  contactsService: async ({}, use) => {
    await use(new ContactsService());
  },
  cartService: async ({}, use) => {
    await use(new CartService());
  },
  user: async ({}, use) => {
    await use(defaultUser);
  },
});

export { expect, Locator } from '@playwright/test';
