import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [1, "Product name must be at least 1 character"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be non-negative"],
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
ProductSchema.index({ name: 1 });

export default mongoose.model("Product", ProductSchema);
