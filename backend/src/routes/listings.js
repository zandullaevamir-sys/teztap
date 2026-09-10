import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Barcha e'lonlar (filter: category, city, search, type, page)
router.get("/", async (req, res) => {
  try {
    const { category, city, search, type, page = 1, limit = 10 } = req.query;
    const filter = { status: "active" };
    if (category) filter.category = category;
    if (city && city !== "all") filter.city = city;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const listings = await Listing.find(filter)
      .populate("category", "nameUz nameRu slug icon")
      .populate("seller", "firstName lastName avatar rating")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);
    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Bitta e'lon
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("category", "nameUz nameRu slug icon")
      .populate("seller", "firstName lastName avatar rating reviewsCount phone");

    if (!listing) return res.status(404).json({ error: "E'lon topilmadi" });
    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// E'lon yaratish
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, price, negotiable, images, category, type, city } = req.body;
    const listing = await Listing.create({
      title,
      description,
      price,
      negotiable,
      images,
      category,
      type,
      city,
      seller: req.userId,
    });
    res.status(201).json({ listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// E'lonni tahrirlash
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, seller: req.userId });
    if (!listing) return res.status(404).json({ error: "E'lon topilmadi" });

    Object.assign(listing, req.body);
    await listing.save();
    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// E'lonni o'chirish
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, seller: req.userId });
    if (!listing) return res.status(404).json({ error: "E'lon topilmadi" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Sevimlilarga qo'shish / olib tashlash
router.post("/:id/favorite", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const listingId = req.params.id;
    const idx = user.favorites.findIndex((f) => f.toString() === listingId);

    if (idx > -1) {
      user.favorites.splice(idx, 1);
    } else {
      user.favorites.push(listingId);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
