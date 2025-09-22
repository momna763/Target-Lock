import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    metric: {
      type: String,
      required: true,
      enum: ["price", "sales", "popularity", "profitability", "stock"],
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    previousValue: {
      type: Number,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercentage: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ["manual", "api", "web-scraping", "calculated"],
      default: "manual",
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
trendSchema.index({ productId: 1, date: -1 });
trendSchema.index({ productId: 1, metric: 1, date: -1 });
trendSchema.index({ metric: 1, date: -1 });

// ✅ Export as ESM default
export default mongoose.models.Trend || mongoose.model("Trend", trendSchema);
