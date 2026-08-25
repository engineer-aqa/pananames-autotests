import { ContactsPage, LoginPage } from '@pages';
import { ContactsService } from '@api/services/contacts-service';
import { AuthCredentials } from '@api/types/auth.types';

export interface TestFixtures {
  loginPage: LoginPage;
  contactsPage: ContactsPage;
  contactsService: ContactsService;
  user: AuthCredentials;
}
