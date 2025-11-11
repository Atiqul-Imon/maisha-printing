import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function CalendarPrintingPage() {
  const calendarTypes = [
    {
      name: 'Desk Calendars',
      description: 'Professional desk calendars perfect for offices and businesses with monthly views',
      features: ['Spiral binding', 'Monthly views', 'Premium paper', 'Custom branding'],
      price: 'Starting from ৳50 per calendar'
    },
    {
      name: 'Wall Calendars',
      description: 'Large format wall calendars with beautiful imagery and monthly planning',
      features: ['Large format', 'Full color', 'Hanging wire', 'Durable paper'],
      price: 'Starting from ৳80 per calendar'
    },
    {
      name: 'Custom Design',
      description: 'Fully customized calendars with your designs, photos, and branding',
      features: ['Custom design', 'Personal photos', 'Brand integration', 'Multiple layouts'],
      price: 'Starting from ৳100 per calendar'
    },
    {
      name: 'Premium Paper',
      description: 'Luxury calendars with premium paper and special finishes',
      features: ['Premium paper', 'Glossy finish', 'Spot UV', 'Elegant binding'],
      price: 'Starting from ৳150 per calendar'
    }
  ];

  const paperTypes = [
    'Standard Paper (150gsm)',
    'Premium Paper (200gsm)',
    'Glossy Paper (200gsm)',
    'Matte Paper (180gsm)',
    'Recycled Paper (150gsm)',
    'Luxury Card Stock (250gsm)'
  ];

  const sizes = [
    'A4 (8.27" x 11.69")',
    'A3 (11.69" x 16.54")',
    'A2 (16.54" x 23.39")',
    'Custom Sizes'
  ];

  const testimonials = [
    {
      name: 'Hasan Ali',
      company: 'Corporate Office',
      content: 'Ordered 500 desk calendars for our company. Great quality paper and the custom branding looks professional.',
      rating: 5
    },
    {
      name: 'Farida Begum',
      company: 'Event Organizer',
      content: 'The wall calendars with custom photos turned out beautifully. Our clients loved them!',
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
                Calendar Printing Services
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Custom calendar printing for businesses and organizations with high-quality paper 
                and binding options. Perfect for marketing and promotional purposes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="tel:+8801861623213"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center group"
                >
                  Get Quote
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
            <div className="text-8xl text-center">📅</div>
          </div>
        </div>
      </section>

      {/* Calendar Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Calendar Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of calendar printing options
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {calendarTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {type.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {type.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-2xl font-bold text-green-600 mb-4">
                  {type.price}
                </div>

                <Link
                  href="/contact"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  Get Quote for {type.name}
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
                Paper Types
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {paperTypes.map((paper, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{paper}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Available Sizes
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {sizes.map((size, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{size}</span>
                    </div>
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
              Our Calendar Printing Process
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
              <p className="text-gray-600 text-sm">Discuss your calendar design and requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Layout & Proof</h3>
              <p className="text-gray-600 text-sm">Create calendar layout and provide proof for approval</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Printing & Binding</h3>
              <p className="text-gray-600 text-sm">High-quality printing and professional binding</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Check & Delivery</h3>
              <p className="text-gray-600 text-sm">Quality assurance and timely delivery</p>
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
              What our customers say about our calendar printing services
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
            Ready to Print Your Calendars?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your calendar printing project today
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

