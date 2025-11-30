import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { quickLinks } from '@/data/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">Maisha Printing</h3>
                <p className="text-sm text-gray-400">Professional Printing Services</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for all printing needs in Bangladesh. We deliver high-quality 
              printing services with fast turnaround times and competitive prices.
            </p>
            <div className="flex space-x-4">
                <a href="https://www.facebook.com/maishaprintingbd" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                      className="text-gray-300 hover:text-green-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                      className="text-gray-300 hover:text-green-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+880 1861 623213</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">maishaprintingbd@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">224/1, Fakirapool, (2nd Floor)</p>
                  <p className="text-gray-300 text-sm">1 No Lane, Motijheel</p>
                  <p className="text-gray-300 text-sm">Dhaka-1000, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Maisha Printing. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-green-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Developer Credit */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-xs mb-1">
                  Website designed & developed by
                </p>
                <a 
                  href="https://www.pixelforgebd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors group"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                  <span className="font-semibold text-sm group-hover:underline">
                    Pixel Forge
                  </span>
                </a>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-500 text-xs mb-1">
                  Need a professional website?
                </p>
                <a 
                  href="https://www.pixelforgebd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors hover:underline"
                >
                  Get your quote today →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
