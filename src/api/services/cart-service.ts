import { BaseService } from './base-service';
import { API_ROUTES } from '@api/constants/api-routes';
import { CartItem, CartResponse } from '@api/types/cart.types';

export class CartService extends BaseService {
  readonly baseUrl = API_ROUTES.CART;

  async getCart(): Promise<CartResponse> {
    const response = await this.restClient.get(this.baseUrl.GET);
    return this.parseApiResponse<CartResponse>(response);
  }

  async getCartItems(): Promise<CartItem[]> {
    const { cart } = await this.getCart();
    return cart.visible_items ?? [];
  }

  async removeCartItem(itemId: number): Promise<void> {
    await this.restClient.delete(`${this.baseUrl.REMOVE}/${itemId}`);
  }

  /** The cart is stored per account and survives between runs, so it has to be emptied. */
  async clearCart(): Promise<void> {
    for (const item of await this.getCartItems()) {
      await this.removeCartItem(item.id);
    }
  }
}
