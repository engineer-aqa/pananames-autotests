export interface UserRole {
  id: number;
  name: string;
  is_master: number;
  status: number;
}

export interface Merchant {
  id: number;
  balance: string;
  country: string;
  allow_default_ns: number;
  agreement: string;
  full_name: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  organization: string;
  merchant: Merchant;
}

export interface UserResponse {
  user: User;
  role: UserRole;
  permissions: unknown[];
  cart_items_count: number;
}
