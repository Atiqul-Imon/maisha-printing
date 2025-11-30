'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold font-serif text-white/20 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            Page Not Found
          </h2>
          <p className="text-xl text-green-100 leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center group"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors duration-200 flex items-center justify-center group"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <p className="text-green-100 mb-4">
            Here are some popular pages you might be looking for:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link
              href="/"
              className="text-green-100 hover:text-white transition-colors duration-200 flex items-center justify-center group"
            >
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Our Products
            </Link>
            <Link
              href="/about"
              className="text-green-100 hover:text-white transition-colors duration-200 flex items-center justify-center group"
            >
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-green-100 hover:text-white transition-colors duration-200 flex items-center justify-center group"
            >
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Contact Us
            </Link>
            <Link
              href="/cart"
              className="text-green-100 hover:text-white transition-colors duration-200 flex items-center justify-center group"
            >
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Shopping Cart
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-green-100">
          <p className="mb-2">Still can&apos;t find what you&apos;re looking for?</p>
          <Link
            href="tel:+8801861623213"
            className="text-white font-semibold hover:text-green-200 transition-colors duration-200"
          >
            Call us: +880 1861 623213
          </Link>
        </div>
      </div>
    </div>
  );
}
