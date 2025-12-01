'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { mainNavigation } from '@/data/navigation';
import { getAllCategories } from '@/data/categories';
import CartIcon from './CartIcon';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categories = getAllCategories();
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl md:text-2xl">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Maisha Printing</h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Professional Printing Services</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {/* Home Button */}
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              
              {/* Categories Dropdown - Right after Home */}
              <div 
                className="relative pb-2"
                onMouseEnter={() => {
                  if (categoryTimeoutRef.current) {
                    clearTimeout(categoryTimeoutRef.current);
                    categoryTimeoutRef.current = null;
                  }
                  setIsCategoriesOpen(true);
                }}
                onMouseLeave={() => {
                  categoryTimeoutRef.current = setTimeout(() => {
                    setIsCategoriesOpen(false);
                  }, 150); // Small delay to allow cursor movement
                }}
              >
                <button className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1">
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Rest of Navigation Items (About, Contact) */}
              {mainNavigation.filter(item => item.name !== 'Home').map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              
              <CartIcon />
              <Link
                href="/contact"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Get Quote
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white border-t border-gray-100 shadow-lg">
              {/* Home Button */}
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Categories Section - Right after Home */}
              <div className="border-t border-gray-100">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Categories
                </div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="text-gray-700 hover:text-green-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Rest of Navigation Items (About, Contact) */}
              {mainNavigation.filter(item => item.name !== 'Home').map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 block px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  View Cart
                </Link>
                <Link
                  href="/contact"
                  className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
