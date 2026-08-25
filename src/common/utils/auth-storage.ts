import { UserResponse } from '@api/types/user.types';
import { LocalStorageEntry } from '@api/types/auth.types';
import { AUTH_STORAGE_KEYS } from '@constants/storage-keys';

/**
 * Builds the `auth.*` values the application keeps in localStorage out of the
 * user profile. Its router decides whether the visitor is signed in by these
 * values rather than by the session cookie, so an API login has to write them
 * itself - otherwise the first opened page bounces to the login screen.
 */
export function toAuthStorage(profile: UserResponse): LocalStorageEntry[] {
  const { user, role, permissions, cart_items_count: cartItemsCount } = profile;
  const { merchant } = user;

  const values: Record<string, string> = {
    [AUTH_STORAGE_KEYS.ID]: String(user.id),
    [AUTH_STORAGE_KEYS.EMAIL]: user.email,
    [AUTH_STORAGE_KEYS.FULL_NAME]: user.full_name,
    [AUTH_STORAGE_KEYS.ORGANIZATION]: user.organization,
    [AUTH_STORAGE_KEYS.ROLE]: JSON.stringify(role),
    [AUTH_STORAGE_KEYS.PERMISSIONS]: JSON.stringify(permissions),
    [AUTH_STORAGE_KEYS.BALANCE]: String(Number(merchant.balance)),
    [AUTH_STORAGE_KEYS.ALLOW_DEFAULT_NS]: String(merchant.allow_default_ns),
    [AUTH_STORAGE_KEYS.AGREEMENT_STATUS]: merchant.agreement,
    [AUTH_STORAGE_KEYS.CART_ITEMS_COUNT]: String(cartItemsCount),
    [AUTH_STORAGE_KEYS.LOGGED_IN]: 'true',
    [AUTH_STORAGE_KEYS.ERROR]: '',
  };

  return Object.entries(values).map(([name, value]) => ({ name, value }));
}
