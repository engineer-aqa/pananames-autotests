import { CartPage, ContactsPage, LoginPage, RegisterDomainPage } from '@pages';
import { ContactsService } from '@api/services/contacts-service';
import { CartService } from '@api/services/cart-service';
import { AuthCredentials } from '@api/types/auth.types';

export interface TestFixtures {
  loginPage: LoginPage;
  contactsPage: ContactsPage;
  registerDomainPage: RegisterDomainPage;
  cartPage: CartPage;
  contactsService: ContactsService;
  cartService: CartService;
  user: AuthCredentials;
}
