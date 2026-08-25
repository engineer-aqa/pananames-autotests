import { Page } from '@playwright/test';
import { BasePage } from '@pages/base-page';
import { AuthService } from '@api/services/auth-service';
import { AuthCredentials } from '@api/types/auth.types';
import { NavigationOptions } from '@ui/types/navigation.types';

export class LoginPage extends BasePage {
  readonly authService: AuthService;

  constructor(page: Page) {
    super(page);
    this.authService = new AuthService();
  }

  /**
   * Logs in through the API and hands the session to this test's browser
   * context: the cookies of the login plus the `auth.*` values, which go in
   * through an init script so that they are in place before the application
   * boots and decides whether the visitor is signed in.
   * Navigates to `pageURL` when one is given.
   */
  async loginViaApi(user: AuthCredentials, { pageURL }: NavigationOptions = {}): Promise<void> {
    const { cookies, localStorage } = await this.authService.getBrowserSession(user);
    const authStorage = localStorage.map(({ name, value }) => [name, value]);

    await this.page.context().addCookies(cookies);
    await this.page.context().addInitScript((entries: string[][]) => {
      entries.forEach(([name, value]) => window.localStorage.setItem(name, value));
    }, authStorage);

    if (pageURL) {
      await this.page.goto(pageURL);
    }
  }
}
