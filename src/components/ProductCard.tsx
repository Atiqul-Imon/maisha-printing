'use client';

import { memo } from 'react';
import Link from 'next/link';
import CloudinaryImage from './CloudinaryImage';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || { url: '/placeholder.jpg', alt: product.title };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <CloudinaryImage
          src={mainImage.url}
          alt={mainImage.alt || product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Title Only */}
      <div className="p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

