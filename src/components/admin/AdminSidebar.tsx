'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  ShoppingCart, 
  LogOut, 
  Menu,
  X,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  user: {
    name?: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
  activeTab?: 'products' | 'orders';
  onTabChange?: (tab: 'products' | 'orders') => void;
  stats?: {
    totalProducts?: number;
    totalOrders?: number;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: number;
  onClick?: () => void;
}

export default function AdminSidebar({ user, onLogout, activeTab = 'products', onTabChange, stats }: AdminSidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: stats?.totalProducts,
      onClick: () => onTabChange?.('products'),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: stats?.totalOrders,
      onClick: () => onTabChange?.('orders'),
    },
  ];

  const isActive = (item: NavItem) => {
    return item.id === activeTab;
  };

  const handleNavClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/Logo.png"
                alt="Maisha Printing Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Maisha Printing</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${active ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'}
                  `}>
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="h-4 w-4" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            <Eye className="h-5 w-5" />
            <span className="font-medium">View Site</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

