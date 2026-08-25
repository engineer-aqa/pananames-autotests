export interface Contact {
  id: number;
  name: string;
  email: string;
  primary: boolean;
  abuse: boolean;
}

export interface ContactsListResponse {
  page: number;
  per_page: number;
  total: number;
  contacts: Contact[];
}

export interface ContactBody {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_prefix: string;
  phone_number: string;
  comment?: string;
  support_requests?: boolean;
  promo_emails?: boolean;
  abuse_emails?: boolean;
  product_emails?: boolean;
  finance_emails?: boolean;
}
