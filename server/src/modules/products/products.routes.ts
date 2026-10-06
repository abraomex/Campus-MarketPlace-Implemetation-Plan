import { Router } from "express";
import { ProductsController } from "./products.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./products.schema";

export const productsRouter = Router();

// Public routes
productsRouter.get("/", validateQuery(productQuerySchema), ProductsController.getProducts);
productsRouter.get("/categories", ProductsController.getCategories);
productsRouter.get("/:id", ProductsController.getProductById);

// Protected routes (require login)
productsRouter.post(
  "/",
  authenticate,
  validateBody(createProductSchema),
  ProductsController.createProduct
);

productsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateProductSchema),
  ProductsController.updateProduct
);

productsRouter.delete("/:id", authenticate, ProductsController.deleteProduct);

