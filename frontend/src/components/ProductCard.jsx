import React, { useState } from "react";
import { currency } from "../utils/api";

/**
 * ProductCard component - displays a single product with add to cart functionality
 */
export default function ProductCard({ product, onAdd, disabled = false }) {
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (disabled || isAdding) return;
    setIsAdding(true);
    try {
      await onAdd(product._id, qty);
      setQty(1); // Reset quantity after adding
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsAdding(false);
    }
  };

  const handleQtyChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQty("");
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setQty(Math.floor(numValue));
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm ring-1 ring-border/60 p-4 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[4/3] sm:aspect-[3/2] object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="font-semibold text-primary-900 line-clamp-2 min-h-[2.5rem] mb-2">
        {product.name}
      </h3>
      <p className="text-lg font-medium text-primary-900 mb-3">
        {currency(product.price)}
      </p>
      <div className="flex gap-2 mt-auto">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={handleQtyChange}
          onBlur={(e) => {
            if (e.target.value === "" || Number(e.target.value) < 1) {
              setQty(1);
            }
          }}
          disabled={disabled || isAdding}
          className="w-20 sm:w-16 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Quantity"
        />
        <button
          onClick={handleAdd}
          disabled={disabled || isAdding || qty < 1}
          className="flex-1 inline-flex items-center justify-center bg-primary-600 text-white rounded-lg py-2 px-3 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
