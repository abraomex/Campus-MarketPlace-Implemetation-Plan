import { z } from "zod";

export const startConversationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content cannot be empty").max(2000),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

