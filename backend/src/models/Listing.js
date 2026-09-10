import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    type: { type: String, enum: ["mahsulot", "ish"], default: "mahsulot" },
    city: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "sold", "archived"], default: "active" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text" });

export default mongoose.model("Listing", listingSchema);
