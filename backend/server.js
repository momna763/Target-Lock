// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import Trend from "./models/Trend.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Target Lock API is running" });
});

// Get all products with filtering
app.get("/api/products", async (req, res) => {
  try {
    const { category, minProfitability, limit = 50 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minProfitability) query.profitabilityScore = { $gte: parseInt(minProfitability) };

    const products = await Product.find(query)
      .sort({ profitabilityScore: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get trending products (top 5 by profitability)
app.get("/api/products/trending", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ profitabilityScore: -1 })
      .limit(5)
      .lean();
    res.json(products);
  } catch (error) {
    console.error("Get trending products error:", error);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

// Get dashboard metrics
app.get("/api/metrics", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const avgAgg = await Product.aggregate([
      { $group: { _id: null, avg: { $avg: "$profitabilityScore" } } }
    ]);
    const avgProfitability = avgAgg[0] ? Math.round(avgAgg[0].avg) : 0;

    const trendingThisWeek = await Product.countDocuments({
      trendPercentage: { $gte: 10 }
    });

    const topCatAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topCategory = topCatAgg[0]?._id || "N/A";

    const markets = await Product.distinct("tags");
    const marketsCovered = markets.length;

    res.json({
      totalProducts,
      avgProfitability,
      trendingThisWeek,
      topCategory,
      marketsCovered
    });
  } catch (error) {
    console.error("Get metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// Get trends for a specific product
app.get("/api/trends/:productId", async (req, res) => {
  try {
    const trends = await Trend.find({ productId: req.params.productId })
      .sort({ date: 1 })
      .lean();
    res.json(trends);
  } catch (error) {
    console.error("Get trends error:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// Get all users (admin only - for development)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Server startup
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5001;
    const productCount = await Product.countDocuments();

    app.listen(PORT, () => {
      console.log(`🚀 Target Lock API server running on port ${PORT}`);
      console.log(`📊 Ready to serve ${productCount} products`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

// Start server
startServer();

export default app;
