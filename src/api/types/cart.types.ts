export interface CartItem {
  id: number;
}

export interface CartResponse {
  cart: {
    visible_items: CartItem[];
  };
}
