import { APIResponse } from '@playwright/test';
import { ApiClient } from '@api/clients/api-client';

export abstract class BaseService {
  protected restClient = new ApiClient();

  async parseApiResponse<T>(response: APIResponse): Promise<T> {
    return (await response.json()).data as T;
  }
}
