import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  nameUz: { type: String, required: true },
  nameRu: { type: String, required: true },
  icon: { type: String, default: "📦" },
  type: { type: String, enum: ["mahsulot", "ish"], default: "mahsulot" },
});

export default mongoose.model("Category", categorySchema);
