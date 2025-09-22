import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/sync  -> creates/returns Mongo user (protected)
router.post("/sync", authenticate, async (req, res) => {
  try {
    const decoded = req.firebaseUser;
    const uid = decoded.uid || decoded.user_id;
    const email = decoded.email;
    const nameFromToken = decoded.name || decoded.displayName || "";
    const nameFromBody = req.body.name || "";
    const name = nameFromToken || nameFromBody || "";

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({ firebaseUid: uid, email, name });
    } else {
      let shouldUpdate = false;
      if (user.email !== email) { user.email = email; shouldUpdate = true; }
      if (name && user.name !== name) { user.name = name; shouldUpdate = true; }
      if (shouldUpdate) await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
});

export default router;
