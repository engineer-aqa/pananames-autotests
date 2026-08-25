import { Cookie } from '@playwright/test';
import { BaseService } from './base-service';
import { UserService } from './user-service';
import { API_ROUTES } from '@api/constants/api-routes';
import { AuthCredentials, BrowserSession } from '@api/types/auth.types';
import { toAuthStorage } from '@utils/auth-storage';

/**
 * The application allows only a few logins per minute, so the worker logs in
 * once and every test is handed that same session.
 */
let workerSession: BrowserSession;

export class AuthService extends BaseService {
  readonly baseUrl = API_ROUTES.AUTH;
  private readonly userService = new UserService();

  /** Logs in and returns the session cookies of the account. */
  async loginViaApi(user: AuthCredentials): Promise<Cookie[]> {
    const response = await this.restClient.post(this.baseUrl.LOGIN, {
      body: { email: user.email, password: user.password },
    });

    // TODO: Fix API response status for invalid credentials (currently returns 200 instead of 401). */
    const payload = await response.json();

    if (!payload?.status) {
      throw new Error(`API login failed for "${user.email}": ${JSON.stringify(payload)}`);
    }

    return this.restClient.getCookies();
  }

  /**
   * Session ready to be handed to a browser: the cookies of the login plus the
   * `auth.*` values built from the profile of the account just signed in.
   */
  async getBrowserSession(user: AuthCredentials): Promise<BrowserSession> {
    workerSession ??= {
      cookies: await this.loginViaApi(user),
      localStorage: toAuthStorage(await this.userService.getUser()),
    };

    return workerSession;
  }
}
