import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Product schema (matching existing model)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: null },
  profitabilityScore: { type: Number, min: 0, max: 100, default: 0 },
  trendPercentage: { type: Number, default: 0 },
  description: { type: String, trim: true },
  price: {
    current: { type: Number, default: 0 },
    currency: { type: String, default: "PKR" },
  },
  availability: {
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
  },
  tags: [{ type: String, trim: true }],
  trackedSince: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  metadata: {
    source: { type: String, default: "web-scraping" },
    externalId: String,
    url: String,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

// Helper function to extract brand from product name
const extractBrand = (name) => {
  const brands = ['Samsung', 'iPhone', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Huawei', 'Nokia', 'Infinix', 'Tecno'];
  const upperName = name.toUpperCase();
  
  for (const brand of brands) {
    if (upperName.includes(brand.toUpperCase())) {
      return brand;
    }
  }
  return 'Mobile';
};

// Helper function to categorize by price
const getPriceCategory = (price) => {
  if (price < 30000) return 'Budget';
  if (price < 80000) return 'Mid-Range';
  return 'Premium';
};

// Migration function
const migrateScrapedData = async () => {
  try {
    await connectDB();
    
    // Get raw scraped data from smartphones_clean collection
    const db = mongoose.connection.db;
    const scrapedData = await db.collection('smartphones_clean').find({}).toArray();
    
    console.log(`📱 Found ${scrapedData.length} scraped products`);
    
    if (scrapedData.length === 0) {
      console.log("❌ No data found in smartphones_clean collection. Make sure Colab scraping completed successfully.");
      process.exit(1);
    }
    
    // Debug: Show sample data structure (uncomment if needed)
    // console.log("🔍 Sample data structure:");
    // console.log(JSON.stringify(scrapedData[0], null, 2));
    
    // Transform and insert data
    const transformedProducts = scrapedData.map(item => {
      // Extract price number from string (e.g., "Rs. 45,000" -> 45000)
      let priceNumber = 0;
      
      if (item.price) {
        if (typeof item.price === 'string') {
          const priceMatch = item.price.match(/[\d,]+/);
          priceNumber = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
        } else if (typeof item.price === 'number') {
          priceNumber = item.price;
        }
      }
      
      // Generate profitability score based on price range and brand
      let profitabilityScore = 50; // default
      const brand = extractBrand(item.name || '');
      
      if (priceNumber < 30000) {
        profitabilityScore = Math.floor(Math.random() * 20) + 70; // 70-90 (budget phones have higher margins)
      } else if (priceNumber < 80000) {
        profitabilityScore = Math.floor(Math.random() * 20) + 60; // 60-80
      } else {
        profitabilityScore = Math.floor(Math.random() * 20) + 40; // 40-60 (premium phones have lower margins)
      }
      
      // Adjust for popular brands
      if (['iPhone', 'Samsung'].includes(brand)) {
        profitabilityScore = Math.max(profitabilityScore - 10, 30);
      }
      
      return {
        name: item.name || "Unknown Smartphone",
        category: "Smartphones",
        imageUrl: item.image || null,
        profitabilityScore: profitabilityScore,
        trendPercentage: Math.floor(Math.random() * 25), // Random 0-25%
        description: `${brand} smartphone - ${item.name || 'Mobile Phone'}. Available on Daraz Pakistan.`,
        price: {
          current: priceNumber,
          currency: "PKR"
        },
        availability: {
          inStock: true,
          stockCount: Math.floor(Math.random() * 50) + 10 // Random 10-60
        },
        tags: [
          brand,
          "Smartphone",
          "Electronics",
          "Mobile",
          getPriceCategory(priceNumber),
          "Daraz"
        ].filter(Boolean),
        metadata: {
          source: "web-scraping",
          externalId: item._id?.toString(),
          url: item.url || null
        }
      };
    });
    
    // Clear existing products and insert new ones
    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    
    console.log("📥 Inserting transformed products...");
    await Product.insertMany(transformedProducts);
    
    console.log(`✅ Successfully migrated ${transformedProducts.length} products`);
    
    // Show sample data
    console.log("\n📊 Sample products:");
    const samples = transformedProducts.slice(0, 3);
    samples.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: ${product.price.currency} ${product.price.current.toLocaleString()}`);
      console.log(`   Profitability: ${product.profitabilityScore}%`);
      console.log(`   Brand: ${product.tags[0]}`);
      console.log(`   URL: ${product.metadata.url ? 'Available' : 'N/A'}`);
      console.log("");
    });
    
    // Show statistics
    const brands = {};
    const priceRanges = { budget: 0, midRange: 0, premium: 0 };
    
    transformedProducts.forEach(product => {
      const brand = product.tags[0];
      brands[brand] = (brands[brand] || 0) + 1;
      
      const price = product.price.current;
      if (price < 30000) priceRanges.budget++;
      else if (price < 80000) priceRanges.midRange++;
      else priceRanges.premium++;
    });
    
    console.log("📈 Statistics:");
    console.log(`Total Products: ${transformedProducts.length}`);
    console.log(`Budget (< 30k): ${priceRanges.budget}`);
    console.log(`Mid-Range (30k-80k): ${priceRanges.midRange}`);
    console.log(`Premium (> 80k): ${priceRanges.premium}`);
    console.log(`Top Brands:`, Object.entries(brands).sort((a, b) => b[1] - a[1]).slice(0, 5));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

// Run migration
migrateScrapedData();
