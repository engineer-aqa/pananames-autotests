const BASES = {
  CONTACTS: '/contacts',
  DOMAINS: '/domains',
  REGISTER_DOMAIN: '/register-domain',
  CART: '/cart',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DOMAINS: BASES.DOMAINS,
  REGISTER_DOMAIN: BASES.REGISTER_DOMAIN,
  CART: BASES.CART,
  CONTACTS: {
    LIST: BASES.CONTACTS,
    ADD: `${BASES.CONTACTS}/add`,
    EDIT: `${BASES.CONTACTS}/edit`,
  },
} as const;
