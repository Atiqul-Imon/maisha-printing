'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'maisha_printing_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Validate cart items structure
          const validItems: CartItem[] = parsed.filter((item: unknown): item is CartItem => {
            if (typeof item !== 'object' || item === null) return false;
            const cartItem = item as Record<string, unknown>;
            return (
              typeof cartItem.productId === 'string' &&
              typeof cartItem.title === 'string' &&
              typeof cartItem.price === 'number' &&
              typeof cartItem.quantity === 'number' &&
              cartItem.quantity > 0
            );
          });
          setItems(validItems);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear invalid cart data
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  const addItem = useCallback((
    product: {
      id: string;
      slug: string;
      title: string;
      price: number;
      images: Array<{ url: string; alt: string }>;
      currency?: string;
    },
    quantity: number
  ) => {
    if (quantity <= 0 || quantity > 99) {
      return;
    }

    if (!product.price || product.price <= 0) {
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id
      );

      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...prevItems];
        const newQuantity = Math.min(prevItems[existingIndex].quantity + quantity, 99);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
        };
        return updated;
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          productSlug: product.slug,
          title: product.title,
          price: product.price,
          quantity,
          image: product.images[0]?.url || '',
          currency: product.currency || 'BDT',
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    if (quantity > 99) {
      quantity = 99;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.productId === productId);
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

