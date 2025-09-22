import express from "express";
import Trend from "../models/Trend.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// GET /api/trends?productId=...
router.get("/", authenticate, async (req, res) => {
  try {
    const { productId } = req.query;
    const query = productId ? { productId } : {};
    const trends = await Trend.find(query).sort({ date: 1 }).lean();
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
