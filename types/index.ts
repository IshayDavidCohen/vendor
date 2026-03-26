// ========================
// API Response wrapper
// ========================
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ========================
// Business
// ========================
export interface BusinessCreateData {
  bid: string;
  company_name: string;
  desc: string;
  icon: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  shipping_address: string;
  categories: string[];
}

export interface Business {
  id: string;
  bid: string;
  company_name: string;
  desc: string;
  icon: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  shipping_address: string;
  categories: string[];
  my_suppliers: string[];
  handshake_requests: string[];
  active_orders: string[];
  order_history: string[];
  created_at: string;
  updated_at: string;
}

// ========================
// Supplier
// ========================
export interface SupplierCreateData {
  bid: string;
  company_name: string;
  desc: string;
  icon: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  shipping_address: string;
  categories: string[];
}

export interface Supplier {
  id: string;
  bid: string;
  company_name: string;
  desc: string;
  icon: string;
  banner: string;
  email: string;
  phone: string;
  address: string;
  shipping_address: string;
  categories: string[];
  approved_businesses: string[];
  handshake_requests: string[];
  items: string[];
  active_orders: string[];
  order_history: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierCarouselItem {
  link: string;
  title: string;
  desc: string;
  banner: string;
  icon: string;
}

// ========================
// Item
// ========================
export interface ItemCreateData {
  supplier_id: string;
  name: string;
  category: string;
  image: string;
  desc: string;
  base_price: number;
  unit: string;
  currency: string;
}

export interface Item {
  id: string;
  supplier_id: string;
  name: string;
  category: string;
  image: string;
  desc: string;
  base_price: number;
  unit: string;
  currency: string;
  custom_prices: Record<string, number>;
  created_at: string;
  updated_at: string;
}

// ========================
// Category
// ========================
export interface CategoryCreateData {
  oid: string;
  title: string;
  icon: string;
  image: string;
  users?: Record<string, string>;
}

export interface Category {
  oid: string;
  title: string;
  icon: string;
  image: string;
  users: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// ========================
// Handshake
// ========================
export interface HandshakeCreateData {
  sender_id: string;
  recipient_id: string;
  sender_type: 'business' | 'supplier';
  recipient_type: 'business' | 'supplier';
}

export type HandshakeStatus = 'pending' | 'accepted' | 'rejected' | 'acknowledged';

export interface Handshake {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_type: 'business' | 'supplier';
  recipient_type: 'business' | 'supplier';
  status: HandshakeStatus;
  created_at: string;
  updated_at: string;
}

// ========================
// Order
// ========================
export interface OrderCreateData {
  business: string;
  orders: Record<string, Record<string, number>>;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'delivering' | 'arrived';

export interface OrderedItem {
  item_id: string;
  quantity: number;
  base_price: number;
  price_at_order: number;
  total_price_for_item: number;
}

export interface Order {
  id: string;
  supplier_id: string;
  business_id: string;
  estimated_eta?: string;
  ordered_items: OrderedItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

// ========================
// Auth
// ========================
export type UserRole = 'business' | 'supplier' | null;
