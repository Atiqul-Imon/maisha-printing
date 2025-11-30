import Link from 'next/link';
import { ArrowRight, Clock, Award, Lightbulb, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: 'Quality First',
      description: 'We never compromise on quality. Every project is handled with meticulous attention to detail and the highest standards.'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Timely Delivery',
      description: 'We understand the importance of deadlines. Our efficient processes ensure your projects are delivered on time, every time.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We work closely with you to understand your needs and exceed your expectations.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-green-600" />,
      title: 'Innovation',
      description: 'We stay updated with the latest printing technologies and techniques to provide cutting-edge solutions.'
    }
  ];




  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
              About Maisha Printing
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for professional printing services in Bangladesh. 
              We combine traditional craftsmanship with modern technology to deliver exceptional results.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2019, Maisha Printing began with a simple mission: to provide high-quality 
                printing services that help businesses and individuals make a lasting impression. What 
                started as a small operation has grown into one of Bangladesh&apos;s most trusted printing companies.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our journey has been marked by continuous innovation, customer satisfaction, and a 
                commitment to excellence. We&apos;ve invested in cutting-edge technology while maintaining 
                the personal touch that sets us apart from larger competitors.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Today, we serve clients across Bangladesh with a comprehensive range of printing services, 
                from business cards to large-scale promotional materials. Our success is measured not just 
                in numbers, but in the relationships we&apos;ve built and the trust we&apos;ve earned.
              </p>
              <Link
                href="tel:+8801861623213"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 inline-flex items-center group"
              >
                +880 1861 623213
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To provide exceptional printing services that help our clients achieve their goals 
                while maintaining the highest standards of quality, service, and innovation.
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading printing company in Bangladesh, known for our quality, 
                reliability, and customer-centric approach.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your printing needs and see how we can help bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="tel:+8801861623213"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200"
            >
              +880 1861 623213
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              View Our Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
