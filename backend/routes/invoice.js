import { Router } from "express";
import * as invoiceController from "../controllers/invoiceController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

/**
 * GET /api/invoice/generate?orderId=...
 * Generate and download invoice PDF for an order
 */
router.get("/generate", asyncHandler(invoiceController.generateInvoice));

export default router;


