/**
 * Shopping Cart Types
 */

export interface CartItem {
  productId: string;
  productSlug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  currency?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    images: Array<{ url: string; alt: string }>;
    currency?: string;
  }, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}

