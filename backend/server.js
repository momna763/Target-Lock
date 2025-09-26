// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import Trend from "./models/Trend.js";
import User from "./models/User.js";
import Report from "./models/Report.js";

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
// Mock data for testing
const mockProducts = [
  { name: 'Smart Lamp', category: 'Electronics', profitabilityScore: 85, trendPercentage: 12 },
  { name: 'Eco Bottle', category: 'Home', profitabilityScore: 78, trendPercentage: 8 },
  { name: 'Yoga Mat', category: 'Fitness', profitabilityScore: 92, trendPercentage: 15 },
  { name: 'Face Cream', category: 'Beauty', profitabilityScore: 88, trendPercentage: 10 }
];

// Real database endpoints (these will be used now)

// Sync user with Firebase
app.post("/api/sync-user", async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;

    if (!uid || !email || !name) {
      return res.status(400).json({ error: "Missing required fields: uid, email, name" });
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email,
        name,
        profilePicture: photoURL,
      });
      await user.save();
    } else {
      user.name = name;
      user.email = email;
      user.profilePicture = photoURL;
      await user.save();
    }

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Sync user error:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// Get user by Firebase UID
app.get("/api/user/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create/Update Product
app.post("/api/products", async (req, res) => {
  try {
    const productData = req.body;
    let product;

    if (productData._id) {
      product = await Product.findByIdAndUpdate(productData._id, productData, { new: true });
    } else {
      product = new Product(productData);
      await product.save();
    }

    res.json(product);
  } catch (error) {
    console.error("Create/Update product error:", error);
    res.status(500).json({ error: "Failed to save product" });
  }
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

// Create trend data
app.post("/api/trends", async (req, res) => {
  try {
    const trendData = req.body;

    if (!trendData.productId || !trendData.metric || trendData.value === undefined) {
      return res.status(400).json({ error: "Missing required fields: productId, metric, value" });
    }

    const trend = new Trend(trendData);
    await trend.save();

    res.json(trend);
  } catch (error) {
    console.error("Create trend error:", error);
    res.status(500).json({ error: "Failed to create trend" });
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

// Generate report
app.post("/api/reports", async (req, res) => {
  try {
    const reportData = req.body;

    if (!reportData.userId || !reportData.type || !reportData.title || !reportData.data) {
      return res.status(400).json({ error: "Missing required fields: userId, type, title, data" });
    }

    const report = new Report(reportData);
    await report.save();

    res.json(report);
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
});

// Get user reports
app.get("/api/reports/:userId", async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId })
      .sort({ generatedAt: -1 })
      .lean();
    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
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
