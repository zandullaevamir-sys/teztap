import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyTelegramInitData } from "../utils/telegramAuth.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// Telegram WebApp orqali avtomatik kirish/ro'yxatdan o'tish
router.post("/telegram", async (req, res) => {
  try {
    const { initData } = req.body;
    if (!initData) return res.status(400).json({ error: "initData kerak" });

    const tgUser = verifyTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: "Telegram ma'lumotlari tasdiqlanmadi" });

    let user = await User.findOne({ telegramId: String(tgUser.id) });
    if (!user) {
      user = await User.create({
        telegramId: String(tgUser.id),
        username: tgUser.username || "",
        firstName: tgUser.first_name || "",
        lastName: tgUser.last_name || "",
        avatar: tgUser.photo_url || "",
      });
    }

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Telefon raqamini saqlash (Telegram requestContact orqali)
router.post("/phone", async (req, res) => {
  try {
    const { userId, phone } = req.body;
    const user = await User.findByIdAndUpdate(userId, { phone }, { new: true });
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
