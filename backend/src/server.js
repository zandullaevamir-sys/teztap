import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { initChatSocket } from "./socket/chatSocket.js";

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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
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

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishlamoqda`));
});
