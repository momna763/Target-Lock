import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // 👈 removed `index: true`
    imageUrl: { type: String, default: null },
    profitabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    trendPercentage: { type: Number, default: 0 },
    description: { type: String, trim: true },
    price: {
      current: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    availability: {
      inStock: { type: Boolean, default: true },
      stockCount: { type: Number, default: 0 },
    },
    tags: [{ type: String, trim: true }],
    trackedSince: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    metadata: {
      source: {
        type: String,
        enum: ["manual", "api", "web-scraping"],
        default: "manual",
      },
      externalId: String,
      url: String,
    },
  },
  { timestamps: true }
);

// ✅ Indexes
productSchema.index({ category: 1 });
productSchema.index({ profitabilityScore: -1 });
productSchema.index({ trendPercentage: -1 });
productSchema.index({ name: "text", category: "text" });

// ✅ Default export
export default mongoose.models.Product || mongoose.model("Product", productSchema);
