'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center p-2 text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-in fade-in zoom-in duration-200">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}

