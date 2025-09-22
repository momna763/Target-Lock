import dotenv from "dotenv";
dotenv.config();
import connectDB from "../db.js";
import Product from "../models/Product.js";
import Trend from "../models/Trend.js";

const sampleProducts = [
  { name: "Wireless Mouse", category: "Electronics", profitabilityScore: 88, trendPercentage: 25, imageUrl: "", markets: ["US","UK"] },
  { name: "Yoga Mat", category: "Fitness", profitabilityScore: 75, trendPercentage: 18, imageUrl: "", markets: ["US"] },
  { name: "LED Desk Lamp", category: "Home", profitabilityScore: 68, trendPercentage: 12, imageUrl: "", markets: ["US","CA"] },
  { name: "Bluetooth Speaker", category: "Electronics", profitabilityScore: 91, trendPercentage: 30, imageUrl: "", markets: ["US","UK","DE"] },
  { name: "Coffee Grinder", category: "Kitchen", profitabilityScore: 80, trendPercentage: 20, imageUrl: "", markets: ["US"] }
];

(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Trend.deleteMany({});
    const created = await Product.insertMany(sampleProducts);

    const trends = [];
    const days = 7;
    for (const p of created) {
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const value = Math.round(Math.random() * 30) + 5;
        trends.push({ productId: p._id, date, metric: "searchVolume", value });
      }
    }
    await Trend.insertMany(trends);
    console.log("✅ Seeding done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
