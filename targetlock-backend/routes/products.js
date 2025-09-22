import express from "express";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products
router.get("/", authenticate, async (req, res) => {
  try {
    const products = await Product.find().sort({ profitabilityScore: -1 }).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/metrics
router.get("/metrics", authenticate, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const avgAgg = await Product.aggregate([{ $group: { _id: null, avg: { $avg: "$profitabilityScore" } } }]);
    const avgProfitability = avgAgg[0] ? Math.round(avgAgg[0].avg) : 0;
    const trendingThisWeek = await Product.countDocuments({ trendPercentage: { $gte: 10 } });
    const topCatAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topCategory = topCatAgg[0]?._id || null;
    const markets = await Product.distinct("markets");
    const marketsCovered = markets.length;

    res.json({ totalProducts, avgProfitability, trendingThisWeek, topCategory, marketsCovered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
