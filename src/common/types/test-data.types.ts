export interface ContactData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Country as displayed in the phone prefix dropdown, e.g. "Ukraine". */
  phoneCountry: string;
  /** Calling code without the leading "+", e.g. "380". */
  phonePrefix: string;
  phoneNumber: string;
  comment?: string;
}

export interface DomainZone {
  name: string;
  /** Zones with a registration notice require confirming it before the domain reaches the cart. */
  hasRegistrationNotice: boolean;
}
