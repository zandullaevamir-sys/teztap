import express from "express";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Bir nechta rasm yuklash (maks 6 ta) — CreateListing sahifasidan chaqiriladi
router.post("/", requireAuth, upload.array("images", 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Rasm fayllari topilmadi" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

    res.json({ urls });
  } catch (err) {
    console.error("Rasm yuklash xatosi:", err.message);
    res.status(500).json({ error: "Rasm yuklashda xatolik yuz berdi" });
  }
});

export default router;
