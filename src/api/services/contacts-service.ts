import { BaseService } from './base-service';
import { API_ROUTES } from '@api/constants/api-routes';
import { ContactBody, ContactsListResponse } from '@api/types/contacts.types';
import { CONTACT_DEFAULTS, TEST_CONTACT_PREFIX } from '@common/data/test-data/contact.data';

export class ContactsService extends BaseService {
  readonly baseUrl = API_ROUTES.CONTACTS;

  async getContacts(perPage = 100): Promise<ContactsListResponse> {
    const response = await this.restClient.get(this.baseUrl.LIST, {
      params: { per_page: perPage, page: 1 },
    });
    return this.parseApiResponse<ContactsListResponse>(response);
  }

  async createContact(contact: ContactBody): Promise<number> {
    const response = await this.restClient.post(this.baseUrl.STORE, {
      body: { ...CONTACT_DEFAULTS, ...contact },
    });
    return (await this.parseApiResponse<{ id: number }>(response)).id;
  }

  async deleteContact(contactId: number): Promise<void> {
    await this.restClient.delete(`${this.baseUrl.REMOVE}/${contactId}`);
  }

  async deleteContacts(): Promise<void> {
    const { contacts } = await this.getContacts();
    const testContacts = contacts.filter(
      contact => !contact.primary && !contact.abuse && contact.name.startsWith(TEST_CONTACT_PREFIX)
    );

    for (const contact of testContacts) {
      await this.deleteContact(contact.id);
    }
  }
}
