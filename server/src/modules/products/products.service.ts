import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryInput,
} from "./products.schema";

export class ProductsService {
  static async listProducts(query: ProductQueryInput) {
    const {
      search,
      categoryId,
      condition,
      status,
      sellerId,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    } = query;

    const where: Prisma.ProductWhereInput = {};

    if (status) {
      where.status = status;
    } else {
      where.status = "AVAILABLE";
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (condition) {
      where.condition = condition;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { price: "desc" };
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          seller: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              campus: true,
              createdAt: true,
            },
          },
          images: {
            orderBy: { isPrimary: "desc" },
            select: { id: true, url: true, isPrimary: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            campus: true,
            bio: true,
            createdAt: true,
          },
        },
        images: {
          orderBy: { isPrimary: "desc" },
        },
      },
    });

    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  static async createProduct(sellerId: string, input: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      const error: any = new Error("Selected category does not exist");
      error.statusCode = 400;
      throw error;
    }

    const product = await prisma.product.create({
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        price: new Prisma.Decimal(input.price),
        condition: input.condition,
        location: input.location?.trim(),
        categoryId: input.categoryId,
        sellerId,
        images: input.imageUrls && input.imageUrls.length > 0
          ? {
              create: input.imageUrls.map((url, index) => ({
                url,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        seller: {
          select: { id: true, name: true, campus: true, avatarUrl: true },
        },
        images: true,
      },
    });

    return product;
  }

  static async updateProduct(
    id: string,
    userId: string,
    userRole: string,
    input: UpdateProductInput
  ) {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.sellerId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("You are not authorized to edit this listing");
      error.statusCode = 403;
      throw error;
    }

    const data: Prisma.ProductUpdateInput = {};
    if (input.title !== undefined) data.title = input.title.trim();
    if (input.description !== undefined) data.description = input.description.trim();
    if (input.price !== undefined) data.price = new Prisma.Decimal(input.price);
    if (input.condition !== undefined) data.condition = input.condition;
    if (input.status !== undefined) data.status = input.status;
    if (input.location !== undefined) data.location = input.location?.trim();
    if (input.categoryId !== undefined) {
      data.category = { connect: { id: input.categoryId } };
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        seller: { select: { id: true, name: true, campus: true } },
        images: true,
      },
    });

    return updated;
  }

  static async deleteProduct(id: string, userId: string, userRole: string) {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (existing.sellerId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("You are not authorized to delete this listing");
      error.statusCode = 403;
      throw error;
    }

    await prisma.product.delete({ where: { id } });
    return { id, message: "Product deleted successfully" };
  }

  static async listCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }
}

