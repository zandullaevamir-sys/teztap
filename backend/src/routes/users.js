import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Joriy foydalanuvchi profili
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  res.json({ user });
});

// Boshqa foydalanuvchi profili (ochiq)
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-phone");
  if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  res.json({ user });
});

// Mening e'lonlarim
router.get("/me/listings", requireAuth, async (req, res) => {
  const listings = await Listing.find({ seller: req.userId })
    .populate("category", "nameUz nameRu icon")
    .sort({ createdAt: -1 });
  res.json({ listings });
});

// Sevimli e'lonlarim
router.get("/me/favorites", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).populate({
    path: "favorites",
    populate: { path: "category", select: "nameUz nameRu icon" },
  });
  res.json({ favorites: user.favorites });
});

// Profilni yangilash (shahar, ism va h.k.)
router.put("/me", requireAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
  res.json({ user });
});

export default router;
