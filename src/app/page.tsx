import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Award, Clock } from 'lucide-react';
import { getAllProducts } from '@/lib/products-server';
import ProductCard from '@/components/ProductCard';
import { testimonials } from '@/data/testimonials';

export const revalidate = 30; // Revalidate this page every 30 seconds

export default async function Home() {
  const allProducts = await getAllProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
                Professional Printing Services in Bangladesh
              </h1>
              <p className="text-lg sm:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                From t-shirts to business cards, we deliver high-quality printing solutions 
                with fast turnaround times and competitive prices. Your trusted printing partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="tel:+8801861623213"
                  className="bg-white text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                >
                  +880 1861 623213
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#products"
                  className="border-2 border-white text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Products
                </Link>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 space-y-6 border border-white/20">
                <h3 className="text-xl lg:text-2xl font-semibold text-center lg:text-left text-white drop-shadow-md">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white flex-shrink-0 drop-shadow-md" />
                    <span className="text-sm lg:text-base text-white drop-shadow-sm">High-quality materials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white flex-shrink-0 drop-shadow-md" />
                    <span className="text-sm lg:text-base text-white drop-shadow-sm">Fast turnaround times</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white flex-shrink-0 drop-shadow-md" />
                    <span className="text-sm lg:text-base text-white drop-shadow-sm">Competitive pricing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white flex-shrink-0 drop-shadow-md" />
                    <span className="text-sm lg:text-base text-white drop-shadow-sm">Professional customer service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* All Products/Services Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Our Services & Products
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive range of printing solutions for every need
            </p>
          </div>
          
          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                About Maisha Printing
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With over 5 years of experience in the printing industry, Maisha Printing has established 
                itself as a trusted partner for businesses and individuals across Bangladesh. We combine 
                traditional craftsmanship with modern technology to deliver exceptional results.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our commitment to quality, customer satisfaction, and timely delivery has made us the 
                preferred choice for printing services in Dhaka and surrounding areas.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Quality Assured</div>
                    <div className="text-sm text-gray-600">Premium materials</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Fast Delivery</div>
                    <div className="text-sm text-gray-600">Quick turnaround</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Process</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Consultation</h4>
                    <p className="text-gray-600 text-sm">Discuss your requirements and get expert advice</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Design & Quote</h4>
                    <p className="text-gray-600 text-sm">Create mockups and provide competitive pricing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Production</h4>
                    <p className="text-gray-600 text-sm">High-quality printing with attention to detail</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Delivery</h4>
                    <p className="text-gray-600 text-sm">Fast and secure delivery to your location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm lg:text-base">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm lg:text-base">{testimonial.name}</div>
                  <div className="text-xs lg:text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to Start Your Printing Project?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get a free quote today and experience the difference of professional printing services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="tel:+8801861623213"
              className="bg-white text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              +880 1861 623213
            </Link>
            <Link
              href="tel:+8801861623213"
              className="border-2 border-white text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Call Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
