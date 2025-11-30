'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CloudinaryImage from '@/components/CloudinaryImage';
import AddToCartButton from '@/components/AddToCartButton';
import { getProductBySlugClient } from '@/lib/products';
import { Product } from '@/types/product';
import { formatCurrency, getNoPriceText } from '@/lib/currency';
import { ArrowLeft, Phone, Mail, CheckCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      
      if (params?.slug && typeof params.slug === 'string') {
        try {
          const foundProduct = await getProductBySlugClient(params.slug);
          
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Fetch related products efficiently
            try {
              const relatedResponse = await fetch(`/api/products?limit=5&exclude=${foundProduct.id}`, {
                next: { revalidate: 60 },
              });
              if (relatedResponse.ok) {
                const relatedResult = await relatedResponse.json();
                if (relatedResult.success) {
                  setRelatedProducts(relatedResult.data.slice(0, 4));
                }
              }
            } catch (relatedError) {
              console.warn('Failed to fetch related products:', relatedError);
            }
            setNotFound(false);
          } else {
            setProduct(null);
            setNotFound(true);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setProduct(null);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setNotFound(true);
      }
    };
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;
  const imageCount = product.images?.length || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Image Gallery - Side by Side */}
        {hasImages && (
          <div className="mb-8">
            <div
              className={`grid gap-2 ${
                imageCount === 1
                  ? 'grid-cols-1'
                  : imageCount === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : imageCount === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden bg-gray-100"
                >
                  <CloudinaryImage
                    src={image.url}
                    alt={image.alt || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title and Price */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>
          
          {product.price && product.price > 0 ? (
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600">
              {formatCurrency(product.price, product.currency)}
            </p>
          ) : (
            <p className="text-xl sm:text-2xl font-semibold text-gray-600">
              {getNoPriceText()}
            </p>
          )}
        </div>

        {/* Add to Cart Section */}
        <div className="mb-8">
          <AddToCartButton product={product} />
        </div>

        {/* Category Badges */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="bg-green-100 text-green-800 px-4 py-1 text-sm font-semibold uppercase">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="bg-gray-100 text-gray-800 px-4 py-1 text-sm font-medium">
              {product.subcategory}
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {product.shortDescription}
          </p>
        )}

        {/* Long Description */}
        {product.longDescription && (
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Service</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.longDescription}
            </p>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="tel:+8801861623213"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Now: +880 1861 623213
          </Link>
          <Link
            href="mailto:maishaprintingbd@gmail.com"
            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center"
          >
            <Mail className="mr-2 h-5 w-5" />
            Email Us
          </Link>
        </div>

        {/* Service Features */}
        <div className="bg-gray-50 p-6 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Service Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Professional quality printing</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Fast turnaround times</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Customizable designs</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Competitive pricing</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore More Services
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Discover our other printing services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white border border-gray-200 hover:border-green-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <CloudinaryImage
                      src={relatedProduct.images[0]?.url || '/placeholder.jpg'}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
                      {relatedProduct.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
