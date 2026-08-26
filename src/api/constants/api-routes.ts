export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
  },
  USER: {
    GET: '/api/user/get',
  },
  CONTACTS: {
    LIST: '/api/contacts',
    STORE: '/api/contacts/store',
    REMOVE: '/api/contacts/remove',
  },
  CART: {
    GET: '/api/cart/get',
    REMOVE: '/api/cart/remove',
  },
} as const;
