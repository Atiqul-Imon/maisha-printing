import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function FlyerBrochurePage() {
  const printTypes = [
    {
      name: 'Flyers',
      description: 'Single-page promotional materials perfect for events and announcements',
      features: ['A4 Size (210x297mm)', 'A5 Size (148x210mm)', 'A6 Size (105x148mm)', 'Full Color Printing'],
      price: 'Starting from ৳1 per piece',
      minOrder: '100 pieces minimum'
    },
    {
      name: 'Brochures',
      description: 'Multi-page marketing materials with professional folding options',
      features: ['A4 Folded', 'A5 Folded', 'Z-Fold', 'Gate Fold', 'Accordion Fold'],
      price: 'Starting from ৳3 per piece',
      minOrder: '50 pieces minimum'
    },
    {
      name: 'Leaflets',
      description: 'Small promotional materials for handouts and distribution',
      features: ['A6 Size', 'A5 Size', 'Custom Sizes', 'Double-sided Printing'],
      price: 'Starting from ৳0.50 per piece',
      minOrder: '200 pieces minimum'
    },
    {
      name: 'Posters',
      description: 'Large format printing for displays and announcements',
      features: ['A3 Size', 'A2 Size', 'A1 Size', 'A0 Size', 'High Resolution'],
      price: 'Starting from ৳10 per piece',
      minOrder: '10 pieces minimum'
    }
  ];

  const paperTypes = [
    'Standard Paper (80gsm)',
    'Premium Paper (100gsm)',
    'Glossy Paper (150gsm)',
    'Matte Paper (120gsm)',
    'Recycled Paper (80gsm)',
    'Card Stock (250gsm)'
  ];

  const finishingOptions = [
    'Standard Cut',
    'Rounded Corners',
    'Lamination (Glossy)',
    'Lamination (Matte)',
    'UV Coating',
    'Spot UV',
    'Foil Stamping',
    'Perforation'
  ];

  const testimonials = [
    {
      name: 'Rashid Ahmed',
      company: 'Event Management',
      content: 'Ordered 1000 flyers for our event. The quality was excellent and they were delivered on time.',
      rating: 5
    },
    {
      name: 'Nazma Begum',
      company: 'Restaurant Owner',
      content: 'The brochure design and printing quality exceeded our expectations. Great service!',
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
                Flyer & Brochure Printing
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Professional flyer and brochure printing services for your marketing campaigns. 
                High-quality materials that make your message stand out.
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
            <div className="text-8xl text-center">📄</div>
          </div>
        </div>
      </section>

      {/* Print Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Print Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of flyer and brochure printing options
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {printTypes.map((print, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {print.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {print.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {print.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {print.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {print.minOrder}
                  </div>
                </div>

                <Link
                  href="tel:+8801861623213"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  Get Quote for {print.name}
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
                Finishing Options
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {finishingOptions.map((finish, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900 text-sm">{finish}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Guidelines */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Design Guidelines
            </h2>
            <p className="text-xl text-gray-600">
              Follow these guidelines for the best printing results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">File Requirements</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>High resolution (300 DPI minimum)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>CMYK color mode</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>PDF, AI, or PSD format</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Include bleed area (3mm)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Design Tips</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Keep important text 5mm from edges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Use high contrast colors</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Keep fonts readable at small sizes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Use vector graphics when possible</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Turnaround Time</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Standard orders: 2-3 business days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Rush orders: 24-48 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Large quantities: 5-7 business days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Free delivery in Dhaka</span>
                </li>
              </ul>
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
              What our customers say about our flyer and brochure printing services
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
            Ready to Print Your Marketing Materials?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your flyer and brochure printing project today
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
