import { Cookie } from '@playwright/test';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LocalStorageEntry {
  name: string;
  value: string;
}

export interface BrowserSession {
  cookies: Cookie[];
  localStorage: LocalStorageEntry[];
}
