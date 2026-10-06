import { z } from "zod";

const ConditionEnum = z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]);
const StatusEnum = z.enum(["AVAILABLE", "PENDING", "SOLD"]);

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  condition: ConditionEnum.default("GOOD"),
  location: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().optional(),
  condition: ConditionEnum.optional(),
  status: StatusEnum.optional(),
  location: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  condition: ConditionEnum.optional(),
  status: StatusEnum.optional(),
  sellerId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

