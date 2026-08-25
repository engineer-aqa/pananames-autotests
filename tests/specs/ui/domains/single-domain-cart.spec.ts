import { test } from '@fixtures/main-ui-tests-fixtures';
import { TAGS } from '@constants/tags';
import { DOMAIN_ZONES, uniqueSld } from '@support/domain.data';

const ZONES = [DOMAIN_ZONES.COM, DOMAIN_ZONES.NET, DOMAIN_ZONES.ORG];

test.describe('Adding a single domain to the cart', { tag: TAGS.DOMAINS }, () => {
  test.beforeEach(async ({ loginPage, user, cartService, registerDomainPage }) => {
    await loginPage.loginViaApi(user);
    await cartService.clearCart();
    await registerDomainPage.openRegisterDomainPage();
  });

  test.afterEach(async ({ cartService }) => {
    await cartService.clearCart();
  });

  for (const zone of ZONES) {
    test(`Verify the cart total matches the search price for a "${zone.name}" domain`, async ({
      registerDomainPage,
      cartPage,
    }) => {
      const domain = `${uniqueSld()}${zone.name}`;
      let searchPrice: number;

      await test.step(`Search for "${domain}" and verify it is available`, async () => {
        await registerDomainPage.searchDomain(domain);
        await registerDomainPage.assertDomainIsAvailable(domain);
      });

      await test.step('Remember the price shown in the search results', async () => {
        searchPrice = await registerDomainPage.getDomainPrice(domain);
      });

      await test.step('Add the domain to the cart, confirming the registration notice when the zone has one', async () => {
        await registerDomainPage.addDomainToCart(domain, zone);
        await registerDomainPage.cartBar.assertDomainsCount(1);
      });

      await test.step('Open the cart and verify it holds only that domain', async () => {
        await registerDomainPage.proceedToCart();
        await cartPage.assertItemsCount(1);
        await cartPage.assertItemInCart(domain);
      });

      await test.step('Verify the TOTAL equals the price from the search page', async () => {
        await cartPage.assertItemTotal(domain, searchPrice);
        await cartPage.assertCartTotal(searchPrice);
      });
    });
  }
});
