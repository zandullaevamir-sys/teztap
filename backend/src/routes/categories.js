import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const categories = await Category.find(filter);
  res.json({ categories });
});

export default router;
