import { ContactBody } from '@api/types/contacts.types';
import { ContactData } from '@common/types/test-data.types';

/** Marks the contacts created by the tests so cleanup can find them. */
export const TEST_CONTACT_PREFIX = 'aqacontact';

/** Subscription flags the application sends when nothing is changed on the form. */
export const CONTACT_DEFAULTS = {
  comment: '',
  support_requests: false,
  promo_emails: true,
  abuse_emails: false,
  product_emails: false,
  finance_emails: false,
};

/**
 * The "Contact type/NAME" field accepts letters only, so the unique suffix is
 * built from the timestamp digits mapped to letters.
 */
function lettersOnlySuffix(): string {
  return Date.now()
    .toString()
    .replace(/\d/g, digit => 'abcdefghij'[Number(digit)]);
}

export function buildContactData(overrides: Partial<ContactData> = {}): ContactData {
  return {
    name: `${TEST_CONTACT_PREFIX}${lettersOnlySuffix()}`,
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${Date.now()}@example.com`,
    phoneCountry: 'Ukraine',
    phonePrefix: '380',
    phoneNumber: '957000111',
    comment: 'Created by automated test',
    ...overrides,
  };
}

export function toContactBody(contact: ContactData): ContactBody {
  return {
    name: contact.name,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone_prefix: contact.phonePrefix,
    phone_number: contact.phoneNumber,
    comment: contact.comment ?? '',
  };
}
