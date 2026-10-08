import { Request, Response, NextFunction } from "express";
import { OrdersService } from "./orders.service";
import { sendSuccess } from "../../utils/apiResponse";

export class OrdersController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrdersService.createOrder(
        req.user!.userId,
        req.body
      );
      return sendSuccess(res, order, "Order placed successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrdersService.getUserOrders(req.user!.userId);
      return sendSuccess(res, orders, "Orders retrieved", 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await OrdersService.updateOrderStatus(
        req.params.id as string,
        req.user!.userId,
        req.body.status
      );
      return sendSuccess(res, updated, "Order status updated", 200);
    } catch (error) {
      next(error);
    }
  }
}

