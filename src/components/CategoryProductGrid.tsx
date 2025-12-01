'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import CloudinaryImage from './CloudinaryImage';
import AddToCartButton from './AddToCartButton';
import { formatCurrency, getNoPriceText } from '@/lib/currency';

interface CategoryProductGridProps {
  products: Product[];
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((product) => {
        const hasImage = product.images && product.images.length > 0;
        const primaryImage = product.images[0];

        return (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-green-500 group"
          >
            {/* Product Image */}
            <Link href={`/products/${product.slug}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {hasImage && primaryImage ? (
                  <CloudinaryImage
                    src={primaryImage.url}
                    alt={primaryImage.alt || product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Product Content */}
            <div className="p-5">
              {/* Title */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors min-h-[3.5rem]">
                  {product.title}
                </h3>
              </Link>

              {/* Description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                  {product.shortDescription}
                </p>
              )}

              {/* Price */}
              <div className="mb-4">
                {product.price && product.price > 0 ? (
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-gray-600">
                    {getNoPriceText()}
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

