import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function GlassPrintingPage() {
  const printingTypes = [
    {
      name: 'UV Printing',
      description: 'High-quality UV printing for glass surfaces with excellent durability and fade resistance',
      features: ['UV-resistant inks', 'Long-lasting', 'Weatherproof', 'Vibrant colors'],
      price: 'Starting from ৳200 per sq ft'
    },
    {
      name: 'Frosted Glass',
      description: 'Elegant frosted glass printing for privacy and decorative purposes',
      features: ['Privacy solution', 'Decorative finish', 'Custom designs', 'Various opacities'],
      price: 'Starting from ৳250 per sq ft'
    },
    {
      name: 'Window Graphics',
      description: 'Custom window graphics for retail stores, offices, and commercial spaces',
      features: ['Vinyl application', 'Removable options', 'Full color printing', 'Custom sizes'],
      price: 'Starting from ৳180 per sq ft'
    },
    {
      name: 'Decorative Printing',
      description: 'Artistic and decorative glass printing for homes and businesses',
      features: ['Custom designs', 'Artistic patterns', 'Photo printing', 'Multiple finishes'],
      price: 'Starting from ৳220 per sq ft'
    }
  ];

  const glassTypes = [
    'Clear Glass',
    'Frosted Glass',
    'Tinted Glass',
    'Tempered Glass',
    'Laminated Glass',
    'Mirror Glass'
  ];

  const applications = [
    'Office Partitions',
    'Store Windows',
    'Display Cases',
    'Decorative Panels',
    'Shower Doors',
    'Furniture Glass'
  ];

  const testimonials = [
    {
      name: 'Rashid Ahmed',
      company: 'Retail Store Owner',
      content: 'The UV printing on our store windows looks amazing and has been durable for over a year. Great quality!',
      rating: 5
    },
    {
      name: 'Nadia Khan',
      company: 'Office Manager',
      content: 'Frosted glass printing for our office partitions was exactly what we needed. Professional finish and quick delivery.',
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
                Glass Printing Services
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Professional glass printing for windows, doors, displays, and decorative purposes 
                with UV-resistant inks. Perfect for businesses and residential applications.
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
            <div className="text-8xl text-center">🪟</div>
          </div>
        </div>
      </section>

      {/* Printing Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Printing Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect glass printing method for your project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {printingTypes.map((type, index) => (
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
                Glass Types
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {glassTypes.map((glass, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{glass}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Applications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {applications.map((application, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{application}</span>
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
              Our Glass Printing Process
            </h2>
            <p className="text-xl text-gray-600">
              From design to installation, we ensure quality at every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600 text-sm">Discuss your requirements and glass type</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Measurement</h3>
              <p className="text-gray-600 text-sm">Create design mockups and measure glass surface</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Printing & Quality Check</h3>
              <p className="text-gray-600 text-sm">Professional printing with UV-resistant inks</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Installation</h3>
              <p className="text-gray-600 text-sm">Professional installation and finishing</p>
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
              What our customers say about our glass printing services
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
            Ready to Print on Glass?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your glass printing project today
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

