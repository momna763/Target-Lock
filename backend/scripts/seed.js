// backend/scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Trend from "../models/Trend.js";
import Report from "../models/Report.js";
import connectDB from "../db.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect database
    await connectDB();

    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Trend.deleteMany({});
    await Report.deleteMany({});
    console.log("🧹 Existing data removed");

    // Generate dummy users
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push({
        firebaseUid: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: i === 0 ? "admin" : "user",
        profilePicture: faker.image.avatar(),
        preferences: {
          theme: faker.helpers.arrayElement(["light", "dark", "system"]),
          notifications: faker.datatype.boolean(),
        },
      });
    }
    await User.insertMany(users);
    console.log(`✅ Inserted ${users.length} users`);

    // Generate dummy products
    const products = [];
    for (let i = 0; i < 20; i++) {
      products.push({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        imageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
        profitabilityScore: faker.number.int({ min: 60, max: 95 }),
        trendPercentage: faker.number.int({ min: -20, max: 40 }),
        description: faker.commerce.productDescription(),
        price: {
          current: parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
          currency: "USD",
        },
        availability: {
          inStock: faker.datatype.boolean(),
          stockCount: faker.number.int({ min: 0, max: 100 }),
        },
        tags: faker.helpers.arrayElements(
          ["new", "trending", "eco-friendly", "premium", "bestseller"],
          faker.number.int({ min: 1, max: 3 })
        ),
        trackedSince: faker.date.past(),
        lastUpdated: faker.date.recent(),
        metadata: {
          source: faker.helpers.arrayElement(["manual", "api", "web-scraping"]),
          externalId: faker.string.uuid(),
          url: faker.internet.url(),
        },
      });
    }
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    // Generate dummy trends
    const trends = [];
    for (const product of insertedProducts.slice(0, 10)) { // Add trends for first 10 products
      for (let i = 0; i < 5; i++) { // 5 trend points per product
        const baseValue = faker.number.int({ min: 50, max: 200 });
        trends.push({
          productId: product._id,
          date: faker.date.past(),
          metric: faker.helpers.arrayElement(["price", "sales", "popularity", "profitability", "stock"]),
          value: baseValue + faker.number.int({ min: -20, max: 20 }),
          change: faker.number.int({ min: -10, max: 15 }),
          changePercentage: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
          source: faker.helpers.arrayElement(["manual", "api", "web-scraping", "calculated"]),
        });
      }
    }
    await Trend.insertMany(trends);
    console.log(`✅ Inserted ${trends.length} trends`);

    // Generate dummy reports
    const reports = [];
    for (const user of users) {
      for (let i = 0; i < 2; i++) { // 2 reports per user
        reports.push({
          userId: user._id,
          type: faker.helpers.arrayElement(["product-analysis", "trend-report", "profitability-report", "custom"]),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          data: {
            summary: faker.lorem.paragraph(),
            metrics: {
              totalProducts: faker.number.int({ min: 10, max: 50 }),
              avgProfitability: faker.number.int({ min: 70, max: 95 }),
              topCategory: faker.commerce.department(),
            },
            charts: {
              type: "line",
              data: Array.from({ length: 7 }, () => faker.number.int({ min: 10, max: 100 }))
            }
          },
          filters: {
            dateRange: {
              start: faker.date.past(),
              end: faker.date.recent(),
            },
            categories: faker.helpers.arrayElements(
              ["Electronics", "Fashion", "Home", "Sports", "Beauty"],
              faker.number.int({ min: 1, max: 3 })
            ),
          },
          isPublic: faker.datatype.boolean(),
          tags: faker.helpers.arrayElements(
            ["monthly", "analysis", "performance", "insights"],
            faker.number.int({ min: 1, max: 2 })
          ),
        });
      }
    }
    await Report.insertMany(reports);
    console.log(`✅ Inserted ${reports.length} reports`);

    console.log("🎉 Database seeded successfully!");
    console.log(`📊 Created: ${users.length} users, ${products.length} products, ${trends.length} trends, ${reports.length} reports`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
