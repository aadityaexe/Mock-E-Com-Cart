/**
 * Cart service - handles all cart-related business logic
 */
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import { getProductById } from "./productService.js";

/**
 * Get all cart items with populated product details and calculate total
 */
export const getCart = async () => {
  console.log("[cartService] getCart");
  const items = await CartItem.find().populate("product").lean();
  const total = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );
  return { items, total };
};

/**
 * Add item to cart or update quantity if item already exists
 */
export const addToCart = async (productId, qty) => {
  console.log("[cartService] addToCart", { productId, qty });
  // Verify product exists
  await getProductById(productId);

  // Check if item already exists in cart
  const existingItem = await CartItem.findOne({ product: productId });

  if (existingItem) {
    // Update quantity
    existingItem.qty += qty;
    await existingItem.save();
    return existingItem;
  } else {
    // Create new cart item
    const newItem = await CartItem.create({ product: productId, qty });
    return newItem;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId) => {
  console.log("[cartService] removeFromCart", { cartItemId });
  const item = await CartItem.findByIdAndDelete(cartItemId);
  if (!item) {
    throw new Error("Cart item not found");
  }
  return item;
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (cartItemId, qty) => {
  console.log("[cartService] updateCartItemQuantity", { cartItemId, qty });
  const item = await CartItem.findById(cartItemId);
  if (!item) {
    throw new Error("Cart item not found");
  }
  item.qty = qty;
  await item.save();
  return item;
};

/**
 * Clear all items from cart
 */
export const clearCart = async () => {
  console.log("[cartService] clearCart");
  await CartItem.deleteMany({});
};
