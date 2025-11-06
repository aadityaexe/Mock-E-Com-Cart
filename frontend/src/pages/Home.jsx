import React, { useEffect, useState } from "react";
import { api, currency, downloadBlob } from "../utils/api";
import ProductCard from "../components/ProductCard";
import { CartView } from "../components/CartView";
import { CheckoutForm } from "../components/CheckoutForm";
import { Modal } from "../components/Modal";
import { Toast } from "../components/Toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Show toast message
   */
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  /**
   * Load products and cart on mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, cartData] = await Promise.all([
          api.products(),
          api.cart.get(),
        ]);
        setProducts(productsData);
        setCart(cartData);
      } catch (error) {
        showToast(
          error.message || "Failed to load data. Please refresh the page.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Add item to cart
   */
  const addToCart = async (productId, qty) => {
    if (!qty || qty < 1) qty = 1;
    try {
      setActionLoading(true);
      await api.cart.add({ productId, qty });
      const updatedCart = await api.cart.get();
      setCart(updatedCart);
      showToast("Item added to cart", "success");
    } catch (error) {
      showToast(error.message || "Failed to add item to cart", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (cartItemId) => {
    try {
      setActionLoading(true);
      await api.cart.remove(cartItemId);
      const updatedCart = await api.cart.get();
      setCart(updatedCart);
      showToast("Item removed from cart", "success");
    } catch (error) {
      showToast(error.message || "Failed to remove item", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Update cart item quantity
   */
  const updateCartItemQuantity = async (cartItemId, qty) => {
    const item = cart.items.find((i) => i._id === cartItemId);
    if (!item) {
      showToast("Item not found in cart", "error");
      return;
    }

    if (!qty || qty < 1) qty = 1;
    try {
      setActionLoading(true);
      await api.cart.update(cartItemId, qty);
      const updatedCart = await api.cart.get();
      setCart(updatedCart);
    } catch (error) {
      showToast(error.message || "Failed to update quantity", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Process checkout
   */
  const handleCheckout = async (customerInfo) => {
    try {
      setActionLoading(true);
      const payload = {
        ...customerInfo,
        cartItems: cart.items.map((item) => ({
          productId: item.product._id,
          qty: item.qty,
        })),
      };
      const receiptData = await api.checkout(payload);
      setReceipt(receiptData);
      setCart({ items: [], total: 0 });
      setShowCheckout(false);
      showToast("Order placed successfully!", "success");
    } catch (error) {
      showToast(error.message || "Checkout failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Download invoice PDF
   */
  const handleDownloadInvoice = async (receiptData) => {
    if (!receiptData?.orderId) {
      showToast("Invoice not available", "error");
      return;
    }

    try {
      setActionLoading(true);
      const pdfBlob = await api.invoice.generate(receiptData.orderId);
      downloadBlob(pdfBlob, `invoice_${receiptData.id}.pdf`);
      showToast("Invoice downloaded successfully", "success");
    } catch (error) {
      showToast(error.message || "Failed to download invoice", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-muted-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto min-h-screen">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-900">
          Vibe Commerce
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm sm:text-base">
          <span className="text-muted-700">
            Items: <strong>{cart.items.length}</strong>
          </span>
          <span className="hidden sm:inline text-muted-700">|</span>
          <span className="text-muted-700">
            Total: <strong>{currency(cart.total)}</strong>
          </span>
          <button
            disabled={!cart.items.length || actionLoading}
            className="ml-0 sm:ml-2 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
            onClick={() => setShowCheckout(true)}
          >
            {actionLoading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Products Section */}
        <section aria-label="Products" className="md:col-span-2">
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-700">
              <p>No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdd={addToCart}
                  disabled={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Cart Section */}
        <aside aria-label="Cart" className="md:sticky md:top-6 h-max">
          <CartView
            cart={cart}
            onRemove={removeFromCart}
            onQty={updateCartItemQuantity}
            disabled={actionLoading}
          />
        </aside>
      </div>

      {/* Checkout Modal */}
      <Modal
        open={showCheckout}
        title="Checkout"
        onClose={() => !actionLoading && setShowCheckout(false)}
      >
        <CheckoutForm onComplete={handleCheckout} loading={actionLoading} />
      </Modal>

      {/* Receipt Modal */}
      <Modal
        open={!!receipt}
        title="Order Receipt"
        onClose={() => setReceipt(null)}
      >
        {receipt && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-bold text-lg">{receipt.company}</p>
              <p className="text-sm text-muted-700">Invoice: {receipt.id}</p>
              <p className="text-sm">Customer: {receipt.name}</p>
              <p className="text-sm">Email: {receipt.email}</p>
              <p className="text-sm">Payment Mode: {receipt.paymentMode}</p>
              <p className="text-sm text-muted-700">
                Date: {new Date(receipt.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <h3 className="font-semibold mb-2">Items:</h3>
              {receipt.items.map((item) => (
                <div
                  key={item._id || item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} × {item.qty}
                  </span>
                  <span className="font-medium">
                    {currency(item.product.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-1">
              {typeof receipt.subtotal === "number" && (
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{currency(receipt.subtotal)}</span>
                </div>
              )}
              {typeof receipt.tax === "number" && (
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>{currency(receipt.tax)}</span>
                </div>
              )}
              <div className="font-bold flex justify-between border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-lg">{currency(receipt.total)}</span>
              </div>
            </div>

            <button
              disabled={!receipt.orderId || actionLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors mt-4"
              onClick={() => handleDownloadInvoice(receipt)}
            >
              {actionLoading ? "Downloading..." : "Download PDF Invoice"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
