/**
 * Order Types and Interfaces
 * Industry-standard order management system
 */

export type OrderStatus = 
  | 'pending'      // Order received, awaiting confirmation
  | 'confirmed'    // Order confirmed by admin
  | 'in_progress'  // Order is being processed
  | 'ready'        // Order ready for pickup/delivery
  | 'completed'   // Order delivered/completed
  | 'cancelled';  // Order cancelled

export type PaymentStatus = 
  | 'pending'      // Payment not received
  | 'partial'      // Partial payment received
  | 'paid'         // Full payment received
  | 'refunded';    // Payment refunded

export type PaymentMethod = 
  | 'cash'         // Cash on delivery
  | 'bank_transfer' // Bank transfer
  | 'mobile_banking' // Mobile banking (bKash, Nagad, etc.)
  | 'card'         // Credit/Debit card
  | 'other';       // Other payment method

export interface OrderItem {
  productId: string;
  productTitle: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: string; // Custom specifications for the order
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string; // Customer notes/special instructions
}

export interface Order {
  id: string;
  orderNumber: string; // Unique order number (e.g., ORD-2024-001)
  items: OrderItem[];
  customer: CustomerInfo;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  total: number;
  notes?: string; // Admin notes
  estimatedDelivery?: string; // ISO date string
  deliveredAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // Admin user ID if created manually
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingRevenue: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string; // Search by order number, customer name, phone
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  skip?: number;
}

