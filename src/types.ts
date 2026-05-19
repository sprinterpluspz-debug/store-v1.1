export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  engine: string;
}

export interface UserVehicleSelection {
  make: string;
  model: string;
  year: string;
  engine: string;
}

export interface Product {
  id: string | number;
  name: string | { en: string; sq: string; sr: string };
  sku: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  badge?: string;
  rating: number;
  quantity: number;
  instock: boolean;
  description?: string | { en: string; sq: string; sr: string };
  compatibleVehicles?: string[]; // Array of vehicle IDs
  isReturnable?: boolean;
  created?: any;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: string | number;
  items: CartItem[];
  name: string;
  email: string;
  address: string;
  phone: string;
  subtotal: number;
  discountPercent: number;
  totalAfterDiscount: number;
  customerTier: string;
  customerPrevOrders: number;
  created: string;
  status: 'new' | 'processed';
  avatarInitials: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'customer';
  password?: string;
  phone?: string;
  address?: string;
  emailVerified?: boolean;
  created?: any; // Timestamp
}

export interface AuthState {
  user: User | null;
}
