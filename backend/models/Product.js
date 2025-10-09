import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Core product info (from scraper)
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true }, // Keep as string to match scraped format
    image: { type: String, default: null },
    productUrl: { type: String, default: null },
    category: { type: String, required: true, trim: true },
    
    // Rating and reviews (from scraper)
    ratingScore: { type: mongoose.Schema.Types.Mixed, default: null }, // Can be string or number
    review: { type: mongoose.Schema.Types.Mixed, default: null }, // Can be string or number
    sellerName: { type: String, default: null },
    source: { type: String, default: "daraz.pk" },
    scrapedAt: { type: Date, default: Date.now },
    
    // Legacy fields (for backward compatibility)
    imageUrl: { type: String, default: null }, // Alias for image
    profitabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    trendPercentage: { type: Number, default: 0 },
    description: { type: String, trim: true },
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
        enum: ["manual", "api", "web-scraping", "daraz.pk"],
        default: "web-scraping",
      },
      externalId: String,
      url: String,
    },
  },
  { 
    timestamps: true,
    // Handle both old and new field names
    toJSON: { 
      transform: function(doc, ret) {
        // Ensure imageUrl is available for backward compatibility
        if (ret.image && !ret.imageUrl) ret.imageUrl = ret.image;
        if (ret.imageUrl && !ret.image) ret.image = ret.imageUrl;
        return ret;
      }
    }
  }
);

// ✅ Indexes
productSchema.index({ category: 1 });
productSchema.index({ profitabilityScore: -1 });
productSchema.index({ trendPercentage: -1 });
productSchema.index({ name: "text", category: "text" });

// ✅ Default export
export default mongoose.models.Product || mongoose.model("Product", productSchema);
