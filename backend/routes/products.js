import { Router } from "express";
import * as productController from "../controllers/productController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

/**
 * GET /api/products
 * Get all products (5-10 items)
 */
router.get("/", asyncHandler(productController.getAllProducts));

export default router;
