/**
 * Invoice controller - handles invoice PDF generation
 */
import * as orderService from "../services/orderService.js";

/**
 * Generate PDF invoice for an order
 */
const generatePDF = async (order) => {
  // Lazy-import pdfkit so missing module doesn't crash startup
  let PDFDocument;
  try {
    ({ default: PDFDocument } = await import("pdfkit"));
  } catch (err) {
    // Surface a clear error up the stack
    throw new Error("PDF generator module not available");
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Build document
    try {
      drawHeader(doc, order);
      drawCustomer(doc, order);
      const y = drawTable(doc, order);
      drawTotals(doc, order, y + 10);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Draw header section
 */
function drawHeader(doc, order) {
  doc
    .fontSize(20)
    .fillColor("#111827")
    .text(order.company || "Vibe Commerce", 50, 50);
}

/**
 * Draw customer information section
 */
function drawCustomer(doc, order) {
  doc
    .moveDown(1)
    .fontSize(10)
    .fillColor("#374151")
    .text(`Invoice: ${order.invoiceId}`)
    .text(`Date: ${new Date(order.timestamp).toLocaleString()}`)
    .moveDown(0.5)
    .text(`Customer: ${order.name}`)
    .text(`Email: ${order.email}`);
}

/**
 * Draw items table
 */
function drawTable(doc, order) {
  const startY = 200;
  const colX = [50, 300, 370, 450];
  const rowH = 24;

  // Table header
  doc.fontSize(11).fillColor("#111827").text("Item", colX[0], startY);
  doc.text("Qty", colX[1], startY);
  doc.text("Price", colX[2], startY);
  doc.text("Amount", colX[3], startY);
  doc
    .moveTo(50, startY + 18)
    .lineTo(550, startY + 18)
    .stroke("#e5e7eb");

  // Table rows
  let y = startY + 30;
  order.items.forEach((item) => {
    const amount = item.qty * item.product.price;
    doc
      .fontSize(10)
      .fillColor("#374151")
      .text(item.product.name, colX[0], y, { width: 240 })
      .text(String(item.qty), colX[1], y)
      .text(`₹${(item.product.price / 100).toFixed(2)}`, colX[2], y)
      .text(`₹${(amount / 100).toFixed(2)}`, colX[3], y);
    y += rowH;
  });

  return y + 10;
}

/**
 * Draw totals section
 */
function drawTotals(doc, order, y) {
  const labelX = 380;
  const valueX = 450;
  const lineH = 18;

  doc
    .fontSize(10)
    .fillColor("#374151")
    .text("Subtotal", labelX, y)
    .text(`₹${(order.subtotal / 100).toFixed(2)}`, valueX, y, {
      width: 100,
      align: "right",
    });
  y += lineH;
  doc
    .text("Tax (10%)", labelX, y)
    .text(`₹${(order.tax / 100).toFixed(2)}`, valueX, y, {
      width: 100,
      align: "right",
    });
  y += lineH;
  doc
    .moveTo(labelX, y + 2)
    .lineTo(550, y + 2)
    .stroke("#e5e7eb");
  y += 8;
  doc
    .fontSize(11)
    .fillColor("#111827")
    .text("Total", labelX, y)
    .text(`₹${(order.total / 100).toFixed(2)}`, valueX, y, {
      width: 100,
      align: "right",
    });
}

/**
 * GET /api/invoice/generate
 * Generate and download invoice PDF
 */
export const generateInvoice = async (req, res, next) => {
  try {
    console.log("[invoiceController] generateInvoice", req.query);
    const { orderId } = req.query;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "orderId query parameter is required" });
    }

    const order = await orderService.getOrderById(orderId);
    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(order);
    } catch (pdfErr) {
      console.error("[invoiceController] generateInvoice pdf generation failed:", pdfErr);
      return res.status(503).json({
        message: "Invoice PDF generation is temporarily unavailable",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order.invoiceId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[invoiceController] generateInvoice error:", error);
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
