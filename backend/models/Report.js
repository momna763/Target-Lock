import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['product-analysis', 'trend-report', 'profitability-report', 'custom'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  filters: {
    dateRange: {
      start: Date,
      end: Date
    },
    categories: [String],
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ userId: 1, type: 1 });
reportSchema.index({ generatedAt: -1 });
reportSchema.index({ type: 1, generatedAt: -1 });

// ✅ Export as ESM default
export default mongoose.models.Report || mongoose.model("Report", reportSchema);
