'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: 'Phone',
      details: ['+880 1861 623213'],
      action: 'Call Now'
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: 'Email',
      details: ['maishaprintingbd@gmail.com'],
      action: 'Send Email'
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: 'Address',
      details: ['224/1, Fakirapool, (2nd Floor)', '1 No Lane, Motijheel', 'Dhaka-1000, Bangladesh'],
      action: 'Get Directions'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                  Ready to start your printing project? Get in touch with us for a free quote
                  or to discuss your requirements. We&apos;re here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Get In Touch
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    We&apos;re here to help with all your printing needs. Reach out to us through
                    any of the channels below, and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 mb-1">
                          {detail}
                        </p>
                      ))}
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm mt-2">
                        {info.action} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
              Find Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit our location in the heart of Dhaka&apos;s business district
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Interactive Map Coming Soon</p>
                <p className="text-gray-500 text-sm mt-2">224/1, Fakirapool, (2nd Floor), 1 No Lane, Motijheel, Dhaka-1000, Bangladesh</p>
              </div>
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
            Contact us today for a free consultation and quote on your printing needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+8801861623213"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200"
            >
              +880 1861 623213
            </a>
            <a
              href="mailto:maishaprintingbd@gmail.com"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}