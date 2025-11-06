import { currency } from "../utils/api";

/**
 * CartView component - displays cart items with update and remove functionality
 */
export function CartView({ cart, onRemove, onQty, disabled = false }) {
  if (!cart.items?.length) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-6 text-center">
        <p className="text-muted-700 mb-2">Your cart is empty</p>
        <p className="text-sm text-muted-700">Add items to get started</p>
      </div>
    );
  }

  const handleQtyChange = (itemId, newQty) => {
    if (disabled) return;
    const numQty = Number(newQty);
    if (!isNaN(numQty) && numQty >= 1) {
      onQty(itemId, Math.floor(numQty));
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <h2 className="font-semibold text-lg mb-4 text-primary-900">Cart</h2>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-muted-100/50"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
              loading="lazy"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-primary-900 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-700">
                {currency(item.product.price)} each
              </p>
            </div>

            <input
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  return;
                }
                handleQtyChange(item._id, value);
              }}
              onBlur={(e) => {
                if (e.target.value === "" || Number(e.target.value) < 1) {
                  handleQtyChange(item._id, 1);
                }
              }}
              disabled={disabled}
              className="w-16 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Quantity for ${item.product.name}`}
            />

            <p className="w-20 text-right font-medium text-sm">
              {currency(item.qty * item.product.price)}
            </p>

            <button
              onClick={() => onRemove(item._id)}
              disabled={disabled}
              className="px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Remove ${item.product.name} from cart`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center font-semibold pt-4 mt-4 border-t border-border">
        <span className="text-primary-900">Total</span>
        <span className="text-lg text-primary-900">{currency(cart.total)}</span>
      </div>
    </div>
  );
}
