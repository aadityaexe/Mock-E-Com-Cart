/**
 * API utility functions for communicating with the backend
 */

// Base URL of your backend API
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

/**
 * Handle API response and parse JSON
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed JSON data
 * @throws {Error} If response is not ok
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response;
};

/**
 * API wrapper with error handling
 */
export const api = {
  /**
   * Get all products
   */
  products: async () => {
    const response = await fetch(`${BASE_URL}api/products`);
    return handleResponse(response);
  },

  cart: {
    /**
     * Get cart with items and total
     */
    get: async () => {
      const response = await fetch(`${BASE_URL}api/cart`);
      return handleResponse(response);
    },

    /**
     * Add item to cart
     * @param {Object} payload - { productId, qty }
     */
    add: async (payload) => {
      const response = await fetch(`${BASE_URL}api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    },

    /**
     * Remove item from cart
     * @param {string} id - Cart item ID
     */
    remove: async (id) => {
      const response = await fetch(`${BASE_URL}api/cart/${id}`, {
        method: "DELETE",
      });
      return handleResponse(response);
    },

    /**
     * Update cart item quantity
     * @param {string} id - Cart item ID
     * @param {number} qty - New quantity
     */
    update: async (id, qty) => {
      const response = await fetch(`${BASE_URL}api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      return handleResponse(response);
    },
  },

  /**
   * Process checkout
   * @param {Object} payload - { name, email, company?, paymentMode?, cartItems? }
   */
  checkout: async (payload) => {
    const response = await fetch(`${BASE_URL}api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  orders: {
    /**
     * Create order
     * @param {Object} payload - { name, email, company?, paymentMode?, cartItems? }
     */
    create: async (payload) => {
      const response = await fetch(`${BASE_URL}api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    },

    /**
     * Get order by ID
     * @param {string} id - Order ID
     */
    get: async (id) => {
      const response = await fetch(`${BASE_URL}api/orders/${id}`);
      return handleResponse(response);
    },
  },

  invoice: {
    /**
     * Generate and download invoice PDF
     * @param {string} orderId - Order ID
     * @returns {Promise<Blob>} PDF blob
     */
    generate: async (orderId) => {
      const url = `${BASE_URL}api/invoice/generate?orderId=${encodeURIComponent(orderId)}`;
      const response = await fetch(url, {
        headers: { Accept: "application/pdf" },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invoice download failed");
      }
      return await response.blob();
    },
  },
};

/**
 * Format number as currency (INR ₹)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const currency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "₹0.00";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename for download
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
