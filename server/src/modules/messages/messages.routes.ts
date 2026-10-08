import { Router } from "express";
import { MessagesController } from "./messages.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { startConversationSchema, sendMessageSchema } from "./messages.schema";

export const messagesRouter = Router();

// All message routes require authentication
messagesRouter.use(authenticate);

messagesRouter.post(
  "/start",
  validateBody(startConversationSchema),
  MessagesController.startConversation
);

messagesRouter.get("/conversations", MessagesController.getConversations);

messagesRouter.get("/unread-count", MessagesController.getUnreadCount);

messagesRouter.get("/conversations/:id", MessagesController.getMessages);

messagesRouter.post(
  "/conversations/:id",
  validateBody(sendMessageSchema),
  MessagesController.sendMessage
);

