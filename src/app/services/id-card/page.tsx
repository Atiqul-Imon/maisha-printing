import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function IDCardPage() {
  const cardTypes = [
    {
      name: 'Standard ID Cards',
      description: 'Basic ID cards with essential information and standard security features',
      features: ['PVC Material', 'Full Color Printing', 'Standard Size (85.6x54mm)', 'Lamination'],
      price: 'Starting from ৳25 per card',
      minOrder: '50 cards minimum'
    },
    {
      name: 'Premium ID Cards',
      description: 'High-quality ID cards with advanced security features and premium finish',
      features: ['Magnetic Stripe', 'Barcode', 'Holographic Overlay', 'UV Printing'],
      price: 'Starting from ৳50 per card',
      minOrder: '25 cards minimum'
    },
    {
      name: 'Smart ID Cards',
      description: 'Advanced ID cards with RFID technology and contactless features',
      features: ['RFID Chip', 'Contactless Technology', 'High Security', 'Custom Encoding'],
      price: 'Starting from ৳100 per card',
      minOrder: '10 cards minimum'
    },
    {
      name: 'Student ID Cards',
      description: 'Specialized ID cards for educational institutions with student-specific features',
      features: ['Student Photo', 'Institution Logo', 'Validity Date', 'QR Code'],
      price: 'Starting from ৳20 per card',
      minOrder: '100 cards minimum'
    }
  ];

  const securityFeatures = [
    'Magnetic Stripe',
    'Barcode',
    'QR Code',
    'Holographic Overlay',
    'UV Printing',
    'Microtext',
    'Watermark',
    'RFID Chip',
    'Contactless Technology',
    'Biometric Integration'
  ];

  const cardMaterials = [
    'PVC (Polyvinyl Chloride)',
    'PET (Polyethylene Terephthalate)',
    'Composite Materials',
    'Eco-friendly PVC',
    'Transparent PVC',
    'White Core PVC'
  ];

  const testimonials = [
    {
      name: 'Dr. Amina Rahman',
      company: 'University Registrar',
      content: 'Ordered 500 student ID cards. The quality and security features exceeded our expectations.',
      rating: 5
    },
    {
      name: 'Karim Ahmed',
      company: 'Office Manager',
      content: 'Professional ID cards with magnetic stripe for our office. Great service and fast delivery.',
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
                ID Card Printing
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Professional ID card printing services with advanced security features. 
                From basic employee cards to high-security access cards with RFID technology.
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
            <div className="text-8xl text-center">🆔</div>
          </div>
        </div>
      </section>

      {/* Card Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              ID Card Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of ID card printing options to meet your security and budget requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cardTypes.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {card.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {card.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {card.minOrder}
                  </div>
                </div>

                <Link
                  href="tel:+8801861623213"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  Get Quote for {card.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
              Security Features
            </h2>
            <p className="text-xl text-gray-600">
              Advanced security options to protect your organization
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 text-sm">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                Card Materials
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {cardMaterials.map((material, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">{material}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Design Guidelines</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">File Requirements:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• High resolution (300 DPI minimum)</li>
                    <li>• CMYK color mode</li>
                    <li>• PDF, AI, or PSD format</li>
                    <li>• 85.6mm x 54mm dimensions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Design Tips:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Keep important text 3mm from edges</li>
                    <li>• Use high contrast colors</li>
                    <li>• Include photo space (25mm x 30mm)</li>
                    <li>• Add security elements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Turnaround Time:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Standard cards: 3-5 business days</li>
                    <li>• Premium cards: 5-7 business days</li>
                    <li>• Smart cards: 7-10 business days</li>
                    <li>• Rush orders: 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Our ID Card Process
            </h2>
            <p className="text-xl text-gray-600">
              From design to delivery, we ensure security and quality at every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Approval</h3>
              <p className="text-gray-600 text-sm">Create design mockup and get approval</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600 text-sm">Gather photos and information</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-600 text-sm">Print and encode cards with security features</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Check</h3>
              <p className="text-gray-600 text-sm">Test all features and deliver securely</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Customer Reviews
            </h2>
            <p className="text-xl text-gray-600">
              What our customers say about our ID card printing services
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
            Ready to Print Your ID Cards?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for your ID card printing project today
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
