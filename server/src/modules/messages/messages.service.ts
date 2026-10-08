import { prisma } from "../../config/db";

export class MessagesService {
  static async getOrCreateConversation(buyerId: string, productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sellerId: true, title: true },
    });

    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (product.sellerId === buyerId) {
      const err: any = new Error("You cannot start a conversation with yourself");
      err.statusCode = 400;
      throw err;
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findUnique({
      where: {
        productId_buyerId_sellerId: {
          productId,
          buyerId,
          sellerId: product.sellerId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          productId,
          buyerId,
          sellerId: product.sellerId,
        },
      });
    }

    return conversation;
  }

  static async getUserConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
        buyer: {
          select: { id: true, name: true, avatarUrl: true, campus: true },
        },
        seller: {
          select: { id: true, name: true, avatarUrl: true, campus: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  static async getConversationMessages(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            location: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
        buyer: {
          select: { id: true, name: true, avatarUrl: true, campus: true },
        },
        seller: {
          select: { id: true, name: true, avatarUrl: true, campus: true },
        },
      },
    });

    if (!conversation) {
      const err: any = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      const err: any = new Error("Unauthorized to access this conversation");
      err.statusCode = 403;
      throw err;
    }

    // Mark unread messages sent to this user as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return {
      conversation,
      messages,
    };
  }

  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      const err: any = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }

    if (conversation.buyerId !== senderId && conversation.sellerId !== senderId) {
      const err: any = new Error("Unauthorized to send message in this conversation");
      err.statusCode = 403;
      throw err;
    }

    const receiverId =
      conversation.buyerId === senderId
        ? conversation.sellerId
        : conversation.buyerId;

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId,
          receiverId,
          content: content.trim(),
        },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  static async getUnreadCount(userId: string) {
    const [unreadMessages, pendingOrders] = await Promise.all([
      prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      }),
      prisma.order.count({
        where: {
          sellerId: userId,
          status: "PENDING",
        },
      }),
    ]);

    return {
      unreadMessages,
      pendingOrders,
      totalNotifications: unreadMessages + pendingOrders,
    };
  }
}

