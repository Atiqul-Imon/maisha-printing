'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, Printer } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const orderNum = searchParams.get('orderNumber');
    if (orderNum) {
      setOrderNumber(orderNum);
    } else {
      // If no order number, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 lg:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. We&apos;ve received your request and will process it shortly.
          </p>

          {/* Order Number */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
            <p className="text-2xl lg:text-3xl font-bold text-green-600 font-mono">
              {orderNumber}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Printer className="h-5 w-5 text-green-600" />
              What Happens Next?
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>We&apos;ll review your order and contact you within 24 hours to confirm details.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>Once confirmed, we&apos;ll begin processing your order.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>We&apos;ll notify you when your order is ready for pickup or delivery.</span>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <p className="text-gray-600 mb-2">
              Need to make changes or have questions?
            </p>
            <p className="text-gray-900 font-semibold">
              Call us: <a href="tel:+8801861623213" className="text-green-600 hover:text-green-700">+880 1861 623213</a>
            </p>
            <p className="text-gray-900 font-semibold">
              Email: <a href="mailto:maishaprintingbd@gmail.com" className="text-green-600 hover:text-green-700">maishaprintingbd@gmail.com</a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5" />
              Continue Shopping
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Contact Us
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

