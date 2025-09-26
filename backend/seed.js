// seed.js - Comprehensive Database Seeding for Target Lock
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Trend from "./models/Trend.js";
import Report from "./models/Report.js";
import User from "./models/User.js";

dotenv.config();

// Comprehensive product data
const products = [
  {
    name: "Smart LED Desk Lamp",
    category: "Electronics",
    profitabilityScore: 85,
    trendPercentage: 12,
    description: "Voice-controlled smart lamp with adjustable brightness and color temperature",
    price: { current: 89.99, currency: "USD" },
    availability: { inStock: true, stockCount: 45 },
    tags: ["smart-home", "led", "voice-control", "adjustable"],
    metadata: { source: "manual", externalId: "SL-001" }
  },
  {
    name: "Wireless Bluetooth Earbuds Pro",
    category: "Electronics",
    profitabilityScore: 78,
    trendPercentage: 8,
    description: "Premium wireless earbuds with active noise cancellation",
    price: { current: 199.99, currency: "USD" },
    availability: { inStock: true, stockCount: 23 },
    tags: ["audio", "wireless", "noise-cancelling", "premium"],
    metadata: { source: "manual", externalId: "WBEP-002" }
  },
  {
    name: "Eco-Friendly Stainless Steel Water Bottle",
    category: "Home & Kitchen",
    profitabilityScore: 90,
    trendPercentage: 15,
    description: "Insulated stainless steel bottle, keeps drinks cold for 24h, hot for 12h",
    price: { current: 34.99, currency: "USD" },
    availability: { inStock: true, stockCount: 67 },
    tags: ["eco-friendly", "sustainable", "insulated", "reusable"],
    metadata: { source: "manual", externalId: "WB-003" }
  },
  {
    name: "Smart Fitness Tracker Watch",
    category: "Wearables",
    profitabilityScore: 82,
    trendPercentage: 10,
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    price: { current: 299.99, currency: "USD" },
    availability: { inStock: true, stockCount: 12 },
    tags: ["fitness", "health", "gps", "heart-rate"],
    metadata: { source: "manual", externalId: "FTW-004" }
  },
  {
    name: "Organic Face Moisturizer Cream",
    category: "Beauty & Personal Care",
    profitabilityScore: 88,
    trendPercentage: 18,
    description: "All-natural organic face cream with hyaluronic acid and vitamin C",
    price: { current: 45.99, currency: "USD" },
    availability: { inStock: true, stockCount: 34 },
    tags: ["organic", "skincare", "natural", "anti-aging"],
    metadata: { source: "manual", externalId: "FMC-005" }
  },
  {
    name: "Ergonomic Office Chair",
    category: "Furniture",
    profitabilityScore: 75,
    trendPercentage: 6,
    description: "Premium ergonomic office chair with lumbar support and adjustable height",
    price: { current: 399.99, currency: "USD" },
    availability: { inStock: true, stockCount: 8 },
    tags: ["office", "ergonomic", "comfort", "adjustable"],
    metadata: { source: "manual", externalId: "EOC-006" }
  },
  {
    name: "Smart Coffee Maker",
    category: "Appliances",
    profitabilityScore: 80,
    trendPercentage: 14,
    description: "WiFi-enabled coffee maker with app control and customizable brewing",
    price: { current: 179.99, currency: "USD" },
    availability: { inStock: true, stockCount: 19 },
    tags: ["smart-appliance", "coffee", "wifi", "customizable"],
    metadata: { source: "manual", externalId: "SCM-007" }
  },
  {
    name: "Yoga Mat Premium",
    category: "Sports & Outdoors",
    profitabilityScore: 92,
    trendPercentage: 22,
    description: "Non-slip premium yoga mat made from natural rubber, 6mm thickness",
    price: { current: 79.99, currency: "USD" },
    availability: { inStock: true, stockCount: 28 },
    tags: ["yoga", "fitness", "non-slip", "natural-rubber"],
    metadata: { source: "manual", externalId: "YMP-008" }
  },
  {
    name: "Bluetooth Portable Speaker",
    category: "Electronics",
    profitabilityScore: 70,
    trendPercentage: 5,
    description: "Waterproof portable Bluetooth speaker with 360-degree sound",
    price: { current: 59.99, currency: "USD" },
    availability: { inStock: true, stockCount: 41 },
    tags: ["audio", "portable", "waterproof", "bluetooth"],
    metadata: { source: "manual", externalId: "BPS-009" }
  },
  {
    name: "Essential Oil Diffuser",
    category: "Home & Kitchen",
    profitabilityScore: 85,
    trendPercentage: 12,
    description: "Ultrasonic essential oil diffuser with LED lights and timer settings",
    price: { current: 39.99, currency: "USD" },
    availability: { inStock: true, stockCount: 56 },
    tags: ["aromatherapy", "essential-oils", "led", "timer"],
    metadata: { source: "manual", externalId: "EOD-010" }
  }
];

// Sample user data
const users = [
  {
    firebaseUid: "demo-user-123",
    email: "demo@targetlock.com",
    name: "Demo User",
    role: "admin"
  }
];

// Sample trend data for charts
const generateTrendData = (productId, metric, baseValue) => {
  const trends = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 10;
    const value = Math.max(0, baseValue + change);
    
    trends.push({
      productId,
      date,
      metric,
      value: Math.round(value * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercentage: Math.round((change / baseValue) * 100 * 100) / 100,
      source: "calculated"
    });
  }
  
  return trends;
};

// Sample reports data
const reports = [
  {
    userId: null, // Will be set after user creation
    type: "product-analysis",
    title: "Q4 Product Performance Analysis",
    description: "Comprehensive analysis of product performance for Q4 2024",
    data: {
      summary: "Strong performance in Electronics and Home & Kitchen categories",
      topPerformers: ["Smart LED Desk Lamp", "Eco-Friendly Stainless Steel Water Bottle"],
      recommendations: ["Increase stock of trending items", "Focus marketing on high-profitability products"]
    },
    filters: {
      dateRange: {
        start: new Date("2024-10-01"),
        end: new Date("2024-12-31")
      },
      categories: ["Electronics", "Home & Kitchen"]
    },
    isPublic: false,
    tags: ["quarterly", "performance", "analysis"]
  },
  {
    userId: null, // Will be set after user creation
    type: "trend-report",
    title: "Market Trends December 2024",
    description: "Latest market trends and consumer behavior insights",
    data: {
      trendingCategories: ["Wearables", "Sports & Outdoors"],
      growthRate: 15.5,
      keyInsights: ["Smart devices continue to grow", "Sustainability is key driver"]
    },
    filters: {
      dateRange: {
        start: new Date("2024-12-01"),
        end: new Date("2024-12-31")
      }
    },
    isPublic: true,
    tags: ["trends", "market-analysis", "monthly"]
  }
];

// Main seeding function
const seedDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");
    
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Product.deleteMany({});
    await Trend.deleteMany({});
    await Report.deleteMany({});
    await User.deleteMany({});
    
    // Create sample user first
    console.log("👤 Creating sample user...");
    const sampleUser = await User.create(users[0]);
    console.log(`✅ Created user: ${sampleUser.name} (${sampleUser.email})`);
    
    // Seed products
    console.log("📦 Seeding products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    // Seed trend data
    console.log("📈 Seeding trend data...");
    let trendCount = 0;
    for (const product of createdProducts) {
      const profitabilityTrends = generateTrendData(product._id, "profitability", product.profitabilityScore);
      const priceTrends = generateTrendData(product._id, "price", product.price.current);
      
      await Trend.insertMany([...profitabilityTrends, ...priceTrends]);
      trendCount += profitabilityTrends.length + priceTrends.length;
    }
    console.log(`✅ Created ${trendCount} trend data points`);
    
    // Seed reports
    console.log("📋 Seeding reports...");
    const reportsWithUserId = reports.map(report => ({
      ...report,
      userId: sampleUser._id
    }));
    const createdReports = await Report.insertMany(reportsWithUserId);
    console.log(`✅ Created ${createdReports.length} reports`);
    
    // Display summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   • Products: ${createdProducts.length}`);
    console.log(`   • Trend Data Points: ${trendCount}`);
    console.log(`   • Reports: ${createdReports.length}`);
    console.log(`   • Users: 1 (Demo User)`);
    console.log("\n🔗 Your dashboard should now show real data instead of mock data!");
    console.log("💡 Try refreshing your dashboard to see the changes.");
    
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    console.error("💡 Make sure your MONGO_URI is correctly set in the .env file");
    process.exit(1);
  }
};

// Run the seeding
console.log("🚀 Starting database seeding process...");
seedDB();
