export type Cart = {
  items: CartItem[];
};

export type CartItem = {
  productId: string;
  variationId: string;
  quantity: number;
};
