import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";

import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import trendRoutes from "./routes/trends.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

(async () => {
  try {
    await connectDB();

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/trends", trendRoutes);

    app.get("/", (req, res) => res.send("Target Lock API"));

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server started on port ${port}` ));
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();
