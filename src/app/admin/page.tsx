'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Order, OrderSummary } from '@/types/order';
import { Plus, Edit, Trash2, Save, X, Loader2, GripVertical, Package, TrendingUp, CheckCircle, AlertCircle, Search, Filter, ShoppingCart, DollarSign, Clock, Eye } from 'lucide-react';
import CloudinaryImage from '@/components/CloudinaryImage';
import ImageUpload from '@/components/ImageUpload';
import DraggableProductList from '@/components/DraggableProductList';
import OrderForm from '@/components/OrderForm';
import OrderList from '@/components/OrderList';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { generateSlug } from '@/lib/slug';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

type TabType = 'products' | 'orders';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'orders') {
        setActiveTab('orders');
      } else if (hash === 'products' || hash === '') {
        setActiveTab('products');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  useEffect(() => {
    if (activeTab === 'orders') {
      window.location.hash = 'orders';
    } else {
      window.location.hash = 'products';
    }
  }, [activeTab]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!data.user) {
          // Not authenticated, redirect to login
          window.location.href = '/admin/login';
          return;
        }

        setUser(data.user);
        setCheckingAuth(false);
      } catch (err) {
        console.error('Auth check error:', err);
        window.location.href = '/admin/login';
      }
    };

    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: 'service',
    subcategory: '',
    slug: '',
    featured: false,
    price: undefined,
    currency: 'BDT',
    images: [{ url: '', alt: '' }],
  });

  // Show toast notification - memoized to prevent unnecessary re-renders
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        // Sort products by order if available, then by createdAt
        // Create new array to avoid mutating the original (better for React)
        const sortedProducts = [...result.data].sort((a: Product, b: Product) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch orders when orders tab is active
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      if (orderStatusFilter !== 'all') {
        params.append('status', orderStatusFilter);
      }
      if (orderSearchQuery) {
        params.append('search', orderSearchQuery);
      }
      params.append('summary', 'true');
      
      const response = await fetch(`/api/orders?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data || []);
        if (result.summary) {
          setOrderSummary(result.summary);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter, orderSearchQuery]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const handleReorder = useCallback(async (reorderedProducts: Product[]) => {
    try {
      // Optimistically update UI
      setProducts(reorderedProducts);

      // Save to database
      const response = await fetch('/api/products/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          products: reorderedProducts.map((p, index) => ({
            id: p.id,
            order: index + 1,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh to get updated data
        await fetchProducts();
      } else {
        // Revert on error
        await fetchProducts();
        showToast('Failed to save order. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error reordering products:', error);
      // Revert on error
      await fetchProducts();
      showToast('Failed to save order. Please try again.', 'error');
    }
  }, [fetchProducts, showToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showToast(
          editingProduct ? 'Product updated successfully!' : 'Product created successfully!',
          'success'
        );
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
          title: '',
          shortDescription: '',
          longDescription: '',
          category: 'service',
          subcategory: '',
          slug: '',
          featured: false,
          images: [{ url: '', alt: '' }],
        });
        fetchProducts();
      } else {
        showToast(`Error: ${result.error || 'Failed to save product'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
        showToast('Failed to save product. Please try again.', 'error');
    }
  }, [editingProduct, formData, showToast, fetchProducts]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const result = await response.json();

        if (result.success) {
          showToast('Product deleted successfully!', 'success');
          fetchProducts();
        } else {
          showToast(`Error: ${result.error || 'Failed to delete product'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product. Please try again.', 'error');
      }
    }
  }, [showToast, fetchProducts]);

  const addImageField = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { url: '', alt: '' }],
    }));
  }, []);

  const removeImageField = useCallback((index: number) => {
    setFormData((prev) => {
      const newImages = prev.images?.filter((_, i) => i !== index) || [];
      return { ...prev, images: newImages };
    });
  }, []);

  const updateImageField = useCallback((index: number, field: 'url' | 'alt', value: string) => {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  }, []);

  // Order management functions
  const handleCreateOrder = useCallback(async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Order created successfully!', 'success');
        setShowOrderForm(false);
        setEditingOrder(null);
        fetchOrders();
      } else {
        showToast(`Error: ${result.error || 'Failed to create order'}`, 'error');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showToast('Failed to create order. Please try again.', 'error');
    }
  }, [showToast, fetchOrders]);

  const handleUpdateOrder = useCallback(async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    if (!editingOrder) return;
    
    try {
      const response = await fetch(`/api/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Order updated successfully!', 'success');
        setShowOrderForm(false);
        setEditingOrder(null);
        fetchOrders();
      } else {
        showToast(`Error: ${result.error || 'Failed to update order'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Failed to update order. Please try again.', 'error');
    }
  }, [editingOrder, showToast, fetchOrders]);

  const handleDeleteOrder = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Order deleted successfully!', 'success');
        fetchOrders();
      } else {
        showToast(`Error: ${result.error || 'Failed to delete order'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('Failed to delete order. Please try again.', 'error');
    }
  }, [showToast, fetchOrders]);

  const handleEditOrder = useCallback((order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  }, []);

  const handleViewOrder = useCallback((order: Order) => {
    setViewingOrder(order);
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orderSearchQuery && orderStatusFilter === 'all') {
      return orders;
    }
    
    const lowerSearchQuery = orderSearchQuery.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = !orderSearchQuery || 
        order.orderNumber.toLowerCase().includes(lowerSearchQuery) ||
        order.customer.name.toLowerCase().includes(lowerSearchQuery) ||
        order.customer.phone.includes(orderSearchQuery) ||
        (order.customer.email && order.customer.email.toLowerCase().includes(lowerSearchQuery));
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filter and search products - memoized for performance (must be before early returns)
  const filteredProducts = useMemo(() => {
    if (!searchQuery && filterCategory === 'all') {
      return products;
    }
    
    const lowerSearchQuery = searchQuery.toLowerCase();
    return products.filter((product) => {
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(lowerSearchQuery) ||
        product.shortDescription.toLowerCase().includes(lowerSearchQuery);
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  // Calculate statistics - memoized for performance (must be before early returns)
  const stats = useMemo(() => ({
    total: products.length,
    featured: products.filter(p => p.featured).length,
    services: products.filter(p => p.category === 'service').length,
    products: products.filter(p => p.category === 'product').length,
  }), [products]);

  // Show loading state while checking authentication or loading products
  if (checkingAuth || (loading && products.length === 0 && !checkingAuth)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">
            {checkingAuth ? 'Checking authentication...' : 'Loading products...'}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading (redirect should happen)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        } border rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 min-w-[300px]`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="font-medium">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      {user && (
        <AdminSidebar
          user={user}
          onLogout={handleLogout}
          stats={{
            totalProducts: stats.total,
            totalOrders: orderSummary?.totalOrders,
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          {activeTab === 'products' && (
            <AdminHeader
              title="Products Management"
              subtitle={`Manage your ${stats.total} products and services`}
              action={{
                label: 'Add Product',
                onClick: () => {
                  setShowForm(true);
                  setEditingProduct(null);
                  setFormData({
                    title: '',
                    shortDescription: '',
                    longDescription: '',
                    category: 'service',
                    subcategory: '',
                    slug: '',
                    featured: false,
                    price: undefined,
                    currency: 'BDT',
                    images: [{ url: '', alt: '' }],
                  });
                },
              }}
            />
          )}

          {activeTab === 'orders' && (
            <AdminHeader
              title="Orders Management"
              subtitle={`Manage ${orderSummary?.totalOrders || 0} customer orders`}
              action={{
                label: 'Create Order',
                onClick: () => {
                  setEditingOrder(null);
                  setShowOrderForm(true);
                },
              }}
            />
          )}

          {/* Statistics Cards */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Featured</p>
                <p className="text-3xl font-bold text-gray-900">{stats.featured}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Services</p>
                <p className="text-3xl font-bold text-gray-900">{stats.services}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
            </div>
          )}

          {activeTab === 'orders' && orderSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{orderSummary.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{orderSummary.pendingOrders}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{orderSummary.inProgressOrders}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{orderSummary.completedOrders}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">৳{orderSummary.totalRevenue.toFixed(0)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

              {/* Search and Filter Bar */}
              {activeTab === 'products' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                    <div className="relative sm:w-48">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 appearance-none"
                      >
                        <option value="all">All Categories</option>
                        <option value="service">Services</option>
                        <option value="product">Products</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by order number, customer name, phone, or email..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="relative sm:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

          {/* Products Content */}
          {activeTab === 'products' && (
            <>
              {/* Reorder Instructions */}
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GripVertical className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Drag and Drop to Reorder
                    </p>
                    <p className="text-xs text-blue-700">
                      Drag products by the grip icon to rearrange their display order on public pages. Changes are saved automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Draggable Product List */}
              {filteredProducts.length > 0 ? (
                <DraggableProductList
                  products={filteredProducts}
                  onReorder={handleReorder}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : products.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">No products found</p>
                  <p className="text-sm text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">No products yet</p>
                  <p className="text-sm text-gray-600 mb-6">Get started by adding your first product!</p>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingProduct(null);
                      setFormData({
                        title: '',
                        shortDescription: '',
                        longDescription: '',
                        category: 'service',
                        subcategory: '',
                        slug: '',
                        featured: false,
                        price: undefined,
                        currency: 'BDT',
                        images: [{ url: '', alt: '' }],
                      });
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center mx-auto shadow-lg shadow-green-500/25"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Product
                  </button>
                </div>
              )}
            </>
          )}

          {/* Orders Content */}
          {activeTab === 'orders' && (
            <>
              {ordersLoading ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <OrderList
                  orders={filteredOrders}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                  onView={handleViewOrder}
                />
              ) : orders.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">No orders found</p>
                  <p className="text-sm text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">No orders yet</p>
                  <p className="text-sm text-gray-600 mb-6">Get started by creating your first order!</p>
                  <button
                    onClick={() => {
                      setEditingOrder(null);
                      setShowOrderForm(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center mx-auto shadow-lg shadow-green-500/25"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Order
                  </button>
                </div>
              )}
            </>
          )}

          {/* Old Grid View (Hidden) - Keeping for reference */}
          {false && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <CloudinaryImage
                  src={product.images[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded uppercase">
                    {product.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {product.shortDescription}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/products/${product.slug}`)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          )}
        </main>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  {editingProduct ? (
                    <Edit className="h-5 w-5 text-green-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editingProduct ? 'Update product information' : 'Create a new product or service'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form id="product-form" onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-500 mt-1">Essential product details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          // Auto-generate slug from title if slug is empty or matches the previous title's slug
                          const currentSlugFromTitle = generateSlug(formData.title || '');
                          const shouldAutoGenerate = !formData.slug || formData.slug === currentSlugFromTitle;
                          
                          setFormData({
                            ...formData,
                            title: newTitle,
                            slug: shouldAutoGenerate ? generateSlug(newTitle) : formData.slug,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="Enter product title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Slug <span className="text-gray-400 font-normal">(auto-generated from title)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          // Allow manual editing but normalize the slug
                          setFormData({ ...formData, slug: generateSlug(e.target.value) });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="Auto-generated from title"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-generated from title. Can be edited manually. Will be made unique if needed.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white resize-none"
                      placeholder="Brief description (shown in product cards)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Long Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white resize-none"
                      placeholder="Detailed description (shown on product detail page)"
                    />
                  </div>
                </div>

                {/* Category Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Category & Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">Organize and configure your product</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as 'service' | 'product',
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                      >
                        <option value="service">Service</option>
                        <option value="product">Product</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={formData.subcategory || ''}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="Optional subcategory"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center cursor-pointer p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors w-full">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-semibold text-gray-700 block">Featured</span>
                          <span className="text-xs text-gray-500">Highlight on homepage</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Price Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (BDT)
                        <span className="text-gray-400 font-normal ml-2">(Optional - leave empty for &quot;Contact for pricing&quot;)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            price: value === '' ? undefined : parseFloat(value) || undefined,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="Enter price in BDT (e.g., 1500)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Products without price will show &quot;Contact for pricing&quot; and cannot be added to cart.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.currency || 'BDT'}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                      <p className="text-sm text-gray-500 mt-1">Upload or add image URLs</p>
                    </div>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-semibold flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.images?.map((image, index) => (
                      <div key={index} className="p-6 border-2 border-gray-200 rounded-2xl space-y-4 bg-gray-50 hover:bg-white transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Image {index + 1} {index === 0 && <span className="text-green-600">(Primary)</span>}
                          </h4>
                          {formData.images && formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1.5" />
                              Remove
                            </button>
                          )}
                        </div>
                        
                        {/* Image Upload Component */}
                        <div className="mb-4">
                          <ImageUpload
                            existingUrl={image.url}
                            onUploadComplete={(url) => updateImageField(index, 'url', url)}
                            onRemove={() => updateImageField(index, 'url', '')}
                          />
                        </div>
                        
                        {/* Alt Text Input */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Alt Text <span className="text-gray-400 font-normal">(for accessibility)</span>
                          </label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                            placeholder="Describe this image for screen readers..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          />
                        </div>

                        {/* Manual URL Input (Alternative) */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Or enter Image URL manually
                          </label>
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => updateImageField(index, 'url', e.target.value)}
                            placeholder="https://res.cloudinary.com/... or image URL"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
              >
                <Save className="h-5 w-5 mr-2" />
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          order={editingOrder}
          products={products}
          onSave={editingOrder ? handleUpdateOrder : handleCreateOrder}
          onClose={() => {
            setShowOrderForm(false);
            setEditingOrder(null);
          }}
        />
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-xl font-bold text-gray-900">{viewingOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    viewingOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    viewingOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    viewingOrder.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                    viewingOrder.status === 'ready' ? 'bg-indigo-100 text-indigo-800' :
                    viewingOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {viewingOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{viewingOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{viewingOrder.customer.phone}</p>
                  </div>
                  {viewingOrder.customer.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{viewingOrder.customer.email}</p>
                    </div>
                  )}
                  {viewingOrder.customer.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">{viewingOrder.customer.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {viewingOrder.items.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productTitle}</p>
                          {item.specifications && (
                            <p className="text-sm text-gray-600 mt-1">{item.specifications}</p>
                          )}
                        </div>
                        <p className="font-bold text-green-600">৳{item.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>Unit Price: ৳{item.unitPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">৳{viewingOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {(viewingOrder.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-semibold text-red-600">-৳{(viewingOrder.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {(viewingOrder.tax || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">৳{(viewingOrder.tax || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {(viewingOrder.shipping || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">৳{(viewingOrder.shipping || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">৳{viewingOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      viewingOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      viewingOrder.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-800' :
                      viewingOrder.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {viewingOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  {viewingOrder.paymentMethod && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <p className="font-semibold text-gray-900">
                        {viewingOrder.paymentMethod.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {(viewingOrder.estimatedDelivery || viewingOrder.notes) && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  {viewingOrder.estimatedDelivery && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(viewingOrder.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {viewingOrder.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
                      <p className="text-gray-900 whitespace-pre-line">{viewingOrder.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewingOrder(null);
                    handleEditOrder(viewingOrder);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

