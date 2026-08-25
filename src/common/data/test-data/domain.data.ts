import { DomainZone } from '@common/types/test-data.types';

/** Marks the domains searched by the tests. */
export const TEST_DOMAIN_PREFIX = 'aqadomain';

export const DOMAIN_ZONES: Record<string, DomainZone> = {
  COM: { name: '.com', hasRegistrationNotice: false },
  NET: { name: '.net', hasRegistrationNotice: true },
  ORG: { name: '.org', hasRegistrationNotice: false },
};

/** Unique second level domain, so the searched name is always free. */
export function uniqueSld(): string {
  return `${TEST_DOMAIN_PREFIX}-${Date.now()}`;
}
