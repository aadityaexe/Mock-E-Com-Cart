import { Router } from "express";
import * as checkoutController from "../controllers/checkoutController.js";
import { validateCheckout } from "../middleware/validation.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

/**
 * POST /api/checkout
 * Process checkout and create order
 * Accepts: { name, email, company?, paymentMode?, cartItems? }
 * Returns: { id, orderId, name, email, company, paymentMode, items, subtotal, tax, total, timestamp }
 */
router.post("/", validateCheckout, asyncHandler(checkoutController.checkout));

export default router;
