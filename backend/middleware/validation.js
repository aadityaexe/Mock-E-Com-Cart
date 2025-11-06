/**
 * Validation middleware for request body validation
 */

/**
 * Validates product ID and quantity for cart operations
 */
export const validateCartItem = (req, res, next) => {
  const { productId, qty } = req.body || {};

  if (!productId) {
    return res.status(400).json({
      message: "productId is required",
      field: "productId",
    });
  }

  if (typeof qty !== "number" || qty < 1 || !Number.isInteger(qty)) {
    return res.status(400).json({
      message: "qty must be a positive integer",
      field: "qty",
    });
  }

  next();
};

/**
 * Validates checkout request body
 */
export const validateCheckout = (req, res, next) => {
  const { name, email, cartItems } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "name is required and must be a non-empty string",
      field: "name",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "valid email is required",
      field: "email",
    });
  }

  if (cartItems && !Array.isArray(cartItems)) {
    return res.status(400).json({
      message: "cartItems must be an array",
      field: "cartItems",
    });
  }

  if (cartItems && cartItems.length > 0) {
    for (const item of cartItems) {
      if (!item.productId) {
        return res.status(400).json({
          message: "each cartItem must have a productId",
          field: "cartItems",
        });
      }
      if (
        typeof item.qty !== "number" ||
        item.qty < 1 ||
        !Number.isInteger(item.qty)
      ) {
        return res.status(400).json({
          message: "each cartItem must have a valid qty (positive integer)",
          field: "cartItems",
        });
      }
    }
  }

  next();
};

/**
 * Validates MongoDB ObjectId parameter
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "id parameter is required",
      field: "id",
    });
  }

  // Basic ObjectId format check (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return res.status(400).json({
      message: "invalid id format",
      field: "id",
    });
  }

  next();
};
