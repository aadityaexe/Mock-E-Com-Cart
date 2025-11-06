// Order controller - handles order-related HTTP requests
// Keep controllers thin: validate inputs, call services, handle known errors
import * as orderService from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    console.log("[orderController] createOrder", req.body);
    const receipt = await orderService.createOrder(req.body);
    res.status(201).json(receipt);
  } catch (error) {
    console.error("[orderController] createOrder error:", error);
    if (
      error.message === "Cart is empty" ||
      error.message === "No valid items in cart"
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    console.log("[orderController] getOrderById", req.params);
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.json(order);
  } catch (error) {
    console.error("[orderController] getOrderById error:", error);
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    console.log("[orderController] listOrders", req.query);
    const limitRaw = req.query.limit;
    const parsed = limitRaw ? parseInt(limitRaw, 10) : 20;
    const limit = Number.isInteger(parsed) && parsed > 0 ? parsed : 20;
    const orders = await orderService.listOrders(limit);
    res.json(orders);
  } catch (error) {
    console.error("[orderController] listOrders error:", error);
    next(error);
  }
};
