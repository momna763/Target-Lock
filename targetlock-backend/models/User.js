import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true }, // unique already creates index
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true }, // remove index:true
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Reuse existing model if already compiled
export default mongoose.models.User || mongoose.model("User", userSchema);
