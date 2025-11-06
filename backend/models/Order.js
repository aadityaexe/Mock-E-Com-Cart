import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      image: {
        type: String,
        required: true,
        trim: true,
      },
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character"],
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    company: {
      type: String,
      default: "Vibe Commerce",
      trim: true,
    },
    paymentMode: {
      type: String,
      default: "Card",
      enum: ["Card", "UPI", "Cash", "NetBanking"],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

// Index for faster queries
OrderSchema.index({ email: 1 });
OrderSchema.index({ timestamp: -1 });

export default mongoose.model("Order", OrderSchema);


