/** Marks the domains searched by the tests. */
const TEST_DOMAIN_PREFIX = 'aqadomain';

export const DOMAIN_ZONES = ['.com', '.net', '.org'];

/** Unique second level domain, so the searched name is always free. */
export function uniqueSld(): string {
  return `${TEST_DOMAIN_PREFIX}-${Date.now()}`;
}
