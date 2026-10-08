export type ItemCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type ProductStatus = "AVAILABLE" | "PENDING" | "SOLD";
export type UserRole = "STUDENT" | "ADMIN";
export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentMethod = "CAMPUS_MEETUP_CASH" | "VENMO_OR_ZELLE" | "CARD";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  campus?: string | null;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string | number;
  condition: ItemCondition;
  status: ProductStatus;
  location?: string | null;
  categoryId: string;
  category: Category;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    campus?: string | null;
    bio?: string | null;
    email?: string;
    phone?: string | null;
    createdAt?: string;
  };
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface Conversation {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    price: string | number;
    status: ProductStatus;
    location?: string | null;
    images?: { url: string }[];
  };
  buyer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    campus?: string | null;
  };
  seller: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    campus?: string | null;
  };
  messages?: Message[];
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  price: string | number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  meetupLocation: string;
  meetupNote?: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
  buyer?: User;
  seller?: User;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  error?: string;
}
