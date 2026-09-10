import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Mening suhbatlarim ro'yxati
router.get("/", requireAuth, async (req, res) => {
  const chats = await Chat.find({ participants: req.userId })
    .populate("participants", "firstName lastName avatar")
    .populate("listing", "title images price")
    .sort({ lastMessageAt: -1 });
  res.json({ chats });
});

// Yangi suhbat boshlash (sotuvchi bilan)
router.post("/", requireAuth, async (req, res) => {
  const { sellerId, listingId } = req.body;

  let chat = await Chat.findOne({
    participants: { $all: [req.userId, sellerId] },
    listing: listingId,
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [req.userId, sellerId],
      listing: listingId,
    });
  }

  const populated = await chat.populate([
    { path: "participants", select: "firstName lastName avatar" },
    { path: "listing", select: "title images price" },
  ]);
  res.status(201).json({ chat: populated });
});

// Suhbatdagi xabarlar
router.get("/:id/messages", requireAuth, async (req, res) => {
  const messages = await Message.find({ chat: req.params.id }).sort({ createdAt: 1 });
  res.json({ messages });
});

// Xabar yuborish (REST fallback; real-time uchun socket ham ishlatiladi)
router.post("/:id/messages", requireAuth, async (req, res) => {
  const { text } = req.body;
  const message = await Message.create({
    chat: req.params.id,
    sender: req.userId,
    text,
  });
  await Chat.findByIdAndUpdate(req.params.id, {
    lastMessage: text,
    lastMessageAt: new Date(),
  });
  res.status(201).json({ message });
});

export default router;
