'use client';

import { memo } from 'react';
import Link from 'next/link';
import CloudinaryImage from './CloudinaryImage';
import { Product } from '@/types/product';
import { ArrowRight } from 'lucide-react';

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

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 line-clamp-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
          <span>View Details</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

