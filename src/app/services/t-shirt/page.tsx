import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function TShirtPrintingPage() {
  const printingTechniques = [
    {
      name: 'Screen Printing',
      description: 'Traditional method for bulk orders with vibrant colors and durability',
      features: ['Best for bulk orders', 'Vibrant colors', 'Long-lasting', 'Cost-effective for large quantities'],
      price: 'Starting from ৳150'
    },
    {
      name: 'Digital Printing',
      description: 'Perfect for detailed designs and small to medium quantities',
      features: ['High detail printing', 'Photo-quality results', 'Quick turnaround', 'No minimum order'],
      price: 'Starting from ৳200'
    },
    {
      name: 'Embroidery',
      description: 'Premium option for logos and text with a professional look',
      features: ['Premium finish', 'Durable', 'Professional appearance', 'Best for logos'],
      price: 'Starting from ৳300'
    },
    {
      name: 'Heat Transfer',
      description: 'Great for small orders and custom designs',
      features: ['No minimum order', 'Quick production', 'Custom designs', 'Good for one-offs'],
      price: 'Starting from ৳180'
    }
  ];

  const fabricTypes = [
    '100% Cotton',
    'Cotton Blend',
    'Polyester',
    'Tri-blend',
    'Organic Cotton',
    'Moisture-wicking'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const testimonials = [
    {
      name: 'Ahmed Rahman',
      company: 'Tech Startup',
      content: 'Ordered 100 t-shirts for our company event. The screen printing quality was excellent and delivery was on time.',
      rating: 5
    },
    {
      name: 'Fatima Khan',
      company: 'Event Organizer',
      content: 'The embroidery work on our team t-shirts was outstanding. Very professional finish.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
                T-Shirt Printing Services
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                High-quality custom t-shirt printing with various techniques including screen printing, 
                digital printing, and embroidery. Perfect for businesses, events, and personal use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="tel:+8801861623213"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center group"
                >
                  +880 1861 623213
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="tel:+8801861623213"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
                >
                  Call Now
                </Link>
              </div>
            </div>
            <div className="text-8xl text-center">👕</div>
          </div>
        </div>
      </section>

      {/* Printing Techniques */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Printing Techniques
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect printing method for your t-shirt project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {printingTechniques.map((technique, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {technique.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {technique.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {technique.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-2xl font-bold text-green-600 mb-4">
                  {technique.price}
                </div>

                <Link
                  href="/contact"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  Get Quote for {technique.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Fabric Options
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {fabricTypes.map((fabric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{fabric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Available Sizes
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {sizes.map((size, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                    <span className="font-semibold text-gray-900">{size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Our T-Shirt Printing Process
            </h2>
            <p className="text-xl text-gray-600">
              From design to delivery, we ensure quality at every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Consultation</h3>
              <p className="text-gray-600 text-sm">Share your design or work with our designers</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fabric & Size Selection</h3>
              <p className="text-gray-600 text-sm">Choose your preferred fabric and sizes</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Printing & Quality Check</h3>
              <p className="text-gray-600 text-sm">Professional printing with quality assurance</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Packaging & Delivery</h3>
              <p className="text-gray-600 text-sm">Careful packaging and fast delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Customer Reviews
            </h2>
            <p className="text-xl text-gray-600">
              What our customers say about our t-shirt printing services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Ready to Print Your T-Shirts?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your t-shirt printing project today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="tel:+8801861623213"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200"
            >
              +880 1861 623213
            </Link>
            <Link
              href="tel:+8801861623213"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              Call Now: +880 1861 623213
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
