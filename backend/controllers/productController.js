/**
 * Product controller - handles product-related HTTP requests
 */
import * as productService from "../services/productService.js";

/**
 * GET /api/products
 * Get all products
 */
export const getAllProducts = async (req, res, next) => {
  try {
    console.log("[productController] getAllProducts");
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("[productController] getAllProducts error:", error);
    next(error);
  }
};
