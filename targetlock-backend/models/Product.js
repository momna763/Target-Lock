import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, index: true },
  imageUrl: { type: String, default: "" },
  profitabilityScore: { type: Number, default: 0 },
  trendPercentage: { type: Number, default: 0 },
  trackedSince: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  markets: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
