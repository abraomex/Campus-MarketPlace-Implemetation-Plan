export type ItemCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type ProductStatus = "AVAILABLE" | "PENDING" | "SOLD";
export type UserRole = "STUDENT" | "ADMIN";

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
    createdAt?: string;
  };
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
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

