'use client';

import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { Edit, Trash2, Eye, Calendar, Phone, Mail, MapPin } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onView: (order: Order) => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  ready: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  partial: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
};

export default function OrderList({ orders, onEdit, onDelete, onView }: OrderListProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.paymentStatus]}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {order.customer.phone}
                    </div>
                    {order.customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {order.customer.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(order)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Order"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
                        onDelete(order.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Order"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="font-semibold text-gray-900">{order.customer.name}</p>
                  {order.customer.address && (
                    <div className="flex items-start gap-1 mt-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{order.customer.address}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Items</p>
                  <p className="font-semibold text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.map((item) => item.productTitle).join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(order.total)}
                  </p>
                  {order.paymentMethod && (
                    <p className="text-xs text-gray-500 mt-1">
                      via {order.paymentMethod.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated Delivery:</span>{' '}
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

