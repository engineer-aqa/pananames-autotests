/** Marks the domains searched by the tests. */
export const TEST_DOMAIN_PREFIX = 'pn-aqa';

/** Zones used by the single domain scenario. */
export const DOMAIN_ZONES = {
  COM: '.com',
  NET: '.net',
  ORG: '.org',
} as const;

/** Unique second level domain, so the searched name is always free. */
export function uniqueSld(): string {
  return `${TEST_DOMAIN_PREFIX}-${Date.now()}`;
}
