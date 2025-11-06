// Express application entrypoint
// Sets up middleware, routes, MongoDB connection, and error handling
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productsRoute from "./routes/products.js";
import cartRoute from "./routes/cart.js";
import checkoutRoute from "./routes/checkout.js";
import invoiceRoute from "./routes/invoice.js";
import ordersRoute from "./routes/orders.js";
import { notFound, errorHandler } from "./utils/errorHandler.js";
import * as productService from "./services/productService.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// API Routes
app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/orders", ordersRoute);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// MongoDB Connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mock-ecom-cart";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("[server] MongoDB connected");
    // Seed products after connection
    return productService.seedDefaultProducts();
  })
  .then((seeded) => {
    if (seeded) {
      console.log("[server] Default products seeded");
    }
  })
  .catch((err) => {
    console.error("[server] MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[server] SIGTERM received, closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[server] listening at http://localhost:${PORT}`);
});
