import { z } from "zod";

const PaymentMethodEnum = z.enum([
  "CAMPUS_MEETUP_CASH",
  "VENMO_OR_ZELLE",
  "CARD",
]);

const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const createOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  paymentMethod: PaymentMethodEnum.default("CAMPUS_MEETUP_CASH"),
  meetupLocation: z.string().min(2, "Meetup location is required"),
  meetupNote: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

