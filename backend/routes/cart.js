import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import {
  validateCartItem,
  validateObjectId,
} from "../middleware/validation.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

/**
 * GET /api/cart
 * Get cart with items and total
 */
router.get("/", asyncHandler(cartController.getCart));

/**
 * POST /api/cart
 * Add item to cart
 */
router.post("/", validateCartItem, asyncHandler(cartController.addToCart));

/**
 * DELETE /api/cart/:id
 * Remove item from cart
 */
router.delete(
  "/:id",
  validateObjectId,
  asyncHandler(cartController.removeFromCart)
);

/**
 * PUT /api/cart/:id
 * Update cart item quantity
 */
router.put(
  "/:id",
  validateObjectId,
  asyncHandler(cartController.updateCartItemQuantity)
);

export default router;
