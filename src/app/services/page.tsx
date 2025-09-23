import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Clock, Award, Users } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      name: 'T-Shirt Printing',
      description: 'High-quality custom t-shirt printing with various techniques including screen printing, digital printing, and embroidery.',
      icon: '👕',
      href: '/services/t-shirt',
      features: ['Screen Printing', 'Digital Printing', 'Embroidery', 'Heat Transfer'],
      price: 'Starting from ৳150'
    },
    {
      name: 'Glass Printing',
      description: 'Professional glass printing for windows, doors, displays, and decorative purposes with UV-resistant inks.',
      icon: '🪟',
      href: '/services/glass',
      features: ['UV Printing', 'Frosted Glass', 'Decorative Printing', 'Window Graphics'],
      price: 'Starting from ৳200'
    },
    {
      name: 'Calendar Printing',
      description: 'Custom calendar printing for businesses and organizations with high-quality paper and binding options.',
      icon: '📅',
      href: '/services/calendar',
      features: ['Desk Calendars', 'Wall Calendars', 'Custom Design', 'Premium Paper'],
      price: 'Starting from ৳50'
    },
    {
      name: 'ID Card Printing',
      description: 'Professional ID card printing with security features, lamination, and various card materials.',
      icon: '🆔',
      href: '/services/id-card',
      features: ['PVC Cards', 'Magnetic Stripe', 'Barcode', 'Lamination'],
      price: 'Starting from ৳25'
    },
    {
      name: 'Ribbon Printing',
      description: 'Custom ribbon printing for events, celebrations, and promotional purposes with various colors and materials.',
      icon: '🎀',
      href: '/services/ribbon',
      features: ['Satin Ribbons', 'Grosgrain Ribbons', 'Custom Text', 'Various Colors'],
      price: 'Starting from ৳10'
    },
    {
      name: 'Sticker Printing',
      description: 'Durable sticker printing for branding, decoration, and promotional purposes with various finishes.',
      icon: '🏷️',
      href: '/services/sticker',
      features: ['Vinyl Stickers', 'Paper Stickers', 'Waterproof', 'Custom Shapes'],
      price: 'Starting from ৳5'
    },
    {
      name: 'Visiting Card',
      description: 'Professional business card printing services with premium paper and finishing options.',
      icon: '💼',
      href: '/services/visiting-card',
      features: ['Premium Paper', 'Spot UV', 'Foil Stamping', 'Rounded Corners'],
      price: 'Starting from ৳2'
    },
    {
      name: 'Flyer & Brochure',
      description: 'Marketing materials and promotional printing including flyers, brochures, and leaflets.',
      icon: '📄',
      href: '/services/flyer-brochure',
      features: ['A4 Flyers', 'A5 Brochures', 'Full Color', 'Various Paper Types'],
      price: 'Starting from ৳1'
    }
  ];

  const whyChooseUs = [
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: 'Quality Assured',
      description: 'We use premium materials and state-of-the-art equipment to ensure the highest quality output.'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising on quality. Most orders completed within 24-48 hours.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Expert Team',
      description: 'Our experienced team of designers and printing specialists ensures professional results every time.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
              Our Printing Services
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              From t-shirts to business cards, we offer comprehensive printing solutions 
              tailored to meet your business and personal needs with exceptional quality and service.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group">
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-green-600">{service.price}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <Link
                  href={service.href}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center group-hover:translate-y-1 transition-transform"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Why Choose Maisha Printing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional craftsmanship with modern technology to deliver exceptional results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Our Simple Process
            </h2>
            <p className="text-xl text-gray-600">
              Getting your printing project done is easy with our streamlined process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600 text-sm">Discuss your requirements and get expert advice</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Quote</h3>
              <p className="text-gray-600 text-sm">Create mockups and provide competitive pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-600 text-sm">High-quality printing with attention to detail</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600 text-sm">Fast and secure delivery to your location</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get a free quote for any of our printing services today
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
