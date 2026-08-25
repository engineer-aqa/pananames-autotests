import { BaseService } from './base-service';
import { API_ROUTES } from '@api/constants/api-routes';
import { UserResponse } from '@api/types/user.types';

export class UserService extends BaseService {
  readonly baseUrl = API_ROUTES.USER;

  async getUser(): Promise<UserResponse> {
    const response = await this.restClient.get(this.baseUrl.GET);
    return this.parseApiResponse<UserResponse>(response);
  }
}
