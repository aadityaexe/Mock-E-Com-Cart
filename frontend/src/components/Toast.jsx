import React, { useEffect } from "react";

/**
 * Toast component - displays temporary notification messages
 */
export function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-primary-900/90 text-white",
    warning: "bg-yellow-600 text-white",
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 ${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg ring-1 ring-border/50 z-50 animate-in fade-in slide-in-from-bottom-2 max-w-md`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
