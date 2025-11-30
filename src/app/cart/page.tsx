'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CloudinaryImage from '@/components/CloudinaryImage';
import { formatCurrency } from '@/lib/currency';
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const total = getTotalPrice();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Start adding products to your cart to continue shopping.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-gray-200 p-4 lg:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${item.productSlug}`}
                  className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 relative overflow-hidden"
                >
                  <CloudinaryImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors mb-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-lg font-bold text-green-600 mb-4">
                      {formatCurrency(item.price, item.currency)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 1 && value <= 99) {
                            handleQuantityChange(item.productId, value);
                          }
                        }}
                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block w-full text-center text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

