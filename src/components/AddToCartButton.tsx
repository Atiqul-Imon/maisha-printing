'use client';

import { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/currency';

interface AddToCartButtonProps {
  product: Product;
  onAdd?: () => void;
}

export default function AddToCartButton({ product, onAdd }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasPrice = product.price && product.price > 0;
  const inCart = isInCart(product.id);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!hasPrice) {
      return;
    }

    addItem(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price!,
        images: product.images,
        currency: product.currency,
      },
      quantity
    );

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setQuantity(1);
    }, 2000);

    if (onAdd) {
      onAdd();
    }
  };

  if (!hasPrice) {
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-gray-50 border border-gray-200">
          <p className="text-gray-600 font-medium">Contact us for pricing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1 && value <= 99) {
                setQuantity(value);
              }
            }}
            className="w-16 text-center border-0 focus:ring-0 focus:outline-none font-semibold"
          />
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= 99}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={showSuccess}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
          showSuccess
            ? 'bg-green-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {showSuccess ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart!
          </>
        ) : (
          <>
            Add to Cart - {formatCurrency(product.price! * quantity, product.currency)}
          </>
        )}
      </button>

      {inCart && !showSuccess && (
        <p className="text-sm text-green-600 text-center font-medium">
          ✓ This item is already in your cart
        </p>
      )}
    </div>
  );
}

