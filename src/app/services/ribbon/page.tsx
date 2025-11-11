import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function RibbonPrintingPage() {
  const ribbonTypes = [
    {
      name: 'Satin Ribbons',
      description: 'Smooth and glossy satin ribbons perfect for elegant events and gift wrapping',
      features: ['Smooth finish', 'Glossy appearance', 'Various widths', 'Multiple colors'],
      price: 'Starting from ৳10 per meter'
    },
    {
      name: 'Grosgrain Ribbons',
      description: 'Textured grosgrain ribbons with a ribbed pattern, great for decorative purposes',
      features: ['Textured finish', 'Durable', 'Washable', 'Professional look'],
      price: 'Starting from ৳12 per meter'
    },
    {
      name: 'Custom Text',
      description: 'Ribbons printed with custom text, logos, or messages for promotional use',
      features: ['Custom printing', 'Logo printing', 'Text options', 'Brand colors'],
      price: 'Starting from ৳15 per meter'
    },
    {
      name: 'Various Colors',
      description: 'Wide range of colors available to match your event or brand theme',
      features: ['Multiple colors', 'Color matching', 'Gradient options', 'Metallic finishes'],
      price: 'Starting from ৳10 per meter'
    }
  ];

  const ribbonWidths = [
    '1/4" (6mm)',
    '1/2" (12mm)',
    '1" (25mm)',
    '2" (50mm)',
    '3" (75mm)',
    'Custom Widths'
  ];

  const applications = [
    'Event Decorations',
    'Gift Wrapping',
    'Promotional Items',
    'Award Ceremonies',
    'Wedding Decor',
    'Corporate Events'
  ];

  const testimonials = [
    {
      name: 'Amina Rahman',
      company: 'Event Planner',
      content: 'Ordered custom printed ribbons for a corporate event. The quality was excellent and the printing was crisp and clear.',
      rating: 5
    },
    {
      name: 'Karim Ullah',
      company: 'Gift Shop Owner',
      content: 'The satin ribbons with custom text have been a hit with our customers. Great quality and fast delivery.',
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
                Ribbon Printing Services
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Custom ribbon printing for events, celebrations, and promotional purposes with various 
                colors and materials. Perfect for adding a personal touch to your events.
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
            <div className="text-8xl text-center">🎀</div>
          </div>
        </div>
      </section>

      {/* Ribbon Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Ribbon Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of ribbon printing options
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ribbonTypes.map((type, index) => (
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
                Available Widths
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {ribbonWidths.map((width, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{width}</span>
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
              Our Ribbon Printing Process
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Consultation</h3>
              <p className="text-gray-600 text-sm">Discuss your ribbon requirements and design</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Proof</h3>
              <p className="text-gray-600 text-sm">Create design mockup and provide proof for approval</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Printing</h3>
              <p className="text-gray-600 text-sm">High-quality printing on selected ribbon type</p>
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
              What our customers say about our ribbon printing services
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
            Ready to Print Your Ribbons?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your ribbon printing project today
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

