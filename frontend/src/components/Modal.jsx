import { useEffect } from "react";

/**
 * Modal component - displays a modal dialog
 */
export function Modal({ open, title, children, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-surface p-5 sm:p-6 rounded-2xl w-full max-w-lg shadow-xl ring-1 ring-border/70 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-primary-900">
            {title}
          </h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted-100 hover:bg-muted-200 active:bg-muted-300 text-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
