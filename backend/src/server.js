import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { initChatSocket } from "./socket/chatSocket.js";
import Category from "./models/Category.js";

import authRoutes from "./routes/auth.js";
import listingsRoutes from "./routes/listings.js";
import usersRoutes from "./routes/users.js";
import categoriesRoutes from "./routes/categories.js";
import chatRoutes from "./routes/chat.js";
import reviewsRoutes from "./routes/reviews.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

initChatSocket(io);

async function autoSeedCategories() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany([
      { slug: "phone-gadget", nameUz: "Telefon & Gadjet", nameRu: "Телефоны и гаджеты", icon: "📱", type: "mahsulot" },
      { slug: "auto-transport", nameUz: "Avto & Transport", nameRu: "Авто и транспорт", icon: "🚗", type: "mahsulot" },
      { slug: "real-estate", nameUz: "Ko'chmas mulk", nameRu: "Недвижимость", icon: "🏠", type: "mahsulot" },
      { slug: "electronics", nameUz: "Elektronika", nameRu: "Электроника", icon: "💻", type: "mahsulot" },
      { slug: "furniture", nameUz: "Mebel", nameRu: "Мебель", icon: "🛋️", type: "mahsulot" },
      { slug: "clothing", nameUz: "Kiyim-kechak", nameRu: "Одежда", icon: "👕", type: "mahsulot" },
    ]);
    console.log("✅ Kategoriyalar avtomatik qo'shildi");
  }
}

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET topilmadi. Iltimos .env faylida uni belgilang.");
}

connectDB().then(async () => {
  await autoSeedCategories();
  server.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlamoqda`));
});
