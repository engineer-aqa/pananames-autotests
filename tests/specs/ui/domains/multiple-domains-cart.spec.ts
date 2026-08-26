import { test } from '@fixtures/main-ui-tests-fixtures';
import { TAGS } from '@constants/tags';
import { uniqueSld } from '@support/domain.data';
import { sumPrices } from '@utils/price';
import { DomainOffer } from '@ui/types/domain.types';

const DOMAINS_TO_ADD = 3;

test.describe('Adding several domains to the cart', { tag: TAGS.DOMAINS }, () => {
  test.beforeEach(async ({ loginPage, user, cartService, registerDomainPage }) => {
    await loginPage.loginViaApi(user);
    await cartService.clearCart();
    await registerDomainPage.openRegisterDomainPage();
  });

  test.afterEach(async ({ cartService }) => {
    await cartService.clearCart();
  });

  test(`Verify the cart total equals the sum of the search prices of ${DOMAINS_TO_ADD} domains`, async ({
    registerDomainPage,
    cartPage,
  }) => {
    const searchTerm = uniqueSld();
    let domains: DomainOffer[] = [];

    await test.step(`Search for "${searchTerm}" without a zone`, async () => {
      await registerDomainPage.searchDomain(searchTerm);
    });

    await test.step(`Pick ${DOMAINS_TO_ADD} available domains and remember their prices`, async () => {
      domains = await registerDomainPage.pickAvailableDomains(DOMAINS_TO_ADD);
    });

    await test.step('Add every picked domain to the cart', async () => {
      for (const { name } of domains) {
        await registerDomainPage.addDomainToCart(name);
      }

      await registerDomainPage.cartBar.assertDomainsCount(DOMAINS_TO_ADD);
    });

    await test.step('Open the cart and verify it holds the picked domains at their search prices', async () => {
      await registerDomainPage.proceedToCart();
      await cartPage.assertItemsCount(DOMAINS_TO_ADD);

      for (const { name, price } of domains) {
        await cartPage.assertItemInCart(name);
        await cartPage.assertItemTotal(name, price);
      }
    });

    await test.step('Verify the TOTAL equals the sum of the prices from the search page', async () => {
      await cartPage.assertCartTotal(sumPrices(domains.map(({ price }) => price)));
    });
  });
});
