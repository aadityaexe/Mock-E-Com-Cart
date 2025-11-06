/**
 * Product service - handles all product-related business logic
 */
import Product from "../models/Product.js";

/**
 * Get all products (limited to 10)
 */
export const getAllProducts = async () => {
  console.log("[productService] getAllProducts");
  const products = await Product.find().limit(10).lean();
  return products;
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  console.log("[productService] getProductById", { productId });
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

/**
 * Get multiple products by IDs
 */
export const getProductsByIds = async (productIds) => {
  console.log("[productService] getProductsByIds", { idsCount: productIds?.length });
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  return products;
};

/**
 * Seed default products if collection is empty
 */
export const seedDefaultProducts = async () => {
  console.log("[productService] seedDefaultProducts");
  const count = await Product.countDocuments();
  if (count === 0) {
    const defaultProducts = [
      {
        name: "Nebula Hoodie",
        price: 1299,
        image: "https://picsum.photos/seed/hoodie/600/400",
      },
      {
        name: "Quantum Tee",
        price: 699,
        image: "https://picsum.photos/seed/tshirt/600/400",
      },
      {
        name: "Flux Sneakers",
        price: 2499,
        image: "https://picsum.photos/seed/sneakers/600/400",
      },
      {
        name: "Photon Backpack",
        price: 1799,
        image: "https://picsum.photos/seed/backpack/600/400",
      },
      {
        name: "Ion Bottle",
        price: 399,
        image: "https://picsum.photos/seed/bottle/600/400",
      },
      {
        name: "Orbit Cap",
        price: 499,
        image: "https://picsum.photos/seed/cap/600/400",
      },
      {
        name: "Nova Watch",
        price: 3499,
        image: "https://picsum.photos/seed/watch/600/400",
      },
      {
        name: "Aurora Sunglasses",
        price: 899,
        image: "https://picsum.photos/seed/sunglasses/600/400",
      },
    ];
    await Product.insertMany(defaultProducts);
    return true;
  }
  return false;
};
