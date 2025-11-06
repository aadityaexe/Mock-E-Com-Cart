/**
 * Checkout controller - handles checkout-related HTTP requests
 */
import * as orderService from "../services/orderService.js";

/**
 * POST /api/checkout
 * Process checkout and create order
 */
export const checkout = async (req, res, next) => {
  try {
    console.log("[checkoutController] checkout", req.body);
    const receipt = await orderService.createOrder(req.body);
    res.status(201).json(receipt);
  } catch (error) {
    console.error("[checkoutController] checkout error:", error);
    if (
      error.message === "Cart is empty" ||
      error.message === "No valid items in cart"
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
