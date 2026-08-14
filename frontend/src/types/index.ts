export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: 'COD' | 'Bank Transfer';
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  sales_data: { date: string; total: number }[];
}

export interface Buyer {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  orders_count: number;
  total_spent: number;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  updated_at?: string;
}
