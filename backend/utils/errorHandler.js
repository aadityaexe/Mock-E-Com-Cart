/**
 * 404 Not Found handler
 */
export function notFound(req, res, next) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
  });
}

/**
 * Global error handler
 * Maps common Mongoose errors to consistent API responses
 */
export function errorHandler(err, req, res, next) {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      field,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
      field: err.path,
    });
  }

  // Default error
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Internal server error";

  // Always log error
  console.error("[errorHandler]", {
    method: req.method,
    url: req.originalUrl,
    status,
    message: err.message,
    stack: err.stack,
  });

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
