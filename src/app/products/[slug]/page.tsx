'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CloudinaryImage from '@/components/CloudinaryImage';
import { getProductBySlugClient, getAllProductsClient } from '@/lib/products';
import { Product } from '@/types/product';
import { ArrowLeft, Phone, Mail, CheckCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
            
            // Fetch related products
            const allProducts = await getAllProductsClient();
            setRelatedProducts(
              allProducts.filter((p) => p.id !== foundProduct.id).slice(0, 4)
            );
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

  const selectedImage = product.images[selectedImageIndex] || product.images[0];

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
            <Link href="/#services" className="text-gray-600 hover:text-green-600">
              Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              {selectedImage && (
                <CloudinaryImage
                  src={selectedImage.url}
                  alt={selectedImage.alt || product.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-600 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <CloudinaryImage
                      src={image.url}
                      alt={image.alt || `${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold uppercase">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
                  {product.subcategory}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Long Description */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Service</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.longDescription}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="tel:+8801861623213"
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now: +880 1861 623213
              </Link>
              <Link
                href="mailto:maishaprintingbd@gmail.com"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Link>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
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
        </div>
      </div>

      {/* Related Products */}
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
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedProduct.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

