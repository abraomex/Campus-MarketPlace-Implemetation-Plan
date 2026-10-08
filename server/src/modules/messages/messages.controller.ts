import { Request, Response, NextFunction } from "express";
import { MessagesService } from "./messages.service";
import { sendSuccess } from "../../utils/apiResponse";

export class MessagesController {
  static async startConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await MessagesService.getOrCreateConversation(
        req.user!.userId,
        req.body.productId
      );
      return sendSuccess(res, conversation, "Conversation ready", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await MessagesService.getUserConversations(
        req.user!.userId
      );
      return sendSuccess(res, conversations, "Conversations retrieved", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MessagesService.getConversationMessages(
        req.params.id as string,
        req.user!.userId
      );
      return sendSuccess(res, result, "Messages retrieved", 200);
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await MessagesService.sendMessage(
        req.params.id as string,
        req.user!.userId,
        req.body.content
      );
      return sendSuccess(res, message, "Message sent", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await MessagesService.getUnreadCount(req.user!.userId);
      return sendSuccess(res, counts, "Unread count retrieved", 200);
    } catch (error) {
      next(error);
    }
  }
}

