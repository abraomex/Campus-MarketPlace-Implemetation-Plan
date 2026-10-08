import { Router } from "express";
import { OrdersController } from "./orders.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "./orders.schema";

export const ordersRouter = Router();

// All order routes require authentication
ordersRouter.use(authenticate);

ordersRouter.post(
  "/",
  validateBody(createOrderSchema),
  OrdersController.createOrder
);

ordersRouter.get("/my-orders", OrdersController.getMyOrders);

ordersRouter.patch(
  "/:id/status",
  validateBody(updateOrderStatusSchema),
  OrdersController.updateOrderStatus
);

