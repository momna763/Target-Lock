// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import Product from "./models/Product.js"; // adjust if your path is different
import connectDB from "./config/db.js";

dotenv.config();

const seedProducts = async () => {
  try {
    // connect database
    await connectDB();

    console.log("🌱 Starting database seeding...");

    // clear existing data
    await Product.deleteMany({});
    console.log("🧹 Existing products removed");

    // generate dummy products
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

    // insert products
    await Product.insertMany(products);

    console.log(`✅ Inserted ${products.length} products`);
    console.log("🎉 Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
