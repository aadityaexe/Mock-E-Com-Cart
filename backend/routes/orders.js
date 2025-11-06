import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { validateCheckout, validateObjectId } from "../middleware/validation.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

/**
 * GET /api/orders
 * List recent orders
 */
router.get("/", asyncHandler(orderController.listOrders));

/**
 * POST /api/orders
 * Create order (alternative to /api/checkout)
 * Accepts: { name, email, company?, paymentMode?, cartItems? }
 * Returns: { id, orderId, name, email, company, paymentMode, items, subtotal, tax, total, timestamp }
 */
router.post("/", validateCheckout, asyncHandler(orderController.createOrder));

/**
 * GET /api/orders/:id
 * Get order by ID
 */
router.get("/:id", validateObjectId, asyncHandler(orderController.getOrderById));

export default router;


