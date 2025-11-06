import React, { useState } from "react";

/**
 * CheckoutForm component - form for customer information during checkout
 */
export function CheckoutForm({ onComplete, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "Vibe Commerce",
    paymentMode: "Card",
  });
  const [errors, setErrors] = useState({});

  /**
   * Validate form data
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onComplete({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || "Vibe Commerce",
        paymentMode: formData.paymentMode,
      });
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary-900"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className={`w-full border ${
            errors.name ? "border-red-500" : "border-border"
          } px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
          placeholder="Jane Doe"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={loading}
          required
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary-900"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          className={`w-full border ${
            errors.email ? "border-red-500" : "border-border"
          } px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={loading}
          required
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="company"
          className="block text-sm font-medium text-primary-900"
        >
          Company
        </label>
        <input
          id="company"
          type="text"
          className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          placeholder="Vibe Commerce"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="paymentMode"
          className="block text-sm font-medium text-primary-900"
        >
          Payment Method
        </label>
        <select
          id="paymentMode"
          className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          value={formData.paymentMode}
          onChange={(e) => handleChange("paymentMode", e.target.value)}
          disabled={loading}
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="NetBanking">NetBanking</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
      >
        {loading ? "Processing..." : "Complete Order"}
      </button>
    </form>
  );
}
