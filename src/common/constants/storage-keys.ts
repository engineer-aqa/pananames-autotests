/**
 * localStorage keys the application uses to decide whether a user is signed in.
 * They are filled on the first load after a UI login, so an API login has to
 * write them itself.
 */
export const AUTH_STORAGE_KEYS = {
  ALLOW_DEFAULT_NS: 'auth.allowDefaultNs',
  ORGANIZATION: 'auth.organization',
  ID: 'auth.id',
  BALANCE: 'auth.balance',
  LOGGED_IN: 'auth.loggedIn',
  ROLE: 'auth.role',
  ERROR: 'auth.error',
  FULL_NAME: 'auth.fullName',
  CART_ITEMS_COUNT: 'auth.cartItemsCount',
  PERMISSIONS: 'auth.permissions',
  EMAIL: 'auth.email',
  AGREEMENT_STATUS: 'auth.agreementStatus',
} as const;
