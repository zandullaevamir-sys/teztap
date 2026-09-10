import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export function initChatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send_message", async ({ chatId, senderId, text }) => {
      try {
        const message = await Message.create({ chat: chatId, sender: senderId, text });
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: text,
          lastMessageAt: new Date(),
        });
        io.to(chatId).emit("new_message", message);
      } catch (err) {
        console.error("Socket xabar xatosi:", err.message);
      }
    });

    socket.on("disconnect", () => {});
  });
}
