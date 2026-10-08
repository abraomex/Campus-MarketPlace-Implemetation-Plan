import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { authRouter } from "./modules/auth/auth.routes";
import { productsRouter } from "./modules/products/products.routes";
import { messagesRouter } from "./modules/messages/messages.routes";
import { ordersRouter } from "./modules/orders/orders.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Campus Marketplace API",
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/orders", ordersRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Campus Marketplace API running on http://localhost:${PORT}`);
  console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
});

export default app;

