import { prisma } from "../../config/db";
import { CreateOrderInput } from "./orders.schema";
import { OrderStatus } from "@prisma/client";

export class OrdersService {
  static async createOrder(buyerId: string, input: CreateOrderInput) {
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      include: { seller: true },
    });

    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (product.sellerId === buyerId) {
      const err: any = new Error("You cannot purchase your own listing");
      err.statusCode = 400;
      throw err;
    }

    if (product.status === "SOLD") {
      const err: any = new Error("This item has already been sold");
      err.statusCode = 400;
      throw err;
    }

    // Check if an active order already exists for this product
    const existingOrder = await prisma.order.findUnique({
      where: { productId: input.productId },
    });

    if (existingOrder && existingOrder.status !== "CANCELLED") {
      const err: any = new Error("An order is already pending for this item");
      err.statusCode = 400;
      throw err;
    }

    // Run order creation and product status update in transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          productId: product.id,
          buyerId,
          sellerId: product.sellerId,
          price: product.price,
          status: "PENDING",
          paymentMethod: input.paymentMethod,
          meetupLocation: input.meetupLocation.trim(),
          meetupNote: input.meetupNote?.trim(),
        },
        include: {
          product: {
            include: {
              images: { take: 1 },
              category: true,
            },
          },
          buyer: { select: { id: true, name: true, email: true, phone: true } },
          seller: { select: { id: true, name: true, email: true, phone: true } },
        },
      }),
      prisma.product.update({
        where: { id: product.id },
        data: { status: "PENDING" },
      }),
    ]);

    // Automatically trigger conversation message between buyer & seller
    try {
      let conv = await prisma.conversation.findUnique({
        where: {
          productId_buyerId_sellerId: {
            productId: product.id,
            buyerId,
            sellerId: product.sellerId,
          },
        },
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            productId: product.id,
            buyerId,
            sellerId: product.sellerId,
          },
        });
      }

      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: buyerId,
          receiverId: product.sellerId,
          content: `🛒 Hi! I just placed an order to buy "${product.title}" for $${Number(product.price).toFixed(2)}. Meetup location: ${input.meetupLocation}${input.meetupNote ? ` (${input.meetupNote})` : ""}. Let's coordinate meeting on campus!`,
        },
      });
    } catch (e) {
      console.error("Failed to auto-send order chat notification:", e);
    }

    return order;
  }

  static async getUserOrders(userId: string) {
    const [purchases, sales] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: { take: 1 },
              category: true,
            },
          },
          seller: {
            select: { id: true, name: true, email: true, campus: true, phone: true },
          },
        },
      }),
      prisma.order.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: { take: 1 },
              category: true,
            },
          },
          buyer: {
            select: { id: true, name: true, email: true, campus: true, phone: true },
          },
        },
      }),
    ]);

    return { purchases, sales };
  }

  static async updateOrderStatus(
    orderId: string,
    userId: string,
    status: OrderStatus
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      const err: any = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (order.buyerId !== userId && order.sellerId !== userId) {
      const err: any = new Error("Unauthorized to update this order");
      err.statusCode = 403;
      throw err;
    }

    // Determine target product status
    let productStatus: "AVAILABLE" | "PENDING" | "SOLD" = "PENDING";
    if (status === "CANCELLED") {
      productStatus = "AVAILABLE";
    } else if (status === "COMPLETED") {
      productStatus = "SOLD";
    }

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          product: true,
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.product.update({
        where: { id: order.productId },
        data: { status: productStatus },
      }),
    ]);

    return updatedOrder;
  }
}

