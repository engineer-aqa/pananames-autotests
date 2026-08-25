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
