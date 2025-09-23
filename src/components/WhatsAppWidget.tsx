'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const phoneNumber = '8801861623213'; // Your WhatsApp number without + sign

  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  const handleQuickMessage = (quickMessage: string) => {
    const encodedMessage = encodeURIComponent(quickMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const quickMessages = [
    'Hi! I need a quote for printing services',
    'Can you help me with t-shirt printing?',
    'I want to know about your services',
    'I am interested in visiting card printing',
    'Do you print calendars?'
  ];

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Open WhatsApp chat"
        >
          {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
              1
            </div>
          )}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:bottom-24 sm:right-6 z-50 w-80 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold text-sm">M</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Maisha Printing</h3>
                <p className="text-green-100 text-xs">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-3">
                Hi! 👋 How can we help you today?
              </p>
              
              {/* Quick Messages */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick messages:</p>
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(msg)}
                    className="block w-full text-left p-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-200"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message Input */}
            <div className="space-y-3">
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-500 mb-2">Or send a custom message:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 text-center">
            <p className="text-xs text-gray-500">
              Powered by WhatsApp • Usually replies within minutes
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
