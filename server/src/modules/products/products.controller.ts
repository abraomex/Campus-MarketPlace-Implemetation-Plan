import { Request, Response, NextFunction } from "express";
import { ProductsService } from "./products.service";
import { sendSuccess } from "../../utils/apiResponse";

export class ProductsController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = (req as any).validatedQuery || req.query;
      const result = await ProductsService.listProducts(queryParams);
      return sendSuccess(res, result.products, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await ProductsService.getProductById(id);
      return sendSuccess(res, product, "Product retrieved", 200);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductsService.createProduct(req.user!.userId, req.body);
      return sendSuccess(res, product, "Listing created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await ProductsService.updateProduct(
        id,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      return sendSuccess(res, product, "Listing updated successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await ProductsService.deleteProduct(
        id,
        req.user!.userId,
        req.user!.role
      );
      return sendSuccess(res, result, "Listing deleted successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductsService.listCategories();
      return sendSuccess(res, categories, "Categories retrieved", 200);
    } catch (error) {
      next(error);
    }
  }
}
