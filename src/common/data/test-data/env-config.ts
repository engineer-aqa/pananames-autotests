import dotenv from 'dotenv';
import path from 'path';
import { AuthCredentials } from '@api/types/auth.types';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function environment(): { baseUrl: string } {
  return { baseUrl: process.env.BASE_URL ?? 'https://mcp.pananames-dev.com' };
}

export function credentials(): { user: AuthCredentials } {
  const { USER_EMAIL, USER_PASSWORD } = process.env;

  if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error('USER_EMAIL and USER_PASSWORD must be set in .env - see .env.example');
  }

  return { user: { email: USER_EMAIL, password: USER_PASSWORD } };
}
