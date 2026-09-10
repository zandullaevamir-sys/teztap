import express from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Foydalanuvchiga yozilgan sharhlar
router.get("/:userId", async (req, res) => {
  const reviews = await Review.find({ toUser: req.params.userId })
    .populate("fromUser", "firstName lastName avatar")
    .sort({ createdAt: -1 });
  res.json({ reviews });
});

// Sharh qoldirish + reytingni qayta hisoblash
router.post("/", requireAuth, async (req, res) => {
  const { toUser, listing, rating, comment } = req.body;

  const review = await Review.create({
    fromUser: req.userId,
    toUser,
    listing,
    rating,
    comment,
  });

  const allReviews = await Review.find({ toUser });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await User.findByIdAndUpdate(toUser, {
    rating: avg.toFixed(1),
    reviewsCount: allReviews.length,
  });

  res.status(201).json({ review });
});

export default router;
