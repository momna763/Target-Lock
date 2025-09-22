import mongoose from "mongoose";

const trendSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  date: { type: Date, required: true },
  metric: { type: String, default: "searchVolume" },
  value: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Trend || mongoose.model("Trend", trendSchema);
