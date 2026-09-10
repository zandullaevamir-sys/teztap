import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, unique: true, sparse: true, index: true },
    username: { type: String },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    city: { type: String, default: "Toshkent" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
