/**
 * Order service - handles all order-related business logic
 */
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import { getProductsByIds } from "./productService.js";
import { clearCart } from "./cartService.js";

const TAX_RATE = 0.1; // 10% tax

/**
 * Calculate order totals from items
 */
const calculateTotals = (items) => {
  console.log("[orderService] calculateTotals", { itemsCount: items?.length });
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

/**
 * Generate unique invoice ID
 */
const generateInvoiceId = () => {
  console.log("[orderService] generateInvoiceId");
  return (
    "rcpt_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
};

/**
 * Create order from cart items or provided items
 */
export const createOrder = async (orderData) => {
  console.log("[orderService] createOrder", orderData);
  const { name, email, company, paymentMode, cartItems } = orderData;

  let items = [];

  if (Array.isArray(cartItems) && cartItems.length > 0) {
    // Use provided cart items
    const productIds = cartItems.map((item) => item.productId);
    const products = await getProductsByIds(productIds);
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    items = cartItems
      .filter((item) => productMap.has(String(item.productId)) && item.qty > 0)
      .map((item) => ({
        qty: item.qty,
        product: productMap.get(String(item.productId)),
      }));

    if (items.length === 0) {
      throw new Error("No valid items in cart");
    }
  } else {
    // Use database cart
    const dbItems = await CartItem.find().populate("product").lean();
    items = dbItems.map((item) => ({
      qty: item.qty,
      product: item.product,
    }));

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }
  }

  const { subtotal, tax, total } = calculateTotals(items);
  const invoiceId = generateInvoiceId();

  // Create order document
  const order = await Order.create({
    invoiceId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: (company || "Vibe Commerce").trim(),
    paymentMode: paymentMode || "Card",
    items: items.map((item) => ({
      qty: item.qty,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      },
    })),
    subtotal,
    tax,
    total,
    timestamp: Date.now(),
  });

  // Clear database cart if we used it
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    await clearCart();
  }

  // Format receipt response
  return {
    id: invoiceId,
    orderId: order._id,
    name: order.name,
    email: order.email,
    company: order.company,
    paymentMode: order.paymentMode,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    items: order.items.map((item, idx) => ({
      _id: item._id || `it_${idx}`,
      qty: item.qty,
      product: item.product,
    })),
    timestamp: order.timestamp,
  };
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  console.log("[orderService] getOrderById", { orderId });
  const order = await Order.findById(orderId).lean();
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

/**
 * List orders (most recent first)
 */
export const listOrders = async (limit = 20) => {
  console.log("[orderService] listOrders", { limit });
  const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 20;
  const orders = await Order.find().sort({ timestamp: -1 }).limit(safeLimit).lean();
  return orders;
};
