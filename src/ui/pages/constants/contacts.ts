export const CONTACTS = {
  FIELD: {
    CONTACT_NAME: 'Contact type/NAME',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    EMAIL: 'Email',
    PHONE_NUMBER: 'Phone number',
    COMMENT: 'Comment (optional)',
  },

  CHECKBOX: {
    PROMO_EMAILS: 'Send promotional emails',
    PRODUCT_EMAILS: 'Send product emails',
    FINANCE_EMAILS: 'Send financial emails',
  },

  /** Column order in the contacts table. */
  COLUMN: {
    CONTACTS: 1,
    EDIT: 2,
    DELETE: 3,
  },

  /** Built-in contacts: always present and not deletable. */
  DEFAULT_CONTACT: {
    PRIMARY: 'Primary',
    ABUSE: 'Abuse',
  },
} as const;
