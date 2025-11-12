'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2, Eye, Save, X, LogOut, User, Loader2, GripVertical, Package, TrendingUp, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import CloudinaryImage from '@/components/CloudinaryImage';
import ImageUpload from '@/components/ImageUpload';
import DraggableProductList from '@/components/DraggableProductList';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    images: [{ url: '', alt: '' }],
  });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        // Sort products by order if available, then by createdAt
        const sortedProducts = result.data.sort((a: Product, b: Product) => {
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
  };

  const handleReorder = async (reorderedProducts: Product[]) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
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
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), { url: '', alt: '' }],
    });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, images: newImages });
  };

  const updateImageField = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

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

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: products.length,
    featured: products.filter(p => p.featured).length,
    services: products.filter(p => p.category === 'service').length,
    products: products.filter(p => p.category === 'product').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500">{user.role || 'Admin'}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm border border-gray-200"
              >
                <Eye className="h-4 w-4 inline mr-2" />
                View Site
              </button>
              
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center font-medium text-sm border border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              
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
                    images: [{ url: '', alt: '' }],
                  });
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
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

        {/* Search and Filter Bar */}
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
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="Enter product title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="product-slug-url"
                      />
                      <p className="text-xs text-gray-500 mt-1">Used in the product URL</p>
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
    </div>
  );
}

