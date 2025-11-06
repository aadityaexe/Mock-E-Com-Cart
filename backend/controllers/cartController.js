/**
 * Cart controller - handles cart-related HTTP requests
 *
 * Conventions:
 * - Validate inputs early with clear 4xx responses
 * - Delegate business logic to services
 * - Forward errors to the global error handler with next()
 */
import * as cartService from "../services/cartService.js";

/**
 * GET /api/cart
 * Get cart with items and total
 */
export const getCart = async (req, res, next) => {
  try {
    console.log("[cartController] getCart");
    const cart = await cartService.getCart();
    res.json(cart);
  } catch (error) {
    console.error("[cartController] getCart error:", error);
    next(error);
  }
};

/**
 * POST /api/cart
 * Add item to cart
 */
export const addToCart = async (req, res, next) => {
  try {
    console.log("[cartController] addToCart", req.body);
    const { productId, qty } = req.body;

    // Validate inputs
    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ message: "productId is required" });
    }
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({ message: "qty must be a positive integer", field: "qty" });
    }
    await cartService.addToCart(productId, qty);
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("[cartController] addToCart error:", error);
    if (error.message === "Product not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * DELETE /api/cart/:id
 * Remove item from cart
 */
export const removeFromCart = async (req, res, next) => {
  try {
    console.log("[cartController] removeFromCart", req.params);
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "cart item id is required" });
    }
    await cartService.removeFromCart(id);
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("[cartController] removeFromCart error:", error);
    if (error.message === "Cart item not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * PUT /api/cart/:id
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    console.log("[cartController] updateCartItemQuantity", {
      params: req.params,
      body: req.body,
    });
    const { id } = req.params;
    const { qty } = req.body;

    if (typeof qty !== "number" || qty < 1 || !Number.isInteger(qty)) {
      return res.status(400).json({
        message: "qty must be a positive integer",
        field: "qty",
      });
    }

    await cartService.updateCartItemQuantity(id, qty);
    res.json({ success: true, message: "Cart item updated" });
  } catch (error) {
    console.error("[cartController] updateCartItemQuantity error:", error);
    if (error.message === "Cart item not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
