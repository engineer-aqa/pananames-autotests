export const CART = {
  TOTAL_PREFIX: 'TOTAL:',

  /** Column order in the shopping cart table. */
  COLUMN: {
    TOTAL: 6,
  },
} as const;

export const DOMAIN_SEARCH = {
  SEARCH_PLACEHOLDER: 'Enter domain name or keyword',
  AVAILABLE: 'Your domain is available!',
  /** Replaces the button of a row once its domain is in the cart. */
  ADDED_TO_CART: 'Added to cart',
  /** Registration period of the rows the tests buy. */
  SINGLE_YEAR: '1 year',
} as const;
