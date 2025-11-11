'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2, Eye, Save, X, LogOut, User, Loader2, GripVertical } from 'lucide-react';
import ImageKitImage from '@/components/ImageKitImage';
import ImageUpload from '@/components/ImageUpload';
import DraggableProductList from '@/components/DraggableProductList';

export default function AdminPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Prevent redirect loop - only redirect if we're not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        window.location.replace('/admin/login');
      }
    }
  }, [status]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login', redirect: true });
  };
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
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
        alert('Failed to save order. Please try again.');
      }
    } catch (error) {
      console.error('Error reordering products:', error);
      // Revert on error
      await fetchProducts();
      alert('Failed to save order. Please try again.');
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
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
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
        alert(`Error: ${result.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
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
        });

        const result = await response.json();

        if (result.success) {
          alert('Product deleted successfully!');
          fetchProducts();
        } else {
          alert(`Error: ${result.error || 'Failed to delete product'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
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

  // Show loading state only while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching products (only if authenticated)
  if (status === 'authenticated' && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not authenticated (redirect will happen via useEffect)
  if (status === 'unauthenticated') {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CMS Admin Panel</h1>
              <p className="text-sm text-gray-600 mt-1">Manage Products & Services</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {session?.user && (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{session.user.name || session.user.email}</p>
                    <p className="text-xs text-gray-500">{session.user.role || 'Admin'}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Site
              </button>
              
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center font-medium"
              >
                <LogOut className="h-5 w-5 mr-2" />
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
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
        {/* Reorder Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <GripVertical className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Drag and Drop to Reorder
              </p>
              <p className="text-xs text-blue-700">
                Drag products by the grip icon to rearrange their display order on public pages. Changes are saved automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Draggable Product List */}
        {products.length > 0 ? (
          <DraggableProductList
            products={products}
            onReorder={handleReorder}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products yet. Add your first product to get started!</p>
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
                <ImageKitImage
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Images *
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Image
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                      {/* Image Upload Component */}
                      <ImageUpload
                        existingUrl={image.url}
                        onUploadComplete={(url) => updateImageField(index, 'url', url)}
                        onRemove={() => updateImageField(index, 'url', '')}
                      />
                      
                      {/* Alt Text Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alt Text (for accessibility)
                        </label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                          placeholder="Describe this image..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {/* Manual URL Input (Alternative) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter Image URL manually
                        </label>
                        <input
                          type="text"
                          value={image.url}
                          onChange={(e) => updateImageField(index, 'url', e.target.value)}
                          placeholder="https://ik.imagekit.io/... or image URL"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Remove Button */}
                      {formData.images && formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Image
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

